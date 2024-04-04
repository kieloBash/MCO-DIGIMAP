from flask import Flask, request, send_file
from flask_cors import CORS
from imageStitchingLegit import stitch_images
import tempfile
import cv2

app = Flask(__name__)
CORS(app)

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'image1' not in request.files or 'image2' not in request.files:
        return 'No part', 400

    file1 = request.files['image1']
    file2 = request.files['image2']
    
    processed = stitch_images(file1,file2)
    
    # Save the processed image to a temporary file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.png')
    cv2.imwrite(temp_file.name, processed)
    
    # Send the temporary file as a response
    return send_file(temp_file.name, mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True, port=8080)