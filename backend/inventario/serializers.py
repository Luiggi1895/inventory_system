from rest_framework import serializers
from .models import Producto, Movimiento

class MovimientoSerializer(serializers.ModelSerializer):
    producto = serializers.StringRelatedField()

    class Meta:
        model = Movimiento
        fields = '__all__'


class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'
