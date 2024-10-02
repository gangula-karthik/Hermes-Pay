import unittest
import json
from app import app  # Import your Flask app

class TransactionTestCase(unittest.TestCase):

    def setUp(self):
        """Set up the test client for Flask."""
        self.app = app.test_client()  # Creates a test client
        self.app.testing = True  # Enable testing mode
        self.transaction_id = None  # Will be used to store transaction_id for update/delete

    # def test_create_transaction(self):
    #     """Test creating a new transaction."""
    #     # Sample transaction data (No date)
    #     payload = {
    #         "email": "testuser@example.com",
    #         "order": [
    #             {'item': 'laksa', 'price': 10},
    #             {'item': 'Chicken rice', 'price': 20}
    #         ]
    #     }

    #     # Send POST request to create a transaction
    #     response = self.app.post('/transactions', data=json.dumps(payload), content_type='application/json')
    #     data = json.loads(response.data)

    #     # Assert that the request was successful
    #     self.assertEqual(response.status_code, 201)
    #     self.assertIn('transaction_id', data[0])  # Assuming response contains 'transaction_id'

    #     # Store the transaction_id for later tests
    #     self.transaction_id = data[0]['transaction_id']

    # def test_get_all_transactions(self):
    #     """Test retrieving all transactions."""
    #     response = self.app.get('/transactions')
    #     data = json.loads(response.data)
    #     print(data)


    # def test_get_transaction_by_id(self):
    #     """Test retrieving a specific transaction by ID."""
    #     response = self.app.get('/transactions/14')  # Adjust this ID as necessary for your tests
    #     data = json.loads(response.data)

    #     print(data)

    # def test_update_transaction(self):

    #     # Updated order data (Ensure order structure matches expected format)
    #     payload = {
    #         "order": [
    #             {"item": "chicken rice", "price": 800}  # Keeping it consistent with previous structure
    #         ]
    #     }

    #     # Send PUT request to update the transaction
    #     response = self.app.put(f'/transactions/15', data=json.dumps(payload), content_type='application/json')
    #     data = json.loads(response.data)

    #     # Assert the request was successful and data has been updated
    #     self.assertEqual(response.status_code, 200)
    #     self.assertEqual(data[0]['order'][0]['item'], "chicken rice")  # Accessing the first item in the updated order
    #     self.assertEqual(data[0]['order'][0]['price'], 800)  # Accessing the first price in the updated order

    # def test_delete_transaction(self):

    #     # Send DELETE request to delete the transaction
    #     response = self.app.delete(f'/transactions/15')

    #     # Assert that the transaction was deleted successfully
    #     self.assertEqual(response.status_code, 200)
    #     self.assertIn("Transaction deleted successfully", response.get_data(as_text=True))


if __name__ == '__main__':
    unittest.main()
