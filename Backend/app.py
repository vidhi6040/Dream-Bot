# Flask-CORS is a Python library that deals with Cross-Origin Resource Sharing (CORS) 
# for Flask apps, ensuring that there is secure communication between your Flask application 
# and other domains. 

import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dream_interpreter import interpret_dream
from journal import save_to_journal

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

@app.route('/interpret', methods=['POST'])
def interpret():
    data = request.get_json()
    dream_text = data.get('dream', '')
    result = interpret_dream(dream_text)
    save_to_journal(dream_text, result)
    return jsonify({'interpretation': result})

@app.route('/journal', methods=['GET'])
def get_journal():
    try:
        with open('journal.json', 'r') as f:
            journal_data = json.load(f)
        return jsonify(journal_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)
