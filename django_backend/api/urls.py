from django.urls import path
from .views import DoctorListView, AppointmentCreateView

urlpatterns = [
    path('doctors/', DoctorListView.as_view(), name='doctor-list'),
    path('appointments/', AppointmentCreateView.as_view(), name='appointment-list-create'),
]
