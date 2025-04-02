from flask import Flask, request, jsonify
from flask_cors import CORS
import qrcode
import base64
from io import BytesIO
from pymongo import MongoClient
from bson import ObjectId  # ✅ Fix: Required to handle MongoDB ObjectId

app = Flask(__name__)
CORS(app)

# ✅ MongoDB Connection
client = MongoClient("mongodb://localhost:27017/")
db = client["qr_database"]
qr_collection = db["qr_codes"]

# ✅ Route to Generate QR Code
@app.route('/generate_qr', methods=['POST'])
def generate_qr():
    data = request.json
    text = data.get("text")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Generate QR Code
    qr = qrcode.make(text)
    buffer = BytesIO()
    qr.save(buffer, format="PNG")
    qr_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")

    # Store QR Code in MongoDB
    qr_entry = {"text": text, "status": "active"}
    inserted_id = qr_collection.insert_one(qr_entry).inserted_id

    return jsonify({"qr_code": f"data:image/png;base64,{qr_base64}", "qr_id": str(inserted_id)})

# ✅ Route to Block QR Code
@app.route('/block_qr', methods=['POST'])
def block_qr():
    data = request.json
    qr_id = data.get("qr_id")

    if not qr_id:
        return jsonify({"error": "QR ID required"}), 400

    try:
        result = qr_collection.update_one({"_id": ObjectId(qr_id)}, {"$set": {"status": "blocked"}})  # ✅ Fix: Convert to ObjectId
        if result.modified_count == 0:
            return jsonify({"error": "QR ID not found"}), 404
        return jsonify({"message": f"QR Code {qr_id} blocked"}), 200
    except:
        return jsonify({"error": "Invalid QR ID format"}), 400  # ✅ Handle invalid ObjectId

# ✅ Route to Unblock QR Code
@app.route('/unblock_qr', methods=['POST'])
def unblock_qr():
    data = request.json
    qr_id = data.get("qr_id")

    if not qr_id:
        return jsonify({"error": "QR ID required"}), 400

    try:
        result = qr_collection.update_one({"_id": ObjectId(qr_id)}, {"$set": {"status": "active"}})  # ✅ Fix: Convert to ObjectId
        if result.modified_count == 0:
            return jsonify({"error": "QR ID not found"}), 404
        return jsonify({"message": f"QR Code {qr_id} unblocked"}), 200
    except:
        return jsonify({"error": "Invalid QR ID format"}), 400  # ✅ Handle invalid ObjectId

if __name__ == '__main__':
    app.run(debug=True)
