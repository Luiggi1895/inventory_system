# inventario/views.py

import os
from django.db.models import Sum
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

import joblib
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model

from .models import Producto, Movimiento
from .serializers import ProductoSerializer, MovimientoSerializer

# ————— RUTAS GLOBALES —————
BASE_DIR    = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH  = os.path.join(BASE_DIR, 'models', 'stock_model.h5')
SCALER_PATH = os.path.join(BASE_DIR, 'models', 'stock_scaler.pkl')

# Cargamos el scaler y el modelo (inferencia only)
scaler = joblib.load(SCALER_PATH)
model  = load_model(MODEL_PATH, compile=False)
# ——————————————————————


class ProductoViewSet(viewsets.ModelViewSet):
    """
    CRUD de productos.
    """
    queryset         = Producto.objects.all()
    serializer_class = ProductoSerializer

    def get_queryset(self):
        codigo = self.request.query_params.get('codigo_interno')
        if codigo:
            return self.queryset.filter(codigo_interno=codigo)
        return self.queryset

    def get_serializer_context(self):
        """
        Para que ProductoSerializer.get_qr_url
        pueda usar request.build_absolute_uri().
        """
        return {'request': self.request}


class MovimientoViewSet(viewsets.ModelViewSet):
    """
    CRUD de movimientos: al crear, se actualiza stock
    gracias al método save() en el modelo Movimiento.
    """
    queryset         = Movimiento.objects.all().order_by('-fecha')
    serializer_class = MovimientoSerializer

    def get_queryset(self):
        pid = self.request.query_params.get('producto')
        qs  = self.queryset
        if pid:
            qs = qs.filter(producto_id=pid)
        return qs

    def get_serializer_context(self):
        # Aunque el serializer no lo necesite para URL,
        # es buena práctica incluírlo por consistencia.
        return {'request': self.request}


@api_view(['GET'])
def predecir_stock(request, producto_id):
    """
    Inferencia de stock para los próximos 5 días usando un LSTM preentrenado.
    """
    try:
        producto = Producto.objects.get(id=producto_id)
    except Producto.DoesNotExist:
        return Response({"error": "Producto no encontrado"}, status=404)

    movs = Movimiento.objects.filter(producto=producto).order_by('fecha')
    if movs.count() < 10:
        return Response({
            "valores": [],
            "mensaje": "No hay suficientes datos (mínimo 10 movimientos)."
        })

    # Reconstruir serie histórica de stock
    stock     = 0
    registros = []
    for m in movs:
        stock += m.cantidad if m.tipo == 'entrada' else -m.cantidad
        registros.append({'fecha': m.fecha.date(), 'stock': stock})

    df = pd.DataFrame(registros).groupby('fecha').last().reset_index()
    df['fecha'] = pd.to_datetime(df['fecha'])
    df = df.set_index('fecha').asfreq('D', method='pad').reset_index()

    # Normalizar
    serie_norm = scaler.transform(df[['stock']])

    # Última ventana
    ventana   = 5
    last_seq  = serie_norm[-ventana:].reshape(1, ventana, 1)

    # Predecir 5 días
    preds_norm = []
    seq        = last_seq.copy()
    for _ in range(5):
        p = model.predict(seq, verbose=0)  # forma (1,1)
        preds_norm.append(p[0][0])
        p3   = p.reshape(1, 1, 1)
        seq  = np.concatenate((seq[:, 1:, :], p3), axis=1)

    # Des-normalizar
    preds_real = scaler.inverse_transform(
        np.array(preds_norm).reshape(-1, 1)
    ).flatten()

    return Response({
        "producto": producto.nombre,
        "prediccion_dias": 5,
        "valores": [round(float(v), 2) for v in preds_real]
    })


@api_view(['GET'])
def dashboard_metrics(request):
    """
    Métricas del Dashboard: totales, bajo stock y productos críticos.
    """
    total_productos = Producto.objects.count()
    total_entradas  = Movimiento.objects.filter(tipo='entrada') \
                         .aggregate(total=Sum('cantidad'))['total'] or 0
    total_salidas   = Movimiento.objects.filter(tipo='salida') \
                         .aggregate(total=Sum('cantidad'))['total'] or 0

    bajo_stock = list(
        Producto.objects.filter(stock__lt=10)
                        .values('nombre', 'stock')
    )

    # Simple simulación de alertas críticas
    import random
    random.seed(42)
    criticos = []
    for p in Producto.objects.all():
        sim = p.stock - random.randint(5, 15)
        if sim < 10:
            criticos.append({"nombre": p.nombre, "prediccion_final": sim})

    return Response({
        "total_productos": total_productos,
        "total_entradas": total_entradas,
        "total_salidas": total_salidas,
        "bajo_stock": bajo_stock,
        "criticos_prediccion": criticos,
        # Para poblar el dropdown de Predicción
        "productos": list(Producto.objects.values('id', 'nombre'))
    })
