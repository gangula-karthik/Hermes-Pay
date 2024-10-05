from flask import Flask, request, jsonify
import ollama

app = Flask(__name__)

# Initialize Ollama model with 'phi3.5:3.8b-mini-instruct-q6_K'


# @app.route('/ai_reco', methods=['POST'])
def ai_reco():
    ollama_model = "phi3.5:3.8b-mini-instruct-q6_K"
    try:
        # Parse the incoming JSON data
        json_data = request.get_json()

        # Extract the food order and menu
        food_order = json_data.get("foodOrder", [])
        menu = json_data.get("menu", [])

        # Extract item names and total price from the food order
        item_names = [item["name"] for item in food_order]
        #total_price = sum(float(item["price"].replace('$', '')) for item in food_order)
        total_price = json_data.get('totalPrice')

        # Create a string of item names
        items_string = ", ".join(item_names)

        # Create a string for menu items and prices
        menu_string = ", ".join([f"{item['name']} (${item['price']})" for item in menu])

        # Analyze the food order for healthiness and reasonable price using Ollama phi3.5
        analysis_input = (
            f"Analyze the following items: {items_string}. "
            f"Are they healthy and is the total price ${total_price} reasonable? "
            f"Also, consider the following menu: {menu_string}. "
            f"Are there healthier options the user can choose from? "
            f"Answer simply and keep it short"
        )

        print('Before chat')
        
        # Call Ollama model to generate analysis
        analysis_result = ollama.chat(model=ollama_model, 
                                      messages=[{"role": "system", "content": analysis_input}], 
                                      options={#"temperature":0.25,
                                               "num_predict": 100})
        
        
        print('After chat')
        
        # Prepare the response
        response = {
            "analysis": analysis_result['message']['content'].replace('-',"").replace('*',"").split('\n')[0] # Assuming 'message' contains the response
        }
        
        print(response)
        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400
# if __name__ == '__main__':
#     app.run(debug=True)
