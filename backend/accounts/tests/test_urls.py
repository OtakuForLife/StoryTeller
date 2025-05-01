from django.test import SimpleTestCase
from django.urls import reverse, resolve
from accounts.views import RegisterView, LoginView, LogoutView, UserView

class AccountsUrlsTest(SimpleTestCase):
    def test_register_url_resolves(self):
        """Test that register URL resolves to RegisterView"""
        url = reverse('register')
        self.assertEqual(resolve(url).func.view_class, RegisterView)

    def test_login_url_resolves(self):
        """Test that login URL resolves to LoginView"""
        url = reverse('login')
        self.assertEqual(resolve(url).func.view_class, LoginView)

    def test_logout_url_resolves(self):
        """Test that logout URL resolves to LogoutView"""
        url = reverse('logout')
        self.assertEqual(resolve(url).func.view_class, LogoutView)

    def test_user_url_resolves(self):
        """Test that user URL resolves to UserView"""
        url = reverse('user')
        self.assertEqual(resolve(url).func.view_class, UserView)
