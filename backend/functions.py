import os
from flask import request

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