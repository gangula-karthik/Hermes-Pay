import os
from flask import Flask, request, jsonify
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_PROJECT_URL: str = os.getenv('SUPABASE_PROJECT_URL')
SUPABASE_API_KEY: str = os.getenv('SUPABASE_API_KEY')

supabase: Client = create_client(SUPABASE_PROJECT_URL, SUPABASE_API_KEY)

def create_transaction(email, order):
    data = {
        'email': email,
        'order': order  # order should be a dictionary, e.g., {'item': 'item_name', 'price': 10}
    }
    response = supabase.table('transactions').insert(data).execute()
    
    if response.error:
        print("Error:", response.error)
    else:
        print("Transaction created:", response.data)

# Fetch all transactions
def get_all_transactions():
    response = supabase.table('transactions').select("*").execute()
    
    # Check if the response has data and return it as JSON
    if response.data:  # Ensure response has data
        return jsonify(response.data), 200  # Return data with a 200 OK status
    else:
        return jsonify({"message": "No transactions found"}), 404  # Return a 404 if no data

# Fetch a specific transaction by transaction_id
def get_transaction_by_id(transaction_id):
    response = supabase.table('transactions').select("*").eq('transaction_id', transaction_id).execute()
    
    # Check if the response has data and return it as JSON
    if response.data:  # Ensure response has data
        return jsonify(response.data), 200  # Return data with a 200 OK status
    else:
        return jsonify({"message": "No transactions found"}), 404  # Return a 404 if no data

def update_transaction(transaction_id, updated_order):
    response = supabase.table('transactions').update({
        'order': updated_order  # updated_order should be a dictionary like {'item': 'new_item', 'price': 20}
    }).eq('transaction_id', transaction_id).execute()
    
    if response.error:
        print("Error:", response.error)
    else:
        print("Transaction updated:", response.data)
        
def delete_transaction(transaction_id):
    response = supabase.table('transactions').delete().eq('transaction_id', transaction_id).execute()
    
    if response.error:
        print("Error:", response.error)
    else:
        print("Transaction deleted:", response.data)
