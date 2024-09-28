from PIL import Image
import requests
from transformers import AutoModelForCausalLM, AutoProcessor
import torch
from io import BytesIO
import json  # Import json to output the results in JSON format

from datetime import datetime
def OCR_phi3(url):
    now = datetime.now()
    print("Current date and time:", now)

    model_id = "microsoft/Phi-3-vision-128k-instruct"

    # Load the model on CPU
    model = AutoModelForCausalLM.from_pretrained(
        model_id, 
        trust_remote_code=True, 
        torch_dtype=torch.float32,  # Keep float32 for CPU compatibility
        _attn_implementation='eager'  # Disable flash attention as it's more GPU-oriented
    ).to("cpu")  # Force the model to use CPU

    # Use slow_image_processor_class if necessary
    processor = AutoProcessor.from_pretrained(model_id, trust_remote_code=True, fast_image_processor_class=True)

    # URL of the new image (menu)

    # INPUT URL
    #url = "https://live.staticflickr.com/65535/52424560244_607950e9dd_o.jpg"

    # Make the request to get the image from the URL
    response = requests.get(url, stream=True)

    # Check if the request was successful
    if response.status_code == 200:
        try:
            # Try to open the image
            image = Image.open(BytesIO(response.content))
            image.show()  # Display the image if needed

            # Create messages for Phi-3 Vision
            messages = [
                {"role": "user", "content": "<|image_1|>\nExtract all the food names (bigger font) and their corresponding prices from this menu image, do not take in descriptions, remove all duplicate food names."},
            ]

            # Prepare the prompt using the processor's tokenizer
            prompt = processor.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)

            # Process image and prompt into model inputs
            inputs = processor(prompt, [image], return_tensors="pt").to("cpu", torch.float32)
            input_ids = inputs['input_ids'].to("cpu")  # Ensure input_ids are on the CPU

            # Set generation parameters
            generation_args = {
                "max_new_tokens": 500,
                "do_sample": False,  # No sampling
            }

            # Generate the response
            generate_ids = model.generate(**inputs, eos_token_id=processor.tokenizer.eos_token_id, **generation_args)

            # Remove input tokens and decode response
            generate_ids = generate_ids[:, inputs['input_ids'].shape[1]:]
            response_text = processor.batch_decode(generate_ids, skip_special_tokens=True, clean_up_tokenization_spaces=False)[0]

            # Extract food names and prices and convert to a dictionary format
            extracted_items = {}
            lines = response_text.split("\n")
            for line in lines:
                if "-" in line:  # Look for food names and prices in the format 'Food Name - $Price'
                    try:
                        food_name, price = line.split(" - ")
                        extracted_items[food_name.strip()] = price.strip()
                    except ValueError:
                        continue  # In case the line does not split properly, skip

            # Convert the dictionary to a JSON string
            extracted_json = json.dumps(extracted_items, indent=4)

            print("Extracted food names and prices in JSON format:")
            print(extracted_json)

            now = datetime.now()
            print("Current date and time:", now)

            return extracted_json

        except Exception as e:
            print(f"Failed to open or process image: {e}")
    else:
        print(f"Failed to retrieve image. Status code: {response.status_code}")


