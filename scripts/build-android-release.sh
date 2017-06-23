#!/bin/bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$SCRIPT_DIR/.."

cd "$ROOT_DIR/android"

./gradlew assembleRelease && 
    echo &&
    echo "*************************" &&
    echo "* Here's your APK file: *" && 
    echo "*************************" &&
    echo &&
    ls -lh "$ROOT_DIR/android/app/build/outputs/apk/app-release.apk"

cd - > /dev/null
