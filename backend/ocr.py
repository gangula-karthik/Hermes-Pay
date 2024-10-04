import re
def dynamic_parse_menu(extracted_text):
    structured_menu = {}
    
    # Define patterns for valid prices
    price_pattern = r"^\d+(\.\d{1,2})?$"  # e.g., 4, 4.5
    complex_price_pattern = r"^\d+\s*/\s*\d+$"  # e.g., 7/12
    multi_decimal_pattern = r"^\d+\.\d+\s*/\s*\d+\.\d+$"  # e.g., 7.5/12.5

    last_item = None

    for entry in extracted_text:
        entry = entry.strip()

        # Check if the current entry matches a price pattern
        if (re.match(price_pattern, entry) or 
            re.match(complex_price_pattern, entry) or 
            re.match(multi_decimal_pattern, entry)):
            # If it matches a price, use the last valid item as the key
            if last_item is not None:
                structured_menu[last_item] = entry
                last_item = None  # Reset last item after pairing
        else:
            # Check for potential item names (length and content)
            if len(entry) > 1 and not re.search(r'\d', entry):
                last_item = entry

    return structured_menu
