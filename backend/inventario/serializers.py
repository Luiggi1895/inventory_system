# inventario/serializers.py

from rest_framework import serializers
from .models import Producto, Movimiento

class ProductoSerializer(serializers.ModelSerializer):
    qr_url = serializers.SerializerMethodField()

    class Meta:
        model = Producto
        fields = [
            'id',
            'nombre',
            'descripcion',
            'codigo_interno',
            'stock',
            'categoria',
            'proveedor',
            'fecha_vencimiento',
            'almacen',  
            'qr_url',
        ]

    def get_qr_url(self, obj):
        request = self.context.get('request')
        if obj.qr and request:
            return request.build_absolute_uri(obj.qr.url)
        return None


class MovimientoSerializer(serializers.ModelSerializer):
    # ID para POST
    producto = serializers.PrimaryKeyRelatedField(
        queryset=Producto.objects.all(),
        write_only=True
    )
    # Sólo lectura
    producto_nombre = serializers.CharField(
        source='producto.nombre',
        read_only=True
    )
    fecha_str = serializers.SerializerMethodField()
    hora      = serializers.SerializerMethodField()

    class Meta:
        model = Movimiento
        fields = [
            'id',
            'producto',         # ← para POST (ID del producto)
            'producto_nombre',  # ← para GET (nombre)
            'tipo',
            'cantidad',
            'almacen',
            'fecha_str',        # dd/mm/aaaa
            'hora',             # HH:MM:SS
        ]
        read_only_fields = ['id', 'producto_nombre', 'fecha_str', 'hora']

    def get_fecha_str(self, obj):
        return obj.fecha.strftime('%d/%m/%Y')

    def get_hora(self, obj):
        return obj.fecha.strftime('%H:%M:%S')
