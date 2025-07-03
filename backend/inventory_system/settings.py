from pathlib import Path
import os

# ──────────────────────────────────────────────────────────────────────────────
# BASE DIR & SECRET
# ──────────────────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-123456'  # Cámbiala en producción
DEBUG = True

# ──────────────────────────────────────────────────────────────────────────────
# HOSTS & CORS
# ──────────────────────────────────────────────────────────────────────────────
ALLOWED_HOSTS = [
    '127.0.0.1',
    'localhost',
    '192.168.1.62',
    '192.168.1.12',
]

CORS_ALLOW_ALL_ORIGINS = True

# ──────────────────────────────────────────────────────────────────────────────
# APPS INSTALADAS
# ──────────────────────────────────────────────────────────────────────────────
INSTALLED_APPS = [
    # Django
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Tu app (solo una entrada, usando AppConfig para registrar señales)
    'inventario.apps.InventarioConfig',

    # Terceros
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
]

# ──────────────────────────────────────────────────────────────────────────────
# MIDDLEWARE
# ──────────────────────────────────────────────────────────────────────────────
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',

    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',

    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ──────────────────────────────────────────────────────────────────────────────
# RUTAS PRINCIPALES
# ──────────────────────────────────────────────────────────────────────────────
ROOT_URLCONF = 'inventory_system.urls'
WSGI_APPLICATION = 'inventory_system.wsgi.application'

# ──────────────────────────────────────────────────────────────────────────────
# TEMPLATES
# ──────────────────────────────────────────────────────────────────────────────
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# ──────────────────────────────────────────────────────────────────────────────
# BASE DE DATOS
# ──────────────────────────────────────────────────────────────────────────────
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# ──────────────────────────────────────────────────────────────────────────────
# INTERNACIONALIZACIÓN
# ──────────────────────────────────────────────────────────────────────────────
LANGUAGE_CODE = 'en-us'
TIME_ZONE     = 'UTC'
USE_I18N      = True
USE_TZ        = True

# ──────────────────────────────────────────────────────────────────────────────
# ESTÁTICOS & MEDIA
# ──────────────────────────────────────────────────────────────────────────────
STATIC_URL = '/static/'
MEDIA_URL  = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# ──────────────────────────────────────────────────────────────────────────────
# REST FRAMEWORK
# ──────────────────────────────────────────────────────────────────────────────
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',
    ),
}


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
