import importlib
import pkgutil
import sys
import os

class AnalysisService:
    def __init__(self):
        self.detectors = self._load_detectors()

    def _load_detectors(self):
        detectors = []
        detectors_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'detectors')
        
        # We'll hardcode the expected detectors for now to ensure they load even if pkgutil fails
        from detectors.url_checker import URLChecker
        from detectors.ssl_checker import SSLChecker
        from detectors.domain_checker import DomainChecker
        from detectors.redirect_checker import RedirectChecker
        from detectors.keyword_checker import KeywordChecker
        
        return [
            URLChecker(),
            SSLChecker(),
            DomainChecker(),
            RedirectChecker(),
            KeywordChecker()
        ]

    def analyze(self, url):
        total_score = 0
        max_possible_score = 0
        reasons = []
        category = "General"
        
        for detector in self.detectors:
            try:
                result = detector.check(url)
                if result:
                    weight = getattr(detector, 'weight', 1.0)
                    total_score += result.get('score', 0) * weight
                    max_possible_score += 100 * weight
                    
                    if result.get('score', 0) > 0 and result.get('reason'):
                        reasons.append({
                            'detector': detector.__class__.__name__,
                            'reason': result['reason'],
                            'score': result['score'],
                            'details': result.get('details', {})
                        })
                        
                    # Infer category from KeywordChecker if available
                    if detector.__class__.__name__ == 'KeywordChecker' and 'category' in result:
                        category = result['category']
            except Exception as e:
                # Graceful degradation if a detector fails
                print(f"Detector {detector.__class__.__name__} failed: {str(e)}")

        # Normalize score to 0-100
        normalized_score = 0
        if max_possible_score > 0:
            normalized_score = min(100, int((total_score / max_possible_score) * 100))

        # Determine status
        status = "Safe"
        if normalized_score >= 65:
            status = "Phishing"
        elif normalized_score >= 30:
            status = "Suspicious"

        # Provide default positive reason if completely safe
        if len(reasons) == 0:
            reasons.append({
                'detector': 'General',
                'reason': 'No suspicious indicators detected.',
                'score': 0,
                'details': {}
            })

        return {
            'url': url,
            'risk_score': normalized_score,
            'status': status,
            'reasons': reasons,
            'category': category if status == 'Phishing' else None
        }
