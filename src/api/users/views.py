from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import UserListSerializer
from users.models import CustomUser

@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user
    return Response({
        'username': user.username,
        # 'avatar': request.build_absolute_uri(user.profile.avatar.url) if user.profile.avatar else None
    })
@api_view(['GET'])
def all_user_for_front(request):
	user_list = CustomUser.objects.all()
	serializers = UserListSerializer(user_list,many=True)
	return Response(serializers.data)