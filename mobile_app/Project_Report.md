# Car Maintenance System - Mobile Application Report

## 1. Introduction
This project presents the design and implementation of the mobile application frontend for the Car Maintenance System. The application aims to provide a seamless user experience for managing vehicle services, requesting emergency assistance, and tracking maintenance orders.
My role in this phase was to design and implement the user interface, create reusable UI components, set up the project architecture using Flutter, and ensure pixel-perfect conversion of the designs into functional application screens.

## 2. Application Architecture
The application architecture represents the overall structure of the mobile app and illustrates the separation of concerns between different modules.
Main modules include:
• **Core Components**: Reusable widgets, theme, and shared UI logic.
• **Authentication Views**: Login, Registration, Password Recovery.
• **Home & Dashboard**: Main landing page with service access.
• **Services**: Categorized services, Emergency requests flow.
• **Profile & Order Management**: User details and history.
• **Notifications**: Broadcasts and alerts.

The navigation between these modules was carefully designed to ensure a smooth and intuitive user journey and avoid navigation loops.

## 3. UI/UX and Screen Design
### 3.1 Screens Overview
The application consists of several key screens, each serving a specific user need:
• `login.dart` & `create_account.dart`: Handling user onboarding securely.
• `home.dart`: A central dashboard displaying active order statuses, emergency actions (طلب ونش, صيانة طارئة), and basic services (تغيير زيت, بطارية, تعبئة وقود).
• `service_details.dart`, `location_picker.dart`, & `payment_methods.dart`: A guided flow for users to safely request and confirm a maintenance service.
• `profile.dart` & `order_history.dart`: Allowing users to view past and current maintenance records.
• `notifications.dart`: Keeping the user updated with their order statuses.

### 3.2 UI Guidelines & Theming
The following design constraints and rules were implemented:
• Centralized theming using `app_theme.dart` for Colors and global constants.
• Global typography and custom font families (Inter, Mystery Quest) applied consistently.
• Custom iconography using SVG assets.

## 4. Directory & Class Structure
The directory structure represents how the application codebase is organized to maintain scalability.
Each directory corresponds to specific application logic:
• `/lib/core/` → Contains reusable components like `AppButton`, `AppInput`, and `AppTheme`.
• `/lib/views/home/` → Contains the Home screen and standalone sub-components (e.g., `ServiceCard`).
• `/lib/views/services/` → The entire lifecycle of booking a service.
• `/lib/views/profile/` → Profile and history management.

This scalable component-based structure helps frontend developers integrate the application بسهولة مع الـ API in the upcoming phases.

## 5. Implementation
The application UI and frontend logic were implemented using the **Flutter framework** and **Dart** programming language.
The implementation process included:
• Creating the base Flutter project setup with standard packages (`flutter_svg`, `google_fonts`, `lottie`).
• Defining the global theme, styles, and reusable widgets.
• Building complex layouts (e.g., the overlapping status card on the Home screen).
• Utilizing animations and SVG rendering for high graphical fidelity.
Additionally, Flutter standard widgets were expanded into reusable core components to allow easy and rapid usage across any screen.

## 6. Testing & Validation
The frontend was continuously evaluated to ensure UI correctness and responsiveness:
• Layouts were verified across varying screen sizes to avoid overflow errors.
• Scroll physics and widget alignments were heavily tested.
• UI interactions and screen-to-screen routing were validated.

## 7. Conclusion
The mobile application's frontend layout and initial structure have been successfully designed and implemented to support the Car Maintenance System.
It provides a solid, scalable foundation for the next phase, which will involve logic implementation (State Management/Controllers) and backend API integrations. The modular structure ensures clean code, reusability, scalable UI, and efficient state management.

## 8. Attachments
The following modules are included in the current project progress:
• Application Codebase (`/lib` directory) >> Dart Source Files
• Project Dependencies (`pubspec.yaml`) >> Configs & Packages
• Asset Directory (`/assets/`) >> Icons, Fonts, and Images
