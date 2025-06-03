from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

def test_view(request):
    return JsonResponse({'mensaje': 'El backend funciona correctamente 🎉'})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', test_view),  # Ruta raíz para probar si el backend responde
    path('api/', include('inventario.urls')),  # Rutas de tu app
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Login con JWT
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh de JWT
]

# Para servir archivos multimedia (como los QR generados)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
