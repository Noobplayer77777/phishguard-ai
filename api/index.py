import sys, os
# Add the backend directory to the Python path so we can import the Flask app
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend'))
sys.path.append(backend_dir)

from app import create_app

# Create the Flask app instance
app = create_app()

