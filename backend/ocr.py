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