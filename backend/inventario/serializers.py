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
    # Para crear: se envía sólo el ID del producto
    producto = serializers.PrimaryKeyRelatedField(
        queryset=Producto.objects.all(),
        write_only=True
    )
    # Para leer: nombre legible del producto
    producto_nombre = serializers.CharField(
        source='producto.nombre',
        read_only=True
    )
    # Fecha formateada y hora
    fecha_str = serializers.SerializerMethodField(read_only=True)
    hora      = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Movimiento
        fields = [
            'id',
            'producto',         # ← ID para POST
            'producto_nombre',  # ← Nombre para GET
            'tipo',
            'cantidad',
            'almacen',
            'fecha_str',        # ← dd/mm/aaaa
            'hora',             # ← HH:MM:SS
        ]
        read_only_fields = ['id', 'producto_nombre', 'fecha_str', 'hora']

    def get_fecha_str(self, obj):
        # Formatea la fecha del DateTimeField `fecha`
        return obj.fecha.strftime('%d/%m/%Y')

    def get_hora(self, obj):
        # Extrae la hora del DateTimeField `fecha`
        return obj.fecha.strftime('%H:%M:%S')
