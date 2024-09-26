import os
from supabase import create_client, Client
from flask import Flask, request, jsonify
from paddleocr import PaddleOCR
from dotenv import load_dotenv
import os
import re
from werkzeug.utils import secure_filename
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


@app.route('/supabase/insert', methods=['POST'])
def insert():
    supabase_add()



@app.route('/supabase/select', methods=['GET'])
def select():
    supabase_select_all()


@app.route('/supabase/update/<item_id>', methods=['PUT'])
def update(item_id):
    supabase_update(item_id)


@app.route('/supabase/delete/<int:item_id>', methods=['DELETE'])
def delete(item_id):
    supabase_delete(item_id)


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
ocr = PaddleOCR(use_angle_cls=True, lang='en')

@app.route('/ocr', methods=['POST'])
def ocr_route():
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

def dynamic_parse_menu(extracted_text):
    structured_menu = {}
    current_category = None
    last_item = None  # Track the last non-empty item

    price_pattern = r"\$\d+(?:\.\d{1,2})?|^\d+\s*(USD|AUD|EUR)?$"
    header_pattern = r"^[A-Z\s]+$"

    for line in extracted_text:
        line = line.strip()
        print(f"Processing line: {line}")

        if not line:
            continue

        # If the line matches a header (all uppercase letters), set as a category
        if re.match(header_pattern, line) and not re.search(price_pattern, line):
            current_category = line.strip()
            structured_menu[current_category] = {}
            print(f"Detected new category: {current_category}")
            last_item = None  # Reset last item for the new category

        # If the line contains a price
        elif re.search(price_pattern, line):
            price_match = re.search(price_pattern, line)
            price = price_match.group() if price_match else "N/A"

            # If there's a previous item that doesn't have a price yet, use it
            if last_item and current_category:
                structured_menu[current_category][last_item] = price
                print(f"Added item: {last_item} - {price} under {current_category}")
                last_item = None  # Reset last_item after pairing it with the price
            else:
                # Handle cases where the item name and price are on the same line
                parts = re.split(price_pattern, line, 1)
                item = parts[0].strip()
                if item and current_category:
                    structured_menu[current_category][item] = price
                    print(f"Added item: {item} - {price} under {current_category}")

        else:
            # If there's no price but we have a valid item name, store it temporarily
            if current_category:
                last_item = line
                print(f"Found potential item name: {last_item}")

    # Remove any categories that have no items
    structured_menu = {k: v for k, v in structured_menu.items() if v}
    print("Final structured menu:", structured_menu)

    return structured_menu
# Only run the app if this script is executed directly
if __name__ == '__main__':
    app.run(debug=True)
