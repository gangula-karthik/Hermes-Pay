import os
from supabase import create_client, Client
from flask import Flask, request, jsonify
from paddleocr import PaddleOCR
from dotenv import load_dotenv
import os
import re
from werkzeug.utils import secure_filename
from ocr import dynamic_parse_menu
from functions import *
from health_advisor import ai_reco
load_dotenv()

app = Flask(__name__)
SUPABASE_PROJECT_URL: str = os.getenv('SUPABASE_PROJECT_URL')
SUPABASE_API_KEY: str = os.getenv('SUPABASE_API_KEY')
supabase: Client = create_client(SUPABASE_PROJECT_URL, SUPABASE_API_KEY)

@app.route('/')
def default():
    return "Hello World"

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
    ocr = PaddleOCR(use_angle_cls=True, lang='en')
    image_path = "./image/j_menu.jpg"  # Image path in your folder

    # Check if the image exists
    if not os.path.exists(image_path):
        return jsonify({"error": "Image file not found"}), 400

    try:
        # Perform OCR
        result = ocr.ocr(image_path, cls=True)

        # Flatten the result and extract text
        extracted_text = []
        for line in result:
            for word_info in line:
                extracted_text.append(word_info[1][0])  # Get the text from the result

        # Parse the extracted text
        structured_menu = dynamic_parse_menu(extracted_text)

        # Return the structured data
        return jsonify(structured_menu)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/calculate-total', methods=['POST'])
def recommendation():
    ai_reco()



# Only run the app if this script is executed directly
if __name__ == '__main__':
    app.run(debug=True)
