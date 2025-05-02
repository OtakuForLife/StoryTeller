from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from .serializers import UserSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token

@ensure_csrf_cookie
def get_csrf_token(request):
    """
    This view ensures a CSRF cookie is set and returns the token
    """
    # Explicitly get the token to ensure it's set
    token = get_token(request)
    return JsonResponse({"csrfToken": token})


class RegisterView(APIView):
    """
    API endpoint for user registration
    """
    authentication_classes = []
    permission_classes = []
    throttle_scopes = ['ip-low-rate']

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not email or not password:
            return Response(
                {'detail': 'Please provide username, email, and password'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if user already exists
        if User.objects.filter(username=username).exists():
            return Response(
                {'detail': 'Username already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {'detail': 'Email already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        # Return user data
        return Response(
            {
                'user': UserSerializer(user).data,
                'success': True
            },
            status=status.HTTP_201_CREATED
        )


class LoginView(APIView):
    """
    API endpoint for user login
    """
    authentication_classes = []
    permission_classes = []  # Allow any user to login
    throttle_scopes = ['ip-low-rate']

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'detail': 'Please provide username and password'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Authenticate user
        user = authenticate(username=username, password=password)

        if not user:
            return Response(
                {'detail': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Log the user in (create session)
        login(request, user)

        # Return user data
        return Response(
            {
                'user': UserSerializer(user).data,
                'success': True
            },
            status=status.HTTP_200_OK
        )

class UserView(APIView):
    """
    API endpoint to get current user information
    """
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    throttle_scopes = ['user-low-rate']

    def get(self, request):
        return Response(
            UserSerializer(request.user).data,
            status=status.HTTP_200_OK
        )

class LogoutView(APIView):
    """
    API endpoint for user logout
    """
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    throttle_scopes = ['user-low-rate']

    def post(self, request):
        # Log the user out (destroy session)
        logout(request)
        return Response(
            {'success': True},
            status=status.HTTP_200_OK
        )
