# Android App Installation & GitHub Actions APK Build Guide

This application is configured to build a downloadable **Capacitor Android `.apk`** automatically via **GitHub Actions**, as well as supporting direct local builds and instant WebAPK installation.

---

## Option 1: Download the Android `.apk` via GitHub Actions (No Local Setup Needed)

A complete CI workflow is configured at `.github/workflows/build-android-apk.yml`. Every time you push to `main`/`master` (or trigger it manually), GitHub Actions compiles the production Vite bundle, generates/syncs the Capacitor Android project, runs Gradle (`./gradlew assembleDebug`), and uploads the ready-to-install `.apk`.

### How to Download Your APK from GitHub:
1. Push or sync this repository to **GitHub**.
2. Open your repository on GitHub and click the **Actions** tab at the top.
3. Select the **Build Android APK (Capacitor)** workflow on the left.
4. *(Optional)* Click **Run workflow** → **Run workflow** to trigger a build on demand at any time.
5. Once the workflow run completes (green checkmark), scroll down to the **Artifacts** section at the bottom of the run summary page.
6. Click **`Jyotisa-Katapayadi-Android-APK`** to download the `.zip` containing:
   - `Jyotisa-Katapayadi-Ephemeris-debug.apk` (Signed with Android debug key — ready to install directly on your Android phone!)
   - `Jyotisa-Katapayadi-Ephemeris-release-unsigned.apk` (Unsigned release APK for Play Store signing).

---

## Option 2: Building a Native `.apk` Locally with Capacitor

All Capacitor dependencies (`@capacitor/core`, `@capacitor/cli`, `@capacitor/android`) and `capacitor.config.ts` (`appId: com.jyotisa.katapayadi.ephemeris`) are pre-installed in `package.json`.

```bash
# 1. Build the web app and initialize/sync the Android platform
npm run build
npx cap add android
npx cap sync android

# 2. Build the APK via Gradle CLI
cd android && ./gradlew assembleDebug
# Output APK: android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Option 3: Instant Android Installation (PWA / WebAPK)

1. Open the hosted App URL in **Google Chrome on your Android phone**.
2. Tap **Install App** in the top bar, or open Chrome's **Menu → Add to Home screen / Install app**.
3. Android installs a standalone offline app (`JyotiṣaPWA`) on your home screen.
