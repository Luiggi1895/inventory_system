# backend/inventario/train_model.py

import os
import joblib
import numpy as np
from datetime import datetime, timedelta
from django.utils import timezone
from django.db.models import Sum
from tensorflow.keras.models import load_model

from .models import Movimiento

# Carpeta donde tu management command guardó los artefactos:
BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, 'models')

def predict_stock(producto_id):
    """
    Para el producto dado:
     1) Suma las salidas diarias de los últimos 7 días (incluyendo hoy).
     2) Completa con 0 los días sin ventas.
     3) Normaliza con el MinMaxScaler específico del producto.
     4) Predice 5 días encadenados con el LSTM entrenado para ese producto.
     5) Des-normaliza y devuelve 5 floats redondeados.
    """

    # 1) Recolectar ventas diarias reales de los últimos 7 días
    hoy    = timezone.localdate()
    fechas = [hoy - timedelta(days=i) for i in range(6, -1, -1)]
    ventas = []
    for f in fechas:
        inicio = datetime.combine(f, datetime.min.time())
        fin    = datetime.combine(f, datetime.max.time())
        total  = (
            Movimiento.objects
                     .filter(
                         producto_id=producto_id,
                         tipo='salida',
                         fecha__range=(inicio, fin)
                     )
                     .aggregate(s=Sum('cantidad'))['s']
            or 0
        )
        ventas.append(total)

    # 2) Cargar scaler y normalizar
    scaler_path = os.path.join(MODEL_DIR, f"scaler_prod_{producto_id}.pkl")
    if not os.path.isfile(scaler_path):
        raise FileNotFoundError(f"No se encontró el scaler para producto {producto_id}")
    scaler     = joblib.load(scaler_path)
    serie_norm = scaler.transform(np.array(ventas).reshape(-1, 1))

    # 3) Cargar modelo LSTM
    model_path = os.path.join(MODEL_DIR, f"model_prod_{producto_id}.h5")
    if not os.path.isfile(model_path):
        raise FileNotFoundError(f"No se encontró el modelo para producto {producto_id}")
    model = load_model(model_path, compile=False)

    # 4) Predicción encadenada de los próximos 5 días
    ventana    = 5  # tu red fue entrenada con ventana=5
    seq        = serie_norm[-ventana:].reshape(1, ventana, 1)
    preds_norm = []
    for _ in range(5):
        p = float(model.predict(seq, verbose=0)[0,0])
        preds_norm.append(p)
        # desplaza la ventana y añade la nueva predicción
        seq = np.concatenate([seq[:, 1:, :], np.array(p).reshape(1,1,1)], axis=1)

    # 5) Des-normalizar y redondear
    preds = scaler.inverse_transform(np.array(preds_norm).reshape(-1,1)).flatten()
    return [round(float(v), 2) for v in preds]
