from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase, APIClient

class RegisterViewTest(APITestCase):
    def setUp(self):
        self.register_url = reverse('register')
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpassword123'
        }

    def test_register_user_success(self):
        """Test successful user registration"""
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='testuser').exists())
        self.assertEqual(User.objects.count(), 1)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['user']['username'], 'testuser')
        self.assertEqual(response.data['user']['email'], 'test@example.com')

    def test_register_user_missing_fields(self):
        """Test registration with missing fields"""
        # Missing username
        response = self.client.post(
            self.register_url, 
            {'email': 'test@example.com', 'password': 'testpassword123'}, 
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Missing email
        response = self.client.post(
            self.register_url, 
            {'username': 'testuser', 'password': 'testpassword123'}, 
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Missing password
        response = self.client.post(
            self.register_url, 
            {'username': 'testuser', 'email': 'test@example.com'}, 
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_duplicate_username(self):
        """Test registration with duplicate username"""
        # Create a user first
        User.objects.create_user(username='testuser', email='existing@example.com', password='password123')
        
        # Try to register with the same username
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 1)

    def test_register_duplicate_email(self):
        """Test registration with duplicate email"""
        # Create a user first
        User.objects.create_user(username='existinguser', email='test@example.com', password='password123')
        
        # Try to register with the same email
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 1)



class LoginViewTest(APITestCase):

    def setUp(self):
        self.login_url = reverse('login')
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        self.login_data = {
            'username': 'testuser',
            'password': 'testpassword123'
        }

    def test_login_success(self):
        """Test successful login"""
        response = self.client.post(self.login_url, self.login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['user']['username'], 'testuser')
        self.assertEqual(response.data['user']['email'], 'test@example.com')
        
        # Check that the user is authenticated
        user_url = reverse('user')
        user_response = self.client.get(user_url)
        self.assertEqual(user_response.status_code, status.HTTP_200_OK)
        self.assertEqual(user_response.data['username'], 'testuser')

    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        # Wrong password
        response = self.client.post(
            self.login_url, 
            {'username': 'testuser', 'password': 'wrongpassword'}, 
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Wrong username
        response = self.client.post(
            self.login_url, 
            {'username': 'wronguser', 'password': 'testpassword123'}, 
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_missing_fields(self):
        """Test login with missing fields"""
        # Missing username
        response = self.client.post(
            self.login_url, 
            {'password': 'testpassword123'}, 
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Missing password
        response = self.client.post(
            self.login_url, 
            {'username': 'testuser'}, 
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class LogoutViewTest(APITestCase):
    def setUp(self):
        self.login_url = reverse('login')
        self.logout_url = reverse('logout')
        self.user_url = reverse('user')
        
        # Create a user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        
        # Login the user
        self.client.post(
            self.login_url, 
            {'username': 'testuser', 'password': 'testpassword123'}, 
            format='json'
        )

    def test_logout_success(self):
        """Test successful logout"""
        # Verify user is authenticated
        user_response = self.client.get(self.user_url)
        self.assertEqual(user_response.status_code, status.HTTP_200_OK)
        
        # Logout
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        
        # Verify user is no longer authenticated
        user_response = self.client.get(self.user_url)
        self.assertEqual(user_response.status_code, status.HTTP_403_FORBIDDEN)

class UserViewTest(APITestCase):
    def setUp(self):
        self.user_url = reverse('user')
        self.login_url = reverse('login')
        
        # Create a user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )

    def test_get_user_authenticated(self):
        """Test getting user info when authenticated"""
        # Login the user
        self.client.post(
            self.login_url, 
            {'username': 'testuser', 'password': 'testpassword123'}, 
            format='json'
        )
        
        # Get user info
        response = self.client.get(self.user_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')
        self.assertEqual(response.data['email'], 'test@example.com')

    def test_get_user_unauthenticated(self):
        """Test getting user info when not authenticated"""
        response = self.client.get(self.user_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
