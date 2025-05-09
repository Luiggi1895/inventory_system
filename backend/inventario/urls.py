from django.urls import path
from .views import resumen_dashboard, ProductoListCreateView
from .views import MovimientoCreateView

urlpatterns = [
    path('resumen/', resumen_dashboard),
    path('productos/', ProductoListCreateView.as_view()),
    path('movimientos/', MovimientoCreateView.as_view()),
]