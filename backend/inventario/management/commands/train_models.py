# backend/inventario/management/commands/train_models.py

import os
import joblib
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db.models import Sum

from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense

from inventario.models import Producto, Movimiento

class Command(BaseCommand):
    help = "Entrena un LSTM por producto sobre sus ventas diarias y guarda modelo + scaler"

    def handle(self, *args, **options):
        # ────────────────────────────────────────────────────────────────
        # Parámetros de entrenamiento
        dias_hist = 30      # cuántos días atrás usar para entrenar
        ventana   = 5       # tamaño de la ventana del LSTM
        epochs    = 50      # épocas de entrenamiento
        batch     = 16      # tamaño de batch
        # ────────────────────────────────────────────────────────────────

        # Directorio donde se guardarán los artefactos
        base_dir  = os.path.dirname(os.path.abspath(__file__))
        model_dir = os.path.abspath(os.path.join(base_dir, '..', '..', 'models'))
        os.makedirs(model_dir, exist_ok=True)

        hoy = timezone.localdate()

        for prod in Producto.objects.all():
            self.stdout.write(f"\n🔸 Entrenando producto {prod.id} — {prod.nombre}")

            # 1) Construir el histórico de ventas diarias
            fechas = [hoy - timedelta(days=i) for i in range(dias_hist-1, -1, -1)]
            ventas = []
            for f in fechas:
                inicio = datetime.combine(f, datetime.min.time())
                fin    = datetime.combine(f, datetime.max.time())
                agg    = (
                    Movimiento.objects
                             .filter(producto=prod, tipo='salida', fecha__range=(inicio, fin))
                             .aggregate(total=Sum('cantidad'))
                )
                total  = agg['total'] or 0
                ventas.append(total)

            df = pd.DataFrame({'fecha': fechas, 'sales': ventas})

            # 2) Normalizar
            scaler = MinMaxScaler(feature_range=(0, 1))
            serie_norm = scaler.fit_transform(df[['sales']])
            scaler_path = os.path.join(model_dir, f"scaler_prod_{prod.id}.pkl")
            joblib.dump(scaler, scaler_path)
            self.stdout.write(f"  • scaler guardado en {scaler_path}")

            # 3) Crear secuencias X, y
            X, y = [], []
            for i in range(ventana, len(serie_norm)):
                X.append(serie_norm[i-ventana:i, 0])
                y.append(serie_norm[i, 0])
            X = np.array(X).reshape(-1, ventana, 1)
            y = np.array(y)

            if len(X) == 0:
                self.stdout.write("  ⚠️  Datos insuficientes para LSTM (menos de ventana), salto este producto.")
                continue

            # 4) Definir y entrenar LSTM
            model = Sequential([
                LSTM(50, activation='relu', input_shape=(ventana, 1)),
                Dense(1)
            ])
            model.compile(optimizer='adam', loss='mse')
            model.fit(X, y, epochs=epochs, batch_size=batch, verbose=1)

            model_path = os.path.join(model_dir, f"model_prod_{prod.id}.h5")
            model.save(model_path)
            self.stdout.write(f"  • modelo guardado en {model_path}")

        self.stdout.write("\n✅ Todos los modelos entrenados.")
