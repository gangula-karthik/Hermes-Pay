from flask import Flask, request, jsonify
import ollama

app = Flask(__name__)

# Initialize Ollama model with 'phi3.5:3.8b-mini-instruct-q6_K'
ollama_model = "phi3.5:3.8b-mini-instruct-q6_K"

@app.route('/calculate-total', methods=['POST'])
def calculate_total():
    try:
        
        # Parse the incoming JSON data
        json_data = request.get_json()

        # Extract item names and prices
        item_names = list(json_data.keys())
        total_price = round(sum(json_data.values()), 2)

        # Create a string of item names
        items_string = ", ".join(item_names)

        # Analyze the item names using Ollama phi3.5
        analysis_input = f"Analyze the following items: {items_string}, answer in less than 50 tokens. Imagine you are a caring health advisor"
        print('b4 chat')
        # Call Ollama model to generate analysis (updated with 'chat' method)
        analysis_result = ollama.chat(model=ollama_model, messages=[{"role": "system", "content": analysis_input}]) ## tune further
        print('aft chat')
        # Prepare the response
        print(analysis_result)
        response = {
            "items": items_string,
            "total_price": total_price,
            "analysis": analysis_result['message']['content']  
        }
        
        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
