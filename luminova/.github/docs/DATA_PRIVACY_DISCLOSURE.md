# Data Privacy Disclosure for Luminova Controller
**App Name:** Luminova Controller  
**Bundle ID:** com.formacristata.luminovacontroller  
**Developer:** Forma Cristata  
**Document Version:** 1.0  
**Date:** August 26, 2025

## Executive Summary
This document outlines the data collection, usage, and sharing practices for Luminova Controller, in compliance with app store privacy requirements. **The app follows a privacy-by-design approach with minimal data collection.**

---

## Required User Data Types Collected and/or Shared

### ✅ Data We Collect
**None.** Luminova Controller does not collect any user data types as defined by app store privacy guidelines.

### ❌ Data We Do NOT Collect
- Personal identifiers (name, email, phone number, address)
- Financial information
- Health and fitness data
- Location data
- Search history
- Browsing history
- User content (photos, videos, messages)
- Usage data or analytics
- Device identifiers for tracking
- Crash logs sent to external services

---

## User Data Sent Off Device by Libraries or SDKs

### Analysis of Third-Party Dependencies

#### **Expo SDK (v53.0.22)**
- **Data Transmission:** None to Expo servers in production builds
- **Purpose:** React Native framework and development tools
- **User Data Impact:** No user data collected or transmitted

#### **React Navigation (@react-navigation/***)**
- **Data Transmission:** None
- **Purpose:** In-app navigation
- **User Data Impact:** No user data collected or transmitted

#### **AsyncStorage (@react-native-async-storage/async-storage)**
- **Data Transmission:** None
- **Purpose:** Local device storage
- **User Data Impact:** Data stored locally only, never transmitted

#### **Expo Audio (~0.4.9)**
- **Data Transmission:** None
- **Purpose:** Microphone access for BPM detection
- **User Data Impact:** Audio processed locally in real-time, no recording or transmission

#### **React Native Gesture Handler**
- **Data Transmission:** None
- **Purpose:** Touch gesture recognition
- **User Data Impact:** No user data collected or transmitted

#### **React Native Reanimated**
- **Data Transmission:** None
- **Purpose:** Animation framework
- **User Data Impact:** No user data collected or transmitted

### **Summary for Libraries/SDKs:**
**No user data is sent off the device by any libraries or SDKs used in this app.**

---

## User Data Transferred to Third Parties

### Server-to-Third-Party Transfers
**None.** The app does not operate any servers or backend services.

### Device-to-Third-Party Transfers
**None.** All data remains on the user's device or local network.

### App-to-App Transfers
**None.** The app does not share data with other applications on the device.

---

## User Data Collected Through WebViews

### WebView Usage
**None.** Luminova Controller does not implement any WebView components or web content.

---

## Local Data Storage (Device-Only)

While not transmitted off-device, the app stores the following data locally:

### IP Address Configuration
- **Type:** Network configuration data
- **Purpose:** Connect to user's LED hardware on local network
- **Storage:** AsyncStorage on device
- **Transmission:** Only sent to user-specified LED controller (not external servers)

### Application Preferences
- **Type:** LED configurations, color settings, animation preferences
- **Purpose:** Maintain user's personalized LED setup
- **Storage:** Device file system using Expo FileSystem
- **Transmission:** Only sent to local LED hardware when user applies changes

### Audio Processing (Temporary)
- **Type:** Real-time audio analysis for BPM detection
- **Purpose:** Synchronize LED effects with music
- **Storage:** Processed in memory only, not stored
- **Transmission:** None - processed locally and discarded

---

## Network Communication

### Local Network Only
- **Scope:** Communication limited to user's local network
- **Target:** User's LED controller hardware
- **Protocol:** HTTP REST API calls
- **Data:** LED control commands (colors, patterns, brightness)
- **External Transmission:** None

### No External Servers
- ❌ No analytics services
- ❌ No crash reporting services  
- ❌ No cloud storage
- ❌ No social media integration
- ❌ No advertising networks
- ❌ No tracking services

---

## Permissions and Their Usage

### Microphone Permission
- **Purpose:** Real-time BPM (beats per minute) detection from audio
- **Data Handling:** Audio processed locally in real-time
- **Storage:** No audio data recorded or stored
- **Transmission:** No audio data transmitted anywhere
- **User Control:** Can be revoked through device settings

### Audio Permission (Android)
- **Purpose:** Modify audio settings for BPM detection
- **Data Handling:** System-level audio configuration only
- **Storage:** No user data stored
- **Transmission:** No data transmitted

---

## Children's Privacy Compliance

### COPPA Compliance
- **Age Restriction:** App suitable for all ages
- **Data Collection:** No personal information collected from any users
- **Special Protections:** Not applicable (no data collection)

---

## Data Security Measures

### Security by Design
- **No Personal Data:** No personal data to be compromised
- **Local Storage Security:** Uses standard device security measures
- **Network Security:** Local network communication only
- **Encryption:** Device-level encryption for local storage

---

## User Rights and Controls

### Microphone Access
- **Enable/Disable:** Through device settings
- **Impact:** Only affects BPM detection features
- **Alternatives:** Manual BPM input available

### Local Data Management
- **Clear Data:** Through device settings or app uninstall
- **Data Portability:** Not applicable (no personal data)
- **Data Deletion:** Automatic upon app uninstall

---

## Compliance Statement

This disclosure complies with:
- ✅ App Store privacy requirements
- ✅ Google Play Store data safety requirements
- ✅ iOS Privacy Manifest guidelines
- ✅ General privacy best practices

---

## Contact Information

**Developer:** Forma Cristata  
**App:** Luminova Controller  
**Bundle ID:** com.formacristata.luminovacontroller  

For privacy-related questions about this disclosure, please contact the developer through the app store listing.

---

## Document Updates

This document will be updated if:
- App functionality changes affect data handling
- New third-party libraries are added
- Privacy requirements change

**Last Updated:** August 26, 2025  
**Version:** 1.0

---

## Summary Checklist

- ✅ **No user data collection** - App collects no personal information
- ✅ **No external data transmission** - All data remains local or on user's network
- ✅ **No third-party data sharing** - No data shared with any external services
- ✅ **No WebView data collection** - No web content or tracking
- ✅ **Library compliance** - All dependencies respect user privacy
- ✅ **Local-only storage** - User data stored only on device
- ✅ **Optional permissions** - Microphone usage is optional and clearly explained
- ✅ **User control** - Complete user control over all app functions

**Luminova Controller prioritizes user privacy through a zero-collection approach to personal data.**
