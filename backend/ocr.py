import re
def dynamic_parse_menu(extracted_text):
    food_items = []
    last_item = None

    # Define patterns for valid prices
    price_pattern = r"^\$?\d+(\.\d{1,2})?$"  # e.g., $4, $4.5
    complex_price_pattern = r"^\$?\d+\s*/\s*\d+$"  # e.g., $7/12
    multi_decimal_pattern = r"^\$?\d+\.\d+\s*/\s*\d+\.\d+$"  # e.g., $7.5/12.5

    for entry in extracted_text:
        entry = entry.strip()

        # Check if the current entry matches a price pattern
        if (re.match(price_pattern, entry) or 
            re.match(complex_price_pattern, entry) or 
            re.match(multi_decimal_pattern, entry)):
            # If there's a last_item, pair it with the price
            if last_item:
                food_items.append({
                    "name": last_item,
                    "price": entry,
                    "image": "https://example.com/image-placeholder.jpg"  # Placeholder image URL
                })
                last_item = None  # Reset last_item after pairing
        else:
            # Capture potential item names (length and content)
            if len(entry) > 1 and not re.search(r'\d', entry):
                last_item = entry  # Store the current item name

    print('Read items', food_items)

    return food_items
