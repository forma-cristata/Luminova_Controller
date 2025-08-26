# Services Directory
## Overview
The `services/` directory contains the business logic layer that handles API communication, data persistence, and external integrations for the LED controller app.
## Service Files
### ApiService.ts
**Purpose:** Centralized REST API communication layer for all LED controller hardware interactions with unified error handling and response management.

### FirstTimeUserService.ts
**Purpose:** Manages initial app setup, user onboarding flow, and first-time configuration establishment for new LED controller users.

### IpConfigService.ts
**Purpose:** Handles IP address configuration, LED controller hardware discovery, and network connection management.

### SettingsService.ts
**Purpose:** Manages persistence and retrieval of user settings, LED configurations, and app preferences using local storage.
