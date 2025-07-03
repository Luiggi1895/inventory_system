from django.db import models
from PIL import Image
import qrcode
from io import BytesIO
from django.core.files import File

class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    codigo_interno = models.CharField(max_length=50, unique=True, default="TEMP")
    stock = models.PositiveIntegerField(default=0)
    fecha_vencimiento = models.DateField(null=True, blank=True)
    categoria = models.CharField(max_length=100, blank=True, null=True)
    proveedor = models.CharField(max_length=100, blank=True, null=True)
    almacen = models.CharField(max_length=100, default='principal')
    qr = models.ImageField(upload_to='qr_codes', blank=True, null=True)

    def save(self, *args, **kwargs):
        # Generar el QR siempre que se guarde el producto
        qr_img = qrcode.make(self.codigo_interno)
        qr_img = qr_img.resize((280, 280))
        canvas = Image.new('RGB', (300, 300), 'white')
        canvas.paste(qr_img, (10, 10))

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
    almacen = models.CharField(max_length=100, blank=True, default='')
    fecha = models.DateTimeField(auto_now_add=True)

    # Hemos quitado el override de save() para que no ajuste el stock aquí

    def __str__(self):
        return f"{self.tipo.title()} de {self.cantidad} unidades de {self.producto.nombre}"
