from django.db import models
import qrcode
from io import BytesIO
from django.core.files import File

class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    codigo = models.CharField(max_length=20, unique=True)
    qr = models.ImageField(upload_to='qr/', blank=True, null=True)

    def save(self, *args, **kwargs):
        # Genera el código QR
        qr_image = qrcode.make(self.codigo)
        stream = BytesIO()
        qr_image.save(stream, format='PNG')
        self.qr.save(f'{self.codigo}.png', File(stream), save=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre
