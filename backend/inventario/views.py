from rest_framework import generics
from .models import Producto
from .serializers import ProductoSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Movimiento
from .serializers import MovimientoSerializer

class MovimientoCreateView(generics.ListCreateAPIView):
    queryset = Movimiento.objects.all().order_by('-fecha')
    serializer_class = MovimientoSerializer

class ProductoListCreateView(generics.ListCreateAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

@api_view(['GET'])
def resumen_dashboard(request):
    total_productos = Producto.objects.count()
    total_entradas = Movimiento.objects.filter(tipo='entrada').count()
    total_salidas = Movimiento.objects.filter(tipo='salida').count()
    alertas = Producto.objects.filter(stock__lte=5).count()

    return Response({
        "totalProductos": total_productos,
        "totalEntradas": total_entradas,
        "totalSalidas": total_salidas,
        "alertas": alertas,
    })
