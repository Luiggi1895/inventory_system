from django.http import JsonResponse
from rest_framework.permissions import AllowAny
permission_classes = [AllowAny]
def index(request):
    return JsonResponse({"message": "API activa desde /api/"})
