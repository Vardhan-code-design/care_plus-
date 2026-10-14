from rest_framework import serializers
from .models import DoctorProfile, Appointment

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorProfile
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.ReadOnlyField(source='doctor.name')
    doctor_specialty = serializers.ReadOnlyField(source='doctor.specialty')

    class Meta:
        model = Appointment
        fields = '__all__'
