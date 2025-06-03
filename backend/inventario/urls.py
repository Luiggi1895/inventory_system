from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),  # una vista simple para verificar que funciona
]
