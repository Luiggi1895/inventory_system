from django.urls import path
from .views import resumen_dashboard, ProductoListCreateView
from .views import MovimientoCreateView
from .views import predecir_stock
import pandas as pd
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import resumen_dashboard, ProductoListCreateView, MovimientoCreateView, predecir_stock

urlpatterns = [
    path('predecir_stock/<int:producto_id>/', predecir_stock),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # ✅ para login
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # ✅ para refrescar
    path('resumen/', resumen_dashboard),
    path('productos/', ProductoListCreateView.as_view()),
    path('movimientos/', MovimientoCreateView.as_view()),
]