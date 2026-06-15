import whois
from urllib.parse import urlparse
import datetime

class DomainChecker:
    def __init__(self):
        self.weight = 1.0

    def check(self, url):
        score = 0
        details = {}
        
        parsed_url = urlparse(url)
        hostname = parsed_url.hostname or ''
        
        # 1. Subdomain count
        parts = hostname.split('.')
        if len(parts) > 3:
            score += 40
            details['subdomains'] = f"High number of subdomains detected ({len(parts)-2})"

        # 2. Typosquatting/Homograph simple check
        brands = ['google', 'apple', 'microsoft', 'amazon', 'paypal', 'facebook', 'netflix']
        for brand in brands:
            if brand in hostname and not hostname.endswith(f"{brand}.com"):
                # e.g., google-security.com
                score += 80
                details['impersonation'] = f"Possible brand impersonation of {brand}"

        # 3. Domain Age (WHOIS)
        try:
            domain_info = whois.whois(hostname)
            creation_date = domain_info.creation_date
            
            if type(creation_date) is list:
                creation_date = creation_date[0]
                
            if creation_date:
                age = (datetime.datetime.now() - creation_date).days
                details['age_days'] = age
                if age < 30:
                    score += 70
                    details['age'] = f"Newly registered domain ({age} days old)"
                elif age < 180:
                    score += 30
                    details['age'] = f"Relatively new domain ({age} days old)"
        except Exception as e:
            # WHOIS often fails, we just ignore it if it does
            details['whois'] = "Could not verify domain age"

        reason = "Suspicious domain characteristics detected." if score > 0 else "Domain looks legitimate."
        
        return {
            'score': min(100, score),
            'reason': reason,
            'details': details
        }
