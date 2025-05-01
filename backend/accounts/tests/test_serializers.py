from django.test import TestCase
from django.contrib.auth.models import User
from accounts.serializers import UserSerializer

class UserSerializerTest(TestCase):
    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User'
        }
        self.user = User.objects.create_user(
            username=self.user_data['username'],
            email=self.user_data['email'],
            first_name=self.user_data['first_name'],
            last_name=self.user_data['last_name'],
            password='testpassword123'
        )
        self.serializer = UserSerializer(instance=self.user)

    def test_contains_expected_fields(self):
        """Test that serializer contains expected fields"""
        data = self.serializer.data
        self.assertEqual(set(data.keys()), set(['id', 'username', 'email', 'first_name', 'last_name']))

    def test_field_content(self):
        """Test that serializer fields contain expected values"""
        data = self.serializer.data
        self.assertEqual(data['username'], self.user_data['username'])
        self.assertEqual(data['email'], self.user_data['email'])
        self.assertEqual(data['first_name'], self.user_data['first_name'])
        self.assertEqual(data['last_name'], self.user_data['last_name'])
