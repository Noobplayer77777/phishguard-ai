from flask import Blueprint, request, jsonify, current_app
import csv, io, os
from models.scan import ScanRequest
from services.analyzer import AnalysisService
from database import insert_scan

analyze_bp = Blueprint('analyze', __name__)

@analyze_bp.route('/analyze', methods=['POST'])
def analyze_url():
    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({'error': 'Missing URL parameter'}), 400
    scan_req = ScanRequest(data['url'])
    is_valid, error_msg = scan_req.is_valid()
    if not is_valid:
        return jsonify({'error': error_msg}), 400
    normalized_url = scan_req.get_normalized_url()
    try:
        analyzer = AnalysisService()
        result = analyzer.analyze(normalized_url)
        scan_id = insert_scan(
            current_app.config['DATABASE'],
            normalized_url,
            result['status'],
            result['risk_score'],
            result['reasons'],
            result.get('category', 'General')
        )
        result['scan_id'] = scan_id
        return jsonify(result)
    except Exception as e:
        current_app.logger.error(f"Error analyzing URL {normalized_url}: {str(e)}")
        return jsonify({
            'error': 'Analysis failed',
            'message': 'An internal error occurred during analysis.',
            'status': 'Error',
            'risk_score': 0
        }), 500

@analyze_bp.route('/analyze/batch', methods=['POST'])
def analyze_batch():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    file = request.files['file']
    if file.filename == '' or not file.filename.lower().endswith('.csv'):
        return jsonify({'error': 'Invalid file type; CSV expected'}), 400
    stream = io.StringIO(file.stream.read().decode('utf-8'))
    reader = csv.reader(stream)
    rows = list(reader)
    if not rows:
        return jsonify({'error': 'Empty CSV file'}), 400
    header = rows[0]
    has_header = any('url' in col.lower() for col in header)
    url_rows = rows[1:] if has_header else rows
    limit = int(os.getenv('CSV_BATCH_LIMIT', 100))
    url_rows = url_rows[:limit]

    analyzer = AnalysisService()
    results = []
    counts = {'Safe': 0, 'Suspicious': 0, 'Phishing': 0, 'Error': 0}
    for row in url_rows:
        if not row:
            continue
        url = row[0].strip()
        if not url:
            continue
        scan_req = ScanRequest(url)
        is_valid, _ = scan_req.is_valid()
        if not is_valid:
            counts['Error'] += 1
            results.append({'url': url, 'status': 'Error', 'risk_score': 0,
                            'reasons': [{'detector': 'Validator', 'reason': 'Invalid URL format', 'score': 0}]})
            continue
        normalized_url = scan_req.get_normalized_url()
        try:
            res = analyzer.analyze(normalized_url)
            insert_scan(
                current_app.config['DATABASE'],
                normalized_url,
                res['status'],
                res['risk_score'],
                res['reasons'],
                res.get('category', 'General')
            )
            counts[res['status']] = counts.get(res['status'], 0) + 1
            results.append(res)
        except Exception as e:
            current_app.logger.error(f"Batch analysis error for {url}: {e}")
            counts['Error'] += 1
            results.append({'url': url, 'status': 'Error', 'risk_score': 0,
                            'reasons': [{'detector': 'System', 'reason': str(e), 'score': 0}]})
    summary = {
        'total_processed': len(results),
        'counts': counts,
        'results': results
    }
    return jsonify(summary)
