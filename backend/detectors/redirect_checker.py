import requests

class RedirectChecker:
    def __init__(self):
        self.weight = 0.8

    def check(self, url):
        score = 0
        details = {}
        
        try:
            # We don't want to follow too many redirects and get stuck
            session = requests.Session()
            session.max_redirects = 5
            
            # Use a realistic User-Agent
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            
            response = session.head(url, allow_redirects=True, timeout=5, headers=headers)
            
            redirect_count = len(response.history)
            if redirect_count > 0:
                details['redirects'] = f"Followed {redirect_count} redirects"
                if redirect_count > 3:
                    score += 60
                    details['chain'] = "Suspiciously long redirect chain"
                
                # Check if final domain is different from initial
                initial_domain = url.split('/')[2] if len(url.split('/')) > 2 else url
                final_domain = response.url.split('/')[2] if len(response.url.split('/')) > 2 else response.url
                
                if initial_domain != final_domain:
                    score += 30
                    details['cross_domain'] = f"Redirects to a different domain: {final_domain}"
                    
        except requests.exceptions.TooManyRedirects:
            score += 80
            details['error'] = "Too many redirects (possible redirect loop/obfuscation)"
        except requests.exceptions.RequestException:
            pass # Ignore unreachable

        reason = "Suspicious redirection behavior." if score > 0 else "Normal redirection behavior."
        
        return {
            'score': min(100, score),
            'reason': reason,
            'details': details
        }
