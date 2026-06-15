from urllib.parse import urlparse
import re

class KeywordChecker:
    def __init__(self):
        self.weight = 1.2
        
        self.categories = {
            'Banking Phishing': ['bank', 'secure', 'login', 'account', 'banking', 'auth', 'verify', 'update'],
            'Credential Theft': ['login', 'signin', 'auth', 'password', 'credential'],
            'Fake Shopping Sites': ['shop', 'store', 'deal', 'discount', 'cheap', 'offer'],
            'Cryptocurrency Scams': ['crypto', 'wallet', 'bitcoin', 'eth', 'airdrop', 'token', 'exchange'],
            'Social Media Phishing': ['facebook', 'instagram', 'twitter', 'tiktok', 'social', 'profile'],
            'Email Phishing': ['mail', 'inbox', 'webmail', 'office365', 'outlook']
        }

    def check(self, url):
        score = 0
        details = {}
        detected_category = "General"
        
        url_lower = url.lower()
        
        # Word boundaries or typical separators
        suspicious_words = []
        for category, keywords in self.categories.items():
            matches = []
            for kw in keywords:
                # Look for keyword bounded by symbols or at start/end
                if re.search(r'[^a-z]' + kw + r'[^a-z]', url_lower) or url_lower.startswith(kw) or url_lower.endswith(kw):
                    matches.append(kw)
            
            if matches:
                suspicious_words.extend(matches)
                # Assign highest matching category
                if score < len(matches) * 20:
                    detected_category = category
                    score += len(matches) * 20
        
        if suspicious_words:
            details['keywords'] = f"Found suspicious keywords: {', '.join(set(suspicious_words))}"
            details['category'] = detected_category
            
        reason = "Suspicious phishing keywords found in URL." if score > 0 else "No suspicious keywords detected."
        
        return {
            'score': min(100, score),
            'reason': reason,
            'details': details,
            'category': detected_category
        }
