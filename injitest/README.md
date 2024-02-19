# Inji Automation - Mobile Automation Framework using Appium

## Overview

Inji Automation is a mobile automation framework designed for iOS and Android platforms. It automates both positive and negative scenarios to ensure comprehensive testing of mobile applications.

## Installation

To set up Appium for use with this framework, please follow the installation instructions provided in the [Appium documentation](https://appium.io/docs/en/2.2/quickstart/install/).

## Build

1. Build the JAR file: `mvn clean package -DskipTests=true`
2. The JAR file will be generated in the `target` directory.
3. For running tests on Device Farm, use the JAR file with dependencies (`zip-with-dependencies`).

## Configurations

1. Update `Config>>kernal.properties` to modify the environment settings.
2. Update the following keys in `src/main/java>>inji.utils>>TestDataReader.java`:
   - `uin`
   - `uin2`
   - `aid` for environment changes.
3. Update `Config>>config.properties` with the following values:
   - `nodePath`
   - `appiumServerExecutable`
4. Update `Config>>DesiredCapabilies.json` with the following keys:
   - `appium:udid`
   - `appium:app`
5. If the run is on Device Farm, set `isDeviceFarmRun` to `true`.
6. To run tests in an IDE, set `isDeviceFarmRun` to `false` and execute the `testng.xml` file.

## Reports

Test reports will be available in the `test-output>>emailableReports` directory after test execution.
