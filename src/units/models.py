from django.db import models
from users.models import CustomUser
# Create your models here.
class units(models.Model):
	birlik_raqami = models.CharField(max_length=50,unique=True)
	nomi = models.CharField(max_length=100)
	yaratilgan_vaqti = models.DateField(auto_now=True)
	yaratuvchi = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
	class Meta:
		verbose_name = "Unit"
		verbose_name_plural = "Units"
		ordering = ['nomi']
	def __str__(self):
		return self.nomif