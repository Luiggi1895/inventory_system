from django.contrib import admin
from django.urls import path
from django.http import JsonResponse

def test_view(request):
    return JsonResponse({'mensaje': 'El backend funciona correctamente 🎉'})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', test_view),
]
from django.conf import settings
from django.conf.urls.static import static

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)