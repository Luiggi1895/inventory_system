from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductoViewSet, MovimientoViewSet, predecir_stock
from .views import dashboard_metrics


router = DefaultRouter()
router.register(r'productos', ProductoViewSet)
router.register(r'movimientos', MovimientoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', dashboard_metrics),
    path('prediccion/<int:producto_id>/', predecir_stock),
]
