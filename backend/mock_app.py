from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS


app = Flask(__name__)
CORS(app, resources={r"/mock/*": {"origins": "*"}})


@app.route('/mock/ocr', methods=['POST'])
def mock_ocr_route():
    try:
        food_items = [
            {
                "name": "Cheeseburger",
                "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTENYnRh013tE7LrJCY-j0pTDFoJzJZtAx8qw&s",
                "price": "$5.99"
            },
            {
                "name": "Pizza",
                "image": "https://cdn.shopify.com/s/files/1/0274/9503/9079/files/20220211142754-margherita-9920_5a73220e-4a1a-4d33-b38f-26e98e3cd986.jpg?v=1723650067",
                "price": "$7.99"
            },
            {
                "name": "Salad",
                "image": "https://cdn.shopify.com/s/files/1/0274/9503/9079/files/20220211142754-margherita-9920_5a73220e-4a1a-4d33-b38f-26e98e3cd986.jpg?v=1723650067",
                "price": "$4.99"
            },
            {
                "name": "Fries",
                "image": "https://cdn.shopify.com/s/files/1/0274/9503/9079/files/20220211142754-margherita-9920_5a73220e-4a1a-4d33-b38f-26e98e3cd986.jpg?v=1723650067",
                "price": "$2.99"
            },
            {
                "name": "Cheeseburger",
                "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTENYnRh013tE7LrJCY-j0pTDFoJzJZtAx8qw&s",
                "price": "$5.99"
            },
            {
                "name": "Pizza",
                "image": "https://cdn.shopify.com/s/files/1/0274/9503/9079/files/20220211142754-margherita-9920_5a73220e-4a1a-4d33-b38f-26e98e3cd986.jpg?v=1723650067",
                "price": "$7.99"
            },
            {
                "name": "Salad",
                "image": "https://cdn.shopify.com/s/files/1/0274/9503/9079/files/20220211142754-margherita-9920_5a73220e-4a1a-4d33-b38f-26e98e3cd986.jpg?v=1723650067",
                "price": "$4.99"
            },
            {
                "name": "Fries",
                "image": "https://cdn.shopify.com/s/files/1/0274/9503/9079/files/20220211142754-margherita-9920_5a73220e-4a1a-4d33-b38f-26e98e3cd986.jpg?v=1723650067",
                "price": "$2.99"
            }
        ]

        return jsonify(food_items), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
