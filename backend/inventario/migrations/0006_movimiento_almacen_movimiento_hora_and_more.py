# Generated by Django 5.2.2 on 2025-06-14 06:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventario', '0005_alter_producto_categoria_alter_producto_proveedor'),
    ]

    operations = [
        migrations.AddField(
            model_name='movimiento',
            name='almacen',
            field=models.CharField(default='principal', help_text='Nombre del almacén donde se registra el movimiento', max_length=100),
        ),
        migrations.AddField(
            model_name='movimiento',
            name='hora',
            field=models.TimeField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='movimiento',
            name='fecha',
            field=models.DateField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='producto',
            name='categoria',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
