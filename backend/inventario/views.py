# backend/inventario/views.py

from django.db.models import F, Sum
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Producto, Movimiento
from .serializers import ProductoSerializer, MovimientoSerializer
from .train_model import predict_stock

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

class MovimientoViewSet(viewsets.ModelViewSet):
    serializer_class = MovimientoSerializer

    def get_queryset(self):
        """
        Si se pasa ?producto=<id>, devuelve solo los movimientos de ese producto;
        en otro caso devuelve todos.
        """
        qs = Movimiento.objects.all().order_by('-fecha')
        producto_id = self.request.query_params.get('producto')
        if producto_id:
            qs = qs.filter(producto_id=producto_id)
        return qs

    def perform_create(self, serializer):
        mov = serializer.save()
        prod = mov.producto

        # Ajustar stock en la creación del movimiento
        if mov.tipo == 'entrada':
            prod.stock = F('stock') + mov.cantidad
        else:
            prod.stock = F('stock') - mov.cantidad

        prod.save()
        prod.refresh_from_db(fields=['stock'])

@api_view(['GET'])
def dashboard_metrics(request):
    total_productos = Producto.objects.count()
    entradas = Movimiento.objects.filter(tipo='entrada').aggregate(total=Sum('cantidad'))['total'] or 0
    salidas  = Movimiento.objects.filter(tipo='salida').aggregate(total=Sum('cantidad'))['total'] or 0

    bajo_stock = list(
        Producto.objects.filter(stock__lt=10)
                        .values('id', 'nombre', 'stock')
    )
    productos_list = list(Producto.objects.values('id', 'nombre'))

    return Response({
        'total_productos': total_productos,
        'total_entradas': entradas,
        'total_salidas': salidas,
        'bajo_stock': bajo_stock,
        'productos': productos_list,
        'criticos_prediccion': []
    })

@api_view(['GET'])
def predecir_stock(request, producto_id):
    try:
        valores = predict_stock(producto_id)
        return Response({'valores': valores})
    except Exception as e:
        return Response(
            {'valores': [], 'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
