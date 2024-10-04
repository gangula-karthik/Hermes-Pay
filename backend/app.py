import os
from supabase import create_client, Client
from flask import Flask, request, jsonify
from paddleocr import PaddleOCR
from dotenv import load_dotenv

import re
from werkzeug.utils import secure_filename
from ocr import dynamic_parse_menu
from functions import *
from health_advisor import ai_reco
import requests
from io import BytesIO
from PIL import Image

load_dotenv()

app = Flask(__name__)
SUPABASE_PROJECT_URL: str = os.getenv('SUPABASE_PROJECT_URL')
SUPABASE_API_KEY: str = os.getenv('SUPABASE_API_KEY')
supabase: Client = create_client(SUPABASE_PROJECT_URL, SUPABASE_API_KEY)

@app.route('/')
def default():
    return "Hello World 123"


@app.route('/supabase/create-account', methods=['POST'])
def create_account():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    print(email,password)
    try:
        user = supabase.auth.sign_up(email=email, password=password)
        if user.user:  # Check if user was created successfully
            return {"message": "Account created successfully", "user": user.user}, 201
        else:
            return {"error": "Failed to create account"}, 500
    except Exception as e:
        print(f"Error during account creation: {e}")  # Log the error
        return {"error": "Failed to create account"}, 500

@app.route('/supabase/login', methods=['POST'])
def login():
    data = request.json
    print(data['email'])
    try:
        user = supabase.auth.sign_in(email=data['email'], password=data['password'])
        print('works',user)
        return "Logged in successfully", 200
    except Exception as e:
        print(f"Error: {e}")
        return str(e), 400  # Return the error message and a 400 status code

#Create a new transaction
@app.route('/transactions', methods=['POST'])
def create_transaction_route():
    data = request.get_json()  # Get JSON payload from the request
    email = data.get('email')
    order = data.get('order')
    if not email or not order:
        return jsonify({"error": "Missing email or order"}), 400
    response = create_transaction(email, order)
    return response

# Get all transactions
@app.route('/transactions', methods=['GET'])
def get_all_transactions_route():
    response = get_all_transactions()  # Call the function to get transactions

    return response  # The function already returns a JSON response

# Get a specific transaction by ID
@app.route('/transactions/<int:transaction_id>', methods=['GET'])
def get_transaction_by_id_route(transaction_id):
    response = get_transaction_by_id(transaction_id)  # This returns a tuple (response, status_code)
    return response  # Return the response directly


#Update a transaction by ID
@app.route('/transactions/<int:transaction_id>', methods=['PUT'])
def update_transaction_route(transaction_id):
    data = request.get_json()
    updated_order = data.get('order')  # updated order should be a JSON object

    response = update_transaction(transaction_id, updated_order)
    
    if response.error:
        return jsonify({"error": response.error}), 400
    return jsonify(response.data), 200

#Delete a transaction by ID
@app.route('/transactions/<int:transaction_id>', methods=['DELETE'])
def delete_transaction_route(transaction_id):
    response = delete_transaction(transaction_id)
    
    if response.error:
        return jsonify({"error": response.error}), 400
    return jsonify({"message": "Transaction deleted successfully"}), 200




@app.route('/supabase/calculate-area/<buildingId>')
def calculateArea(buildingId):
    data = request.json
    user = supabase.auth.api.get_user(jwt=data['token'])
    if not user: 
        return 'You needed to be logged in'
    fetchedData = supabase.table("building_dimensions").select("*").eq("id", buildingId).execute()
    buildingData = fetchedData.data[0]
    print(buildingData)
    area = buildingData['length'] * buildingData['width']
    areaData = {
        "area": area,
        "building": buildingData['id']
    }
    insertedAreaData = supabase.table("building_areas").insert(areaData).execute()
    return insertedAreaData.data


@app.route('/ocr', methods=['POST'])
def ocr_route():
    try:
        model_dir = r'./model/ch_PP-OCRv3_det_infer/ch_PP-OCRv3_det_infer' 
        structure_dir = r'./model/picodet_lcnet_x1_0_fgd_layout_infer/picodet_lcnet_x1_0_fgd_layout_infer'
        # Instantiate PaddleOCR
        ocr = PaddleOCR(use_angle_cls=True, det_model_dir=model_dir,structure_version=structure_dir)

        # Get image URL from the request
        data = request.json
        image_url = data.get('image_url')

        if not image_url:
            return jsonify({"error": "Image URL is required"}), 400

        # Download the image from the URL
        response = requests.get(image_url)
        img = Image.open(BytesIO(response.content))

        # Save the image in its original format
        image_format = img.format.lower()
        img_path = f"./temp_image.{image_format}"  # Save with the correct extension
        img.save(img_path)

        # Perform OCR using PaddleOCR
        result = ocr.ocr(img_path, cls=True)

        # Extract text from the OCR result
        extracted_text = []
        for line in result:
            for word_info in line:
                extracted_text.append(word_info[1][0])  # Get the recognized text
        print(extracted_text)
        # Parse the extracted text into structured menu
        structured_menu = dynamic_parse_menu(extracted_text)
        
        return jsonify(structured_menu)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    #curl -X POST http://127.0.0.1:5000/ocr -H "Content-Type: application/json" -d "{\"image_url\": \"https://i0.wp.com/ordinarypatrons.com/wp-content/uploads/2022/07/Plain-Vanilla-East-Coast-Menu-2-1.jpg\"}"


@app.route('/recommendation', methods=['POST'])
def recommendation():
    return ai_reco()



# Only run the app if this script is executed directly
if __name__ == '__main__':
    app.run(debug=True)
