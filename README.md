# rgb-led-control

Built this because existing apps didn't work  and LED strip was just lying around unsued.

---

## What to expect?
 Vibe-coded so not much 

- **Remote UI:** Grouped button grid for Power, Brightness, Colors, and Effects.
- **Native IR Transmission:** Sends Pronto-format IR commands using Android's ConsumerIrManager (requires custom dev client).

---

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Build a custom dev client (required for IR)**
   ```bash
   npx expo prebuild --clean
   npx expo run:android
   ```
   > _Note: Expo Go cannot access IR hardware. Use a custom dev client or production build._

3. **Install the APK on your device**
   - Use `adb install <path-to-apk>` or follow Expo's instructions.

4. **Start the app**
   - Open the app on your device and use the remote UI.

---

## Environment Setup

- **Java 17** required for Android builds.
- **Android SDK** must be installed and `ANDROID_HOME`/`ANDROID_SDK_ROOT` set.
- **adb** (Android Debug Bridge) should be in your PATH.

---

## IR Patterns

- IR commands are loaded from Pronto-format hex strings.
- Patterns are defined in `constants/ir-commands.ts`.

---

## Troubleshooting

- If IR transmission fails, check device logs:
  ```bash
  adb logcat | grep IrModule
  ```
- Ensure your device supports ConsumerIrManager and has an IR blaster.

---

## Contributing

Pull requests and suggestions are welcome!

---

## License

MIT
