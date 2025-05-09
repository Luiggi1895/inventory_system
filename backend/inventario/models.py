from django.db import models
import qrcode
from io import BytesIO
from django.core.files import File

class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    stock = models.PositiveIntegerField(default=0)
    categoria = models.CharField(max_length=50, blank=True)
    fecha_ingreso = models.DateTimeField(auto_now_add=True)
    codigo = models.CharField(max_length=20, unique=True)
    qr = models.ImageField(upload_to='qr/', blank=True, null=True)

    def save(self, *args, **kwargs):
        qr_image = qrcode.make(self.codigo)
        stream = BytesIO()
        qr_image.save(stream, format='PNG')
        self.qr.save(f'{self.codigo}.png', File(stream), save=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre


class Movimiento(models.Model):
    TIPO_CHOICES = (
        ('entrada', 'Entrada'),
        ('salida', 'Salida'),
    )

    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    cantidad = models.PositiveIntegerField()
    fecha = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.tipo == 'entrada':
            self.producto.stock += self.cantidad
        elif self.tipo == 'salida':
            self.producto.stock -= self.cantidad
        self.producto.save()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.tipo} - {self.producto.nombre} - {self.cantidad}"
