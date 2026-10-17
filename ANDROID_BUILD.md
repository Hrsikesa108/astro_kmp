# Android App Installation & Native APK Build Guide

This application is engineered to work on **Android** in two ways:
1. **Instant Direct Install (PWA / WebAPK)** — No Android Studio required; installs directly from Chrome on Android as a standalone offline app.
2. **Native Android APK / AAB (Capacitor)** — Pre-configured with `@capacitor/core` and `capacitor.config.ts` so you can build a signed `.apk` or Google Play `.aab` bundle.

---

## Option 1: Instant Android Installation (No Build Tools Needed)

1. Open the hosted App URL in **Google Chrome on your Android phone**.
2. Tap **Settings** in the top-right corner of the app (or tap the **Install App** button if prompted in the header).
3. Alternatively, tap the Chrome `⋮` (three-dot menu) and select **Add to Home screen** → **Install**.
4. Android compiles a native **WebAPK** (`JyotiṣaPWA`) on your device with full offline support—all planetary ephemeris (`astronomy-engine`), divisional charts (`D1`, `D9`, `D10`, `D60`), and Kaṭapayādi calculations run 100% locally offline.

---

## Option 2: Building a Native `.apk` with Capacitor & Android Studio

The project includes `capacitor.config.ts` (`appId: com.jyotisa.katapayadi.ephemeris`). To generate a native Android `.apk`:

```bash
# 1. Install the Capacitor Android platform package
npm install @capacitor/android

# 2. Build the production web bundle and initialize the Android project
npm run build
npx cap add android
npx cap sync android

# 3. Open in Android Studio to run on an emulator/device or generate an APK
npx cap open android

# Or build the debug APK directly via Gradle CLI:
cd android && ./gradlew assembleDebug
# Output APK: android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Option 3: Building a Play Store APK / AAB via Bubblewrap (TWA)

Because the app serves a compliant `manifest.webmanifest` at `/manifest.webmanifest`, you can also wrap the live URL into an Android App Bundle using Google's Bubblewrap CLI:

```bash
npm i -g @bubblewrap/cli
bubblewrap init --manifest=https://<your-deployed-app-url>/manifest.webmanifest
bubblewrap build
```
