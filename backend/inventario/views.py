from rest_framework import generics
from .models import Producto
from .serializers import ProductoSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Movimiento
from .serializers import MovimientoSerializer
from .lstm_predictor import entrenar_y_predecir_lstm
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def predecir_stock(request, producto_id):
    movimientos = Movimiento.objects.filter(producto_id=producto_id).order_by('fecha')
    if movimientos.count() < 10:
        return Response({'error': 'No hay suficientes datos'}, status=400)

    df = pd.DataFrame(list(movimientos.values('fecha', 'cantidad', 'tipo')))
    df['cantidad'] = df.apply(lambda row: row['cantidad'] if row['tipo'] == 'entrada' else -row['cantidad'], axis=1)
    
    prediccion = entrenar_y_predecir_lstm(df)
    return Response({'prediccion': round(prediccion, 2)})

class MovimientoCreateView(generics.ListCreateAPIView):
    queryset = Movimiento.objects.all().order_by('-fecha')
    serializer_class = MovimientoSerializer
    permission_classes = [IsAuthenticated]

class ProductoListCreateView(generics.ListCreateAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [IsAuthenticated]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def resumen_dashboard(request):
    total_productos = Producto.objects.count()
    total_entradas = Movimiento.objects.filter(tipo='entrada').count()
    total_salidas = Movimiento.objects.filter(tipo='salida').count()
    alertas = Producto.objects.filter(stock__lte=5).count()

    # Obtener predicción para cada producto
    productos = Producto.objects.all()
    predicciones = []
    for producto in productos:
        movimientos = Movimiento.objects.filter(producto=producto).order_by('fecha')
        if movimientos.count() >= 10:
            df = pd.DataFrame(list(movimientos.values('fecha', 'cantidad', 'tipo')))
            df['cantidad'] = df.apply(lambda row: row['cantidad'] if row['tipo'] == 'entrada' else -row['cantidad'], axis=1)
            try:
                pred = entrenar_y_predecir_lstm(df)
                predicciones.append({
                    "id": producto.id,
                    "nombre": producto.nombre,
                    "prediccion": round(pred, 2)
                })
            except:
                continue

    # Ordenar por menor predicción
    predicciones_ordenadas = sorted(predicciones, key=lambda x: x['prediccion'])[:3]  # top 3 más críticos

    return Response({
        "totalProductos": total_productos,
        "totalEntradas": total_entradas,
        "totalSalidas": total_salidas,
        "alertas": alertas,
        "prediccionesCriticas": predicciones_ordenadas
    })
