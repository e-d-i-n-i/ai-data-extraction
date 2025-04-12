from flask import Flask, jsonify
from flask_marshmallow import Marshmallow
import os
import logging

from routes.supabase_routes import supabase_bp

# Initialize Flask app
app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "default_secret_key")

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Initialize Marshmallow
ma = Marshmallow(app)

# Register routes
app.register_blueprint(supabase_bp, url_prefix="/api/kb")

# Error handlers
@app.errorhandler(400)
def bad_request(error):
    return jsonify({"error": "Bad request", "message": str(error)}), 400

@app.errorhandler(401)
def unauthorized(error):
    return jsonify({"error": "Unauthorized", "message": str(error)}), 401

@app.errorhandler(403)
def forbidden(error):
    return jsonify({"error": "Forbidden", "message": str(error)}), 403

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not found", "message": str(error)}), 404

@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({"error": "Internal server error", "message": str(error)}), 500

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)