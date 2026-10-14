# Care+ Full-Stack Healthcare Platform
Comprehensive outpatient healthcare ecosystem with Flutter Web/Mobile Frontend, Django REST Framework Backend, and React Vite Web Application.

## Project Structure
- `flutter_app/`: Complete Flutter application in Dart with Material 3 styling
  - `lib/main.dart`: App entry point with named routes
  - `lib/models/`: Doctor and Appointment data models
  - `lib/services/api_service.dart`: Django REST Framework API client
  - `lib/screens/`: Landing page, Patient Dashboard, Doctor Portal, Admin Portal
- `django_backend/`: Django REST Framework backend with SQLite database
  - `api/models.py`: User, DoctorProfile, Appointment, HealthRecord models with double-booking validation
  - `api/views.py`: Doctor listings with specialty filter, Appointment booking
  - `careplus/settings.py`: App settings, CORS, SQLite configuration
- `src/`: React 19 + TypeScript + Tailwind CSS full interactive web application
  - `src/context/CareContext.tsx`: Full state orchestration & localStorage persistence
  - `src/components/`: Hero, DoctorCard, BookingModal, VideoConsultationRoom, PatientPortal, DoctorPortal, AdminPortal

## How to Run Flutter
```bash
cd flutter_app
flutter pub get
flutter run -d chrome # or flutter run for mobile
```

## How to Run Django
```bash
cd django_backend
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

## How to Run React
```bash
npm install
npm run dev
```
