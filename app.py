from flask import Flask, request, jsonify, render_template, Response, send_file
from core import download_video
import core 
import json
import time

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/download', methods=['POST'])
def handle_download():
    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({"status": "error", "message": "Missing URL parameter"}), 400
        
    try:
        # Extract the quality, default to 'peak' if something goes wrong
        requested_quality = data.get('quality', 'peak')
        
        # Pass the quality directly into your core engine
        filepath = download_video(data['url'], requested_quality)
        
        return jsonify({"status": "success", "filepath": filepath})
    except Exception as e:
        return jsonify({"status": "error", "message": f"Extraction failed: {str(e)}"}), 500

# NEW ROUTE: Pushes the final MP4 to the browser's native download manager
@app.route('/api/serve')
def serve_file():
    filepath = request.args.get('filepath')
    if not filepath:
        return "No file specified", 400
    # as_attachment=True is what triggers the Chrome "Save As" popup
    return send_file(filepath, as_attachment=True)

@app.route('/api/progress')
def progress_stream():
    def generate():
        while True:
            json_data = json.dumps(core.current_progress)
            yield f"data: {json_data}\n\n"
            time.sleep(0.5)
            
    return Response(generate(), mimetype='text/event-stream')

if __name__ == '__main__':
    print("\n[SYSTEM] Initializing Flask web server architecture...")
    # Change it to look exactly like this:
    app.run(host='0.0.0.0', debug=False, port=5000)