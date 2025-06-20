import numpy as np
import pandas as pd
from datetime import timedelta
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Movimiento, Producto
from rest_framework import viewsets
from .serializers import ProductoSerializer, MovimientoSerializer
from django.db.models import Sum
import random


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

    def get_queryset(self):
        codigo_interno = self.request.query_params.get('codigo_interno')
        if codigo_interno:
            return Producto.objects.filter(codigo_interno=codigo_interno)
        return Producto.objects.all()


class MovimientoViewSet(viewsets.ModelViewSet):
    queryset = Movimiento.objects.all()
    serializer_class = MovimientoSerializer

    def get_queryset(self):
        producto_id = self.request.query_params.get('producto')
        if producto_id:
            return Movimiento.objects.filter(producto_id=producto_id).order_by('-fecha')
        return Movimiento.objects.all().order_by('-fecha')


@api_view(['GET'])
def predecir_stock(request, producto_id):
    try:
        producto = Producto.objects.get(id=producto_id)
        movimientos = Movimiento.objects.filter(producto=producto).order_by('fecha')

        if movimientos.count() < 10:
            return Response({
                "valores": [],
                "mensaje": "No hay suficientes datos para predecir. Registra al menos 10 movimientos."
            }, status=200)

        # Acumular stock por fecha
        stock = 0
        registros = []
        for mov in movimientos:
            stock += mov.cantidad if mov.tipo == 'entrada' else -mov.cantidad
            registros.append({'fecha': mov.fecha.date(), 'stock': stock})

        df = pd.DataFrame(registros).groupby('fecha').last().reset_index()
        df['fecha'] = pd.to_datetime(df['fecha'])
        df = df.set_index('fecha').asfreq('D', method='pad').reset_index()

        # Normalización
        scaler = MinMaxScaler()
        serie = scaler.fit_transform(df[['stock']])

        # Crear secuencias
        X, y = [], []
        secuencia = 5
        for i in range(secuencia, len(serie)):
            X.append(serie[i-secuencia:i])
            y.append(serie[i])
        X, y = np.array(X), np.array(y)

        if X.size == 0 or len(X.shape) < 3:
            return Response({
                "valores": [],
                "mensaje": "No hay suficientes datos procesables para predecir."
            }, status=200)

        # Modelo LSTM
        model = Sequential()
        model.add(LSTM(50, activation='relu', input_shape=(X.shape[1], X.shape[2])))
        model.add(Dense(1))
        model.compile(optimizer='adam', loss='mse')
        model.fit(X, y, epochs=50, verbose=0)

        # Predicción de próximos 5 días
        pred_input = serie[-secuencia:].reshape(1, secuencia, 1)
        predicciones = []
        for _ in range(5):
            pred = model.predict(pred_input, verbose=0)
            predicciones.append(pred[0][0])
            pred_input = np.append(pred_input[:, 1:, :], [[pred]], axis=1)

        pred_final = scaler.inverse_transform(np.array(predicciones).reshape(-1, 1))

        return Response({
            "producto": producto.nombre,
            "prediccion_dias": 5,
            "valores": [round(float(p), 2) for p in pred_final.reshape(-1)]
        })

    except Producto.DoesNotExist:
        return Response({"error": "Producto no encontrado"}, status=404)


@api_view(['GET'])
def dashboard_metrics(request):
    total_productos = Producto.objects.count()
    total_entradas = Movimiento.objects.filter(tipo='entrada').aggregate(Sum('cantidad'))['cantidad__sum'] or 0
    total_salidas = Movimiento.objects.filter(tipo='salida').aggregate(Sum('cantidad'))['cantidad__sum'] or 0

    bajo_stock = Producto.objects.filter(stock__lt=10).values('nombre', 'stock')

    criticos_prediccion = []
    for producto in Producto.objects.all():
        simulacion = producto.stock - random.randint(5, 15)
        if simulacion < 10:
            criticos_prediccion.append({
                "nombre": producto.nombre,
                "prediccion_final": simulacion
            })

    productos = Producto.objects.values('id', 'nombre')

    return Response({
        "total_productos": total_productos,
        "total_entradas": total_entradas,
        "total_salidas": total_salidas,
        "bajo_stock": list(bajo_stock),
        "criticos_prediccion": criticos_prediccion,
        "productos": list(productos)
    })
