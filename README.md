# 🧾 Sistema de Inventario con Django + React + QR

Este sistema permite gestionar productos de forma eficiente mediante un panel administrativo web y una interfaz amigable. Además, cada producto genera autom
áticamente un **código QR**, que puede ser escaneado para acceder rápidamente a su información.

---

## 🚀 Tecnologías Utilizadas

- ⚙️ **Backend:** Django 3.2 + Django REST Framework
- 🎨 **Frontend:** React 17 + Axios
- 🐘 **Base de Datos:** PostgreSQL
- 📦 **Contenedores:** Docker + Docker Compose
- 📷 **Código QR:** Librerías `qrcode` y `Pillow`

---

## 🧰 Funcionalidades Principales

- Crear, listar, editar y eliminar productos.
- Cada producto tiene un `código único` y un `código QR` generado automáticamente.
- Acceso al panel de administración (`/admin`) para gestionar todo el inventario.
- Código QR descargable como imagen.
- Frontend moderno y responsive.
- Separación completa entre frontend y backend.

---

## ⚙️ Instalación y Uso

1. Asegúrate de tener instalado:

   - Docker Desktop
   - Git (opcional si ya descargaste el ZIP)

2. Clona o descarga este repositorio:

```bash
git clone https://github.com/Luiggi1895/inventory_system.git
cd inventory_system
