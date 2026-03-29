# Insurance Mobile (Flutter)

Flutter client for the same **FastAPI** backend as `insurance_web/`. It mirrors the React app’s flows: policyholder portal, admin/employee tools, JWT auth, and the `{ success, data, error }` API envelope.

## Prerequisites

- [Flutter](https://docs.flutter.dev/get-started/install) (stable channel), Dart **3.3+**
- [Git for Windows](https://git-scm.com/download/win) on your **PATH** (Flutter uses it for the SDK tooling)
- Backend running (see repository root `README.md` and `insurance_service/README.md`)

### Windows: PATH and next steps

1. **Flutter `bin` on PATH** — Add the folder that contains `flutter.bat`, for example:

   `C:\flutter\flutter_windows_3.41.6-stable\flutter\bin`

   In **Environment Variables → User → Path**, either create **Path** or **Edit** it and add that line. Putting Flutter **near the top** avoids shadowing by other tools, as recommended in the official install guide.

2. **Apply PATH** — Close and reopen **all** terminals, **Command Prompt**, **Windows Terminal**, and **Cursor** (or VS Code) so they load the updated `Path`.

3. **Check the toolchain** (new terminal):

   ```powershell
   flutter --version
   dart --version
   flutter doctor
   ```

   Install anything `flutter doctor` marks as missing (Android Studio / VS Build Tools / Chrome as needed). For Android builds:

   ```powershell
   flutter doctor --android-licenses
   ```

4. **If you see** `Unable to determine engine version` or cache file locks, see **Troubleshooting: Flutter SDK cache locked** at the end of this file.

## First-time project setup

If `android/` or `ios/` are missing or incomplete, generate platform folders from this directory:

```bash
cd insurance_mob
flutter create . --project-name insurance_mob
```

Then install dependencies:

```bash
flutter pub get
```

## Configure API base URL

The app talks to the backend **directly** (no `/api` proxy like Vite).

| Environment | Typical base URL |
|-------------|------------------|
| Android emulator | `http://10.0.2.2:8000` (default in code) |
| iOS simulator | `http://localhost:8000` |
| Physical device | `http://<your-computer-LAN-IP>:8000` |

### Important: `10.0.2.2` is only for the Android emulator

`10.0.2.2` is a **virtual alias** inside the emulator that points at your PC’s loopback. It does **not** work from:

- PowerShell / Command Prompt on Windows  
- Chrome or curl on your PC  
- Postman on your PC  

From your **PC**, call the API on **`http://127.0.0.1:8000`** or **`http://localhost:8000`** (and use **POST** for login, not GET):

```powershell
curl -X POST "http://127.0.0.1:8000/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"rahulmore\",\"password\":\"password@123\"}"
```

If that times out, the backend is not running, is on another port, or the firewall is blocking local access—fix that before testing from the emulator.

### Connection timeouts from the emulator

If the **Flutter** app times out but `curl http://127.0.0.1:8000/login` works on the PC:

1. Confirm **uvicorn is running** while you test the app.  
2. Allow **Python** (or your terminal) through **Windows Firewall** for private networks.  
3. Try binding explicitly (from repo root):  
   `python -m uvicorn insurance_service.main:app --reload --host 127.0.0.1 --port 8000`  
4. Dio timeouts are set in `lib/services/api_client.dart` (connect **30s**, receive **60s**).

Override at run time:

```bash
flutter run --dart-define=API_BASE_URL=http://192.168.1.10:8000
```

Default is defined in `lib/constants/api_constants.dart`.

### CORS

Ensure `CORS_ORIGINS` in the backend environment includes the origins you use during development if the browser or certain tooling enforces CORS. Mobile apps are not browsers, but any web-based testing might be.

## Run

```bash
cd insurance_mob
flutter run
```

### ADB on PATH (Windows, physical phone)

Flutter uses **ADB** to talk to a USB-connected Android device. The folder you add to `Path` must be the one that contains **`adb.exe`** (the **platform-tools** directory).

1. **If you use Android Studio** (typical), that folder is usually:
   - `C:\Users\<you>\AppData\Local\Android\Sdk\platform-tools`  
   - Or open Android Studio → **Settings → Languages & Frameworks → Android SDK** and note **Android SDK location**, then append `\platform-tools`.

2. **If you downloaded standalone [platform-tools](https://developer.android.com/tools/releases/platform-tools)** only, extract it somewhere (for example `C:\platform-tools`) and add **that** folder to `Path`.

3. **Add to PATH** (your steps are correct; **User** `Path` is enough if you are the only user):
   - Search → **Edit the system environment variables** → **Environment Variables**
   - Under **User variables** or **System variables**, select **Path** → **Edit** → **New**
   - Paste the full path to the **`platform-tools`** folder (examples above)
   - **OK** all dialogs, then **open a new** terminal

4. **Check**:
   ```powershell
   adb version
   ```
   If the command is not found, the path is wrong or the terminal was opened before saving PATH.

## Test and analyze

```bash
flutter test
flutter analyze
```

## Build

```bash
flutter build apk    # Android
flutter build ios    # macOS + Xcode required
```

## Authentication

- **JWT** is stored with **flutter_secure_storage** (key aligned with the web concept of `insurance_token`).
- User profile JSON is stored in **shared_preferences** (similar to web `insurance_user`).
- **Dio** sends `Authorization: Bearer <token>` on requests. Missing or invalid tokens yield **401**; the app clears the session (same idea as the web client).

Public endpoints (no token): `POST /login`, `POST /users/` (signup).

## Demo accounts

Same as the rest of the workspace (see root `README.md`):

| Username   | Password     | Role        |
|------------|--------------|-------------|
| `admin_emp` | `password@123` | Employee   |
| `rahulmore` | `password@123` | Policyholder |

## Project structure

```
insurance_mob/lib/
├── main.dart, app.dart
├── constants/       # API base URL, endpoints, enums
├── models/          # User, policies, Claim (+ nested claimant/loss), documents
├── services/        # Dio ApiClient + REST services
├── providers/       # Auth, policy, claim, document (Provider)
├── router/          # go_router, role redirects
├── screens/         # login/signup, portal/*, admin/*
├── widgets/         # StatCard, StatusBadge, drawer, mock payment sheet, etc.
└── utils/           # INR formatting, validators
```

## Permissions (Android)

FNOL and the surveyor flow use the **camera** and may use the **photo library**. After `flutter create`, confirm `AndroidManifest.xml` includes `INTERNET` and, if needed, `CAMERA` (and iOS `Info.plist` camera/photo usage strings) for release builds.

## Troubleshooting: Flutter SDK cache locked

If `flutter run` or `flutter doctor` fails with:

`The process cannot access the file ...\bin\cache\engine.stamp`  
`Error: Unable to determine engine version...`

something else is **holding a lock** on the Flutter SDK cache (very common on Windows).

### Fix (try in order)

1. **Use one Flutter at a time**  
   Do not run `flutter pub get`, `flutter run`, and IDE “Flutter/Dart” tasks together. Wait for one command to finish before starting another.

2. **Run Flutter outside Cursor’s integrated terminal (recommended)**  
   Cursor (and the Dart/Flutter extension) can spawn `dart` processes that touch the same `bin\cache` files.  
   - Close **Cursor** completely, **or** disable heavy Dart analysis temporarily.  
   - Open **Windows Terminal** or **cmd.exe** and run:

   ```powershell
   cd C:\Users\rahul11.more\Downloads\projects\ps\insurance_workspace\insurance_mob
   flutter doctor
   flutter run
   ```

3. **Stop stray Dart/Flutter processes** (after closing Cursor, or only if you know it’s safe):

   ```powershell
   taskkill /F /IM dart.exe 2>$null
   taskkill /F /IM dartaotruntime.exe 2>$null
   ```

   Then run `flutter doctor` again in a **single** terminal.

4. **Antivirus / Windows Search**  
   Add an **exclusion** for your Flutter SDK folder, e.g.  
   `C:\flutter\flutter_windows_3.41.6-stable\flutter`  
   Real-time scanning often locks `engine.stamp` while Flutter tries to write it.

5. **Do not put the SDK inside OneDrive / synced Desktop**  
   Sync tools lock files constantly; install Flutter under a normal path like `C:\flutter\...`.

6. **Last resort (SDK idle, Cursor closed)**  
   If nothing is running and it still fails, delete the stamp and let Flutter recreate it:

   ```powershell
   del "C:\flutter\flutter_windows_3.41.6-stable\flutter\bin\cache\engine.stamp"
   flutter doctor
   ```

   If problems continue, run `flutter precache` once (still with only one terminal using Flutter).

## Related docs

- Backend: `insurance_service/README.md`
- Web client: `insurance_web/README.md`
- Mobile conventions: `.postqode/rules/mobile_agent.md`
