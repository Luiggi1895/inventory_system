import numpy as np
import pandas as pd
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler

def entrenar_y_predecir_lstm(dataframe, pasos=7):
    df = dataframe[['cantidad']]
    df = df.astype(float)
    
    scaler = MinMaxScaler()
    datos_scaled = scaler.fit_transform(df)

    secuencia = []
    etiquetas = []
    for i in range(len(datos_scaled) - pasos):
        secuencia.append(datos_scaled[i:i+pasos])
        etiquetas.append(datos_scaled[i+pasos])

    X = np.array(secuencia)
    y = np.array(etiquetas)

    modelo = Sequential([
        LSTM(64, input_shape=(pasos, 1)),
        Dense(1)
    ])
    modelo.compile(loss='mse', optimizer='adam')
    modelo.fit(X, y, epochs=10, verbose=0)

    ultima_secuencia = datos_scaled[-pasos:]
    ultima_secuencia = ultima_secuencia.reshape((1, pasos, 1))
    prediccion = modelo.predict(ultima_secuencia)

    pred_escalada = scaler.inverse_transform(prediccion)
    return float(pred_escalada[0][0])
