# StoryTeller

StoryTeller is a tool for designing stories and their components and finally guiding the process of writing a book.

## Technologies Used
- Django REST Framework
- React with TypeScript
    - TailwindCSS
    - Redux Toolkit
- PostgreSQL
- Docker & Docker Compose

## Project Structure
- `backend/`: Django REST Framework API
- `frontend/`: React TypeScript frontend
- `nginx/`: Nginx configuration for production
- `docker-compose.yml`: Development environment configuration
- `docker-compose.prod.yml`: Production environment configuration

## Development Setup

### Prerequisites
- Docker and Docker Compose

### Getting Started
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/storyteller.git
   cd storyteller
   ```

2. Start the development environment:
   ```
   docker-compose up -d
   ```

3. Initialize the database:
   ```
   docker-compose exec backend python manage.py migrate
   docker-compose exec backend python manage.py createsuperuser
   ```

4. Access the applications:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api/
   - Django Admin: http://localhost:8000/admin/

### Running Tests

#### Running All Tests at Once
You can run all tests (both backend and frontend) at once using the provided scripts:

- On Linux/macOS:
  ```
  ./run-tests.sh
  ```

- On Windows:
  ```
  .\run-all-tests.ps1
  ```

#### Running Tests Individually

- Backend tests:
  ```
  docker-compose exec backend pytest
  ```

- Frontend tests:
  ```
  docker-compose exec frontend npm test
  ```

- Frontend tests with watch mode:
  ```
  docker-compose exec frontend npm run test:watch
  ```

## Production Deployment

1. Copy the example environment file and update it with your settings:
   ```
   cp .env.example .env
   ```

2. Update the domain name in `nginx/nginx.conf` and `init-letsencrypt.sh`

3. Initialize SSL certificates:
   ```
   chmod +x init-letsencrypt.sh
   ./init-letsencrypt.sh
   ```

4. Start the production environment:
   ```
   docker-compose -f docker-compose.prod.yml up -d
   ```

5. Initialize the database:
   ```
   docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate
   docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
   docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --no-input
   ```

## Features
- User authentication and authorization
- Create and manage stories
- Add characters to stories
- Organize content into chapters
- Track writing progress
