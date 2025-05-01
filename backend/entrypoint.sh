#!/bin/bash
exec gunicorn storyteller_backend.wsgi:application --bind 0.0.0.0:$BACKEND_PORT