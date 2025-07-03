from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductoViewSet,
    MovimientoViewSet,
    dashboard_metrics,
    predecir_stock,
)

router = DefaultRouter()
router.register(r'productos', ProductoViewSet, basename='producto')
router.register(r'movimientos', MovimientoViewSet, basename='movimiento')

urlpatterns = [
    # /api/productos/  y  /api/movimientos/
    path('', include(router.urls)),
    # /api/dashboard/
    path('dashboard/', dashboard_metrics, name='dashboard-metrics'),
    # /api/prediccion/{producto_id}/
    path('prediccion/<int:producto_id>/', predecir_stock, name='prediccion-stock'),
]
