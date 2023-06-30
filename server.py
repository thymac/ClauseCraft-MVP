from flask import Flask, request, render_template
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'pdf'}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file found!', 400
    file = request.files['file']
    if file.filename == '':
        return 'No selected file!', 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return 'File uploaded!', 200
    return 'File upload failed!', 400

@app.route('/configure-model', methods=['POST'])
def configure_model():
    # Process model configuration here
    # Return appropriate response
    return 'Model configured!', 200

if __name__ == '__main__':
    app.run(debug=True)

