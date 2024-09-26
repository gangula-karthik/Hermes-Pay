import os
from supabase import create_client, Client
from flask import Flask, request, jsonify
from paddleocr import PaddleOCR
from dotenv import load_dotenv
import os
import re
from werkzeug.utils import secure_filename
from ocr import dynamic_parse_menu
load_dotenv()

app = Flask(__name__)
SUPABASE_PROJECT_URL: str = os.getenv('SUPABASE_PROJECT_URL')
SUPABASE_API_KEY: str = os.getenv('SUPABASE_API_KEY')
supabase: Client = create_client(SUPABASE_PROJECT_URL, SUPABASE_API_KEY)

def supabase_add():
    try:
        data = request.get_json()  # Get JSON data from the request
        name = data.get("Name")
        price = data.get("Price")

        # Validate input
        if not name or price is None:
            return {"error": "Name and Price are required."}, 400  # Bad Request

        response = supabase.table("items").insert({"Name": name, "Price": price}).execute()
        print("Supabase Response:", response)  # Log the full response for debugging

        if response.error:
            return {"error": response.error}, 500  # Return error if exists
        
        return response.data, 201  # Return data and 201 status

    except Exception as e:
        return {"error": str(e)}, 500  # Catch and return any exceptions




def supabase_select_all():
    # Execute the select query on the items table
    response = supabase.table("items").select("*").execute()

    # Print the raw response for debugging
    print("Raw Response:", response)

    # Return the data from the response, or an empty list if there's an error
    if response.data:
        return response.data, 200  # Return all items
    else:
        return {"error": "No data found"}, 404  # Handle case where no data is found


def supabase_update(item_id):
    data = request.json  # Expecting JSON data


    name = data.get("Name")
    price = data.get("Price")


    response = supabase.table("items").update({"Name": name, "Price": price}).eq("id", item_id).execute()

    # Check if the update was successful
    if response.data:
        return response.data, 200  # Return the updated data



def supabase_delete(item_id):
    # Delete the item in the items table based on the given item_id
    response = supabase.table("items").delete().eq("id", item_id).execute()
    
    if response.data:  # Check if the response contains data
        return {"message": "Item deleted successfully"}, 200  # Return success message
    else:
        return {"error": "Item not found"}, 404  # Return error if item not found

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


# Only run the app if this script is executed directly
if __name__ == '__main__':
    app.run(debug=True)
