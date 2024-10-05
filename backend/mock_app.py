from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS
import time
import random


app = Flask(__name__)
CORS(app, resources={r"/mock/*": {"origins": "*"}})


@app.route('/mock/ocr', methods=['POST'])
def mock_ocr_route():
    try:
        food_items = [
            {
                "name": "nasi ambeng",
                "image": "https://d3h1lg3ksw6i6b.cloudfront.net/media/image/2020/07/29/09b2cdd7bb324afa8aa82dce584e4900_Hjh+Maimunah+Nasi+Ambeng.jpg",
                "price": "$5.50"
            },
            {
                "name": "nasi rawon",
                "image": "https://angmohintheeast.com/assets/images/bedok-corner-nasi-rawon-1.jpg",
                "price": "$5.50"
            },
            {
                "name": "nasi lemak",
                "image": "https://img.freepik.com/premium-photo/ai-generated-illustration-nasi-lemak-malay-fragrant-rice-dish-cooked-coconut-milk_441362-8747.jpg",
                "price": "$2.50"
            },
            {
                "name": "lontong",
                "image": "https://media-cdn.tripadvisor.com/media/photo-s/14/0d/cf/e3/lontong-kering.jpg",
                "price": "$3.00"
            },
            {
                "name": "lontong kering",
                "image": "https://media-cdn.tripadvisor.com/media/photo-s/14/0d/cf/e3/lontong-kering.jpg",
                "price": "$3.00"
            },
            {
                "name": "mee rebus",
                "image": "https://fullofplants.com/wp-content/uploads/2024/01/vegan-mee-rebus-malaysian-sweet-potato-curry-with-noodles-thumb-1.jpg",
                "price": "$3.00"
            },
            {
                "name": "mee soto",
                "image": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgsk3iGNnDtnsZYfRwdaP6Fsk-1jPXxiOOCpmnnHcPDppS4Zr3sz6mP5LNewHr_rcvU_33XLFAhzS4-1N8dpXZB-2-gGnGFEo3Pz5K-AdS5yR3LGqlPPARd8Wv4ygrjfOSDD6ABhADnDitL/s640/IMG_8438.JPG",
                "price": "$3.00"
            },
            {
                "name": "soto ayam",
                "image": "https://assets.tmecosys.com/image/upload/t_web767x639/img/recipe/ras/Assets/23f62312738135ab286e78812093c46b/Derivates/2e373c2ef0bf36c9e8475cbf93347db5a3496309.jpg",
                "price": "$3.00"
            }
        ]

        return jsonify(food_items), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/mock/recommendation', methods=['POST'])
def generate_recommendation():
    time.sleep(5)
    
    data = request.get_json()
    print(data) 
    
    messages = ["You should try our special today!", "How about a healthy option?", "Feeling adventurous? Try something new!"]
    print(messages)
    return jsonify({"recommendation": random.choice(messages)}), 200


if __name__ == '__main__':
    app.run(debug=True)
