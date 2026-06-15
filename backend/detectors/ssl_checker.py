import requests
from urllib.parse import urlparse

class SSLChecker:
    def __init__(self):
        self.weight = 1.0

    def check(self, url):
        score = 0
        details = {}
        
        parsed_url = urlparse(url)
        
        if parsed_url.scheme != 'https':
            score += 70
            details['scheme'] = "Connection is not using HTTPS"
            
        # In a real production environment we would check SSL cert validity, expiry, etc.
        # using the ssl module. For this prototype, we'll keep it simple and just do a request check
        try:
            if parsed_url.scheme == 'https':
                response = requests.head(url, timeout=3)
                details['ssl_status'] = "Valid HTTPS connection established"
        except requests.exceptions.SSLError:
            score += 90
            details['ssl_error'] = "SSL Certificate error detected"
        except requests.exceptions.RequestException:
            # We don't penalize heavily just for being unreachable
            pass

        reason = "Missing or invalid SSL certificate." if score > 0 else "Valid SSL/HTTPS detected."
        
        return {
            'score': min(100, score),
            'reason': reason,
            'details': details
        }
