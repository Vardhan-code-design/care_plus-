from django.db import models
from django.contrib.auth.models import User

class DoctorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile', null=True, blank=True)
    name = models.CharField(max_length=150)
    avatar = models.URLField(max_length=500)
    specialty = models.CharField(max_length=100)
    qualifications = models.CharField(max_length=255)
    registration_number = models.CharField(max_length=100, unique=True)
    experience_years = models.IntegerField(default=5)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.0)
    review_count = models.IntegerField(default=0)
    fee = models.DecimalField(max_digits=10, decimal_places=2) # in INR
    verification_status = models.CharField(
        max_length=20,
        choices=(('verified', 'Verified'), ('pending', 'Pending'), ('rejected', 'Rejected')),
        default='pending'
    )
    requires_doctor_approval = models.BooleanField(default=False)
    hospital_affiliation = models.CharField(max_length=255)
    clinic_address = models.TextField()

    def __str__(self):
        return f'{self.name} ({self.specialty})'

class Appointment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending Approval'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('rejected', 'Rejected'),
    )
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patient_appointments', null=True, blank=True)
    patient_name = models.CharField(max_length=150)
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='doctor_appointments')
    date = models.DateField()
    time_slot = models.CharField(max_length=20)
    consultation_type = models.CharField(max_length=20, choices=(('video', 'Video'), ('in_clinic', 'In Clinic')))
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    fee = models.DecimalField(max_digits=10, decimal_places=2)
    reason = models.TextField()
    symptoms = models.TextField(blank=True)
    consultation_notes = models.TextField(blank=True)
    prescription = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('doctor', 'date', 'time_slot')
