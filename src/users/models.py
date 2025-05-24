from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    role = models.CharField(max_length=30, default='employee')
    image = models.ImageField(upload_to='user-imgs/') 

