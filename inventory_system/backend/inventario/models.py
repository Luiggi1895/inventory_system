from django.db import models
import qrcode
from io import BytesIO
from django.core.files import File
from PIL import Image

class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    codigo_interno = models.CharField(max_length=50, unique=True, default="TEMP")
    stock = models.PositiveIntegerField(default=0)  # <- asegúrate de incluir este campo
    qr = models.ImageField(upload_to='qr_codes', blank=True, null=True)

    def save(self, *args, **kwargs):
        qr_img = qrcode.make(self.codigo_interno)
        canvas = Image.new('RGB', (300, 300), 'white')
        canvas.paste(qr_img)
        buffer = BytesIO()
        canvas.save(buffer, 'PNG')
        self.qr.save(f'qr_{self.codigo_interno}.png', File(buffer), save=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre

class Movimiento(models.Model):
    TIPOS = (
        ('entrada', 'Entrada'),
        ('salida', 'Salida'),
    )

    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    tipo = models.CharField(max_length=10, choices=TIPOS)
    cantidad = models.PositiveIntegerField(default=0)
    fecha = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.tipo == 'entrada':
            self.producto.stock += self.cantidad
        elif self.tipo == 'salida':
            self.producto.stock -= self.cantidad
        self.producto.save()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.tipo} - {self.producto.nombre} ({self.cantidad})"
