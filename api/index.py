import sys
import os

# Resolve imports from backend directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app import create_app

app = create_app()
