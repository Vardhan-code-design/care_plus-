from rest_framework import generics, status
from rest_framework.response import Response
from .models import DoctorProfile, Appointment
from .serializers import DoctorSerializer, AppointmentSerializer

class DoctorListView(generics.ListCreateAPIView):
    serializer_class = DoctorSerializer

    def get_queryset(self):
        qs = DoctorProfile.objects.filter(verification_status='verified')
        specialty = self.request.query_params.get('specialty')
        if specialty and specialty != 'All':
            qs = qs.filter(specialty__iexact=specialty)
        return qs

class AppointmentCreateView(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        return Appointment.objects.all().order_by('-date')

    def create(self, request, *args, **kwargs):
        doctor_id = request.data.get('doctor_id')
        date = request.data.get('date')
        time_slot = request.data.get('time_slot')

        # Double-booking validation rule
        if Appointment.objects.filter(doctor_id=doctor_id, date=date, time_slot=time_slot).exclude(status__in=['cancelled', 'rejected']).exists():
            return Response({'error': 'This time slot is already reserved.'}, status=status.HTTP_400_BAD_REQUEST)

        return super().create(request, *args, **kwargs)
