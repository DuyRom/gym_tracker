#!/usr/bin/env bash
set -e

echo "=========================================="
echo "🏋️ Gym Tracker — Android APK Builder"
echo "=========================================="

# Check Java
if ! command -v java &> /dev/null; then
  echo "❌ Java (JDK 21+) không tìm thấy trong PATH."
  echo "👉 Vui lòng cài đặt OpenJDK 21:"
  echo "   sudo apt install -y openjdk-21-jdk"
  exit 1
fi

# Detect Android SDK
if [ -z "$ANDROID_HOME" ] && [ -z "$ANDROID_SDK_ROOT" ]; then
  if [ -d "$HOME/Android/Sdk" ]; then
    export ANDROID_HOME="$HOME/Android/Sdk"
    echo "ℹ️ Tự động nhận diện ANDROID_HOME=$ANDROID_HOME"
  else
    echo "⚠️ Không tìm thấy Android SDK tự động."
    echo "👉 Bạn có thể mở project bằng Android Studio:"
    echo "   npm run cap:open"
    exit 1
  fi
fi

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_DIR"

echo "🔄 Đồng bộ Capacitor web assets..."
npm run cap:sync

echo "🔨 Bắt đầu build Debug APK..."
cd android
chmod +x ./gradlew
./gradlew assembleDebug

APK_PATH="$APP_DIR/android/app/build/outputs/apk/debug/app-debug.apk"
if [ -f "$APK_PATH" ]; then
  echo ""
  echo "🎉 Build thành công!"
  echo "📱 File APK: $APK_PATH"
  echo "📲 Cài đặt vào điện thoại (USB Debugging):"
  echo "   adb install $APK_PATH"
fi
