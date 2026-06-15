from flask import Blueprint, request, jsonify, current_app
from database import get_stats, get_recent_scans, get_history

stats_bp = Blueprint('stats', __name__)

@stats_bp.route('/stats', methods=['GET'])
def fetch_stats():
    try:
        stats = get_stats(current_app.config['DATABASE'])
        return jsonify(stats)
    except Exception as e:
        current_app.logger.error(f"Error fetching stats: {str(e)}")
        return jsonify({'error': 'Failed to fetch statistics'}), 500

@stats_bp.route('/recent', methods=['GET'])
def fetch_recent():
    try:
        limit = request.args.get('limit', default=10, type=int)
        recent = get_recent_scans(current_app.config['DATABASE'], limit)
        return jsonify(recent)
    except Exception as e:
        current_app.logger.error(f"Error fetching recent scans: {str(e)}")
        return jsonify({'error': 'Failed to fetch recent scans'}), 500

@stats_bp.route('/history', methods=['GET'])
def fetch_history():
    try:
        page = request.args.get('page', default=1, type=int)
        per_page = request.args.get('limit', default=20, type=int)
        search = request.args.get('search', default=None, type=str)
        
        history = get_history(current_app.config['DATABASE'], page, per_page, search)
        return jsonify(history)
    except Exception as e:
        current_app.logger.error(f"Error fetching scan history: {str(e)}")
        return jsonify({'error': 'Failed to fetch history'}), 500
