import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from database import init_db
from routes.analyze import analyze_bp
from routes.stats import stats_bp

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    
    # Ensure instance folder exists (catch permission errors on serverless environments)
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # Determine default database path (use /tmp on Vercel since root directory is read-only)
    default_db = os.path.join(app.instance_path, 'phishguard.sqlite')
    if os.environ.get('VERCEL'):
        default_db = '/tmp/phishguard.sqlite'

    # Configure application
    app.config.from_mapping(
        SECRET_KEY=os.environ.get('SECRET_KEY', 'dev'),
        DATABASE=os.environ.get('DATABASE_URL', default_db),
    )

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    # Setup CORS
    cors_origin = os.environ.get('CORS_ORIGIN', '*')
    CORS(app, resources={r"/api/*": {"origins": cors_origin}})

    # Setup Rate Limiting
    limiter = Limiter(
        get_remote_address,
        app=app,
        default_limits=["200 per day", "50 per hour"],
        storage_uri="memory://"
    )

    # Initialize Database
    init_db(app.config['DATABASE'])

    # Register Blueprints
    app.register_blueprint(analyze_bp, url_prefix='/api')
    app.register_blueprint(stats_bp, url_prefix='/api')

    # Error Handlers
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({'error': 'Bad Request', 'message': str(error)}), 400

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not Found', 'message': 'The requested resource could not be found'}), 404

    @app.errorhandler(429)
    def ratelimit_handler(e):
        return jsonify(error="Rate limit exceeded", message=str(e.description)), 429

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal Server Error', 'message': 'An unexpected error occurred'}), 500

    @app.route('/')
    def health_check():
        return jsonify({'status': 'online', 'service': 'PhishGuard AI Backend API'})

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
