import unittest
import json
from app import app  # Import your Flask app

class FlaskTestCase(unittest.TestCase):

    def setUp(self):
        # Set up the Flask app for testing
        self.app = app.test_client()
        self.app.testing = True

    def test_delete_success(self):
        # Define the ID of the item to delete (ensure this ID exists in your database)
        item_id = 11
        
        # Make a DELETE request to the delete endpoint
        response = self.app.delete(f'/supabase/delete/{item_id}')
        
        # Check that the response status code is 200
        self.assertEqual(response.status_code, 200)
        
        # Check that the response data contains a success message
        data = response.get_json()
        self.assertEqual(data["message"], "Item deleted successfully")



if __name__ == '__main__':
    unittest.main()
