import validators

class ScanRequest:
    def __init__(self, url):
        self.url = url
        
    def is_valid(self):
        if not self.url:
            return False, "URL is required"
            
        # Add http if missing for validation purposes
        check_url = self.url
        if not check_url.startswith(('http://', 'https://')):
            check_url = 'http://' + check_url
            
        if not validators.url(check_url):
            return False, "Invalid URL format"
            
        return True, ""

    def get_normalized_url(self):
        url = self.url
        if not url.startswith(('http://', 'https://')):
            url = 'http://' + url
        return url
