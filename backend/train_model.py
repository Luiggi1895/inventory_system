# train_model.py
import os
import pandas as pd
import numpy as np
import joblib
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense

# Ruta donde vamos a guardar los artefactos
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, 'models')
os.makedirs(MODEL_DIR, exist_ok=True)

# —————————— Carga tus datos históricos aquí ——————————
# Por ejemplo, podrías leer un CSV de movimientos ya procesado:
# df = pd.read_csv('ruta/a/tu/stock_historico.csv', parse_dates=['fecha'])
# df debe tener columnas ['fecha', 'stock'] diarias
#
# Aquí pongo un ejemplo dummy:
fechas = pd.date_range(end=pd.Timestamp.today(), periods=100)
stocks = np.linspace(100, 200, num=100)  # ejemplo de stock creciente
df = pd.DataFrame({'fecha': fechas, 'stock': stocks})
# ————————————————————————————————————————————————————————

# Asegurarnos de que está indexado por fecha diaria
df = df.set_index('fecha').asfreq('D', method='pad').reset_index()

# Normalizar
scaler = MinMaxScaler()
serie = scaler.fit_transform(df[['stock']])
# Guardar el scaler
joblib.dump(scaler, os.path.join(MODEL_DIR, 'stock_scaler.pkl'))

# Crear secuencias
ventana = 5
X, y = [], []
for i in range(ventana, len(serie)):
    X.append(serie[i-ventana:i])
    y.append(serie[i])
X, y = np.array(X), np.array(y)

# Definir y entrenar el modelo
model = Sequential([
    LSTM(50, activation='relu', input_shape=(ventana, 1)),
    Dense(1)
])
model.compile(optimizer='adam', loss='mse')
model.fit(X, y, epochs=50, verbose=1)

# Guardar el modelo entrenado
model.save(os.path.join(MODEL_DIR, 'stock_model.h5'))

print("✅ Modelo y scaler guardados en la carpeta 'models/'")
