import re
from urllib.parse import urlparse

class URLChecker:
    def __init__(self):
        self.weight = 1.0

    def check(self, url):
        score = 0
        details = {}
        
        parsed_url = urlparse(url)
        
        # 1. Length check
        if len(url) > 75:
            score += 30
            details['length'] = f"Suspiciously long URL ({len(url)} chars)"
            
        # 2. IP Address in hostname
        if re.match(r'^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$', parsed_url.hostname or ''):
            score += 80
            details['ip_address'] = "Host is an IP address instead of domain name"
            
        # 3. URL Shortener
        shorteners = ['bit.ly', 'goo.gl', 't.co', 'tinyurl.com', 'ow.ly', 'is.gd', 'buff.ly', 'tiny.cc']
        if any(shortener in (parsed_url.hostname or '') for shortener in shorteners):
            score += 50
            details['shortener'] = "URL shortener service detected"
            
        # 4. Special characters
        special_chars = url.count('-') + url.count('@')
        if '@' in url:
            score += 60
            details['at_symbol'] = "@ symbol found in URL (often used to obscure domain)"
        if url.count('-') > 3:
            score += 20
            details['hyphens'] = f"Multiple hyphens found ({url.count('-')})"

        # 5. Suspicious TLD
        suspicious_tlds = ['.xyz', '.top', '.club', '.online', '.site', '.work']
        if any((parsed_url.hostname or '').endswith(tld) for tld in suspicious_tlds):
            score += 30
            details['tld'] = "Suspicious Top-Level Domain detected"

        reason = "Multiple URL anomalies detected." if len(details) > 1 else list(details.values())[0] if details else "URL looks normal."
        
        return {
            'score': min(100, score),
            'reason': reason,
            'details': details
        }
