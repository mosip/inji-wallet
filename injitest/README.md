# inji automation

## Overview
Automated scenario for ios & android covering positive and negative scenarios.

## Setup
###for appium setup follwo `src/main/resources>>appiumSetupDoc.docx`


## Build
1. Build jar `mvn clean package -DskipTests=true`
2. jar will be in target 
3.use `zip-with-dependencies` for deviceFarmRun,

## Configurations
1. Update `Config>>kernal.properites` to change the environment.
2.Update below keys from `src/main/java>>inji.utils>>TestDataReader.java`
`uin`,`uin2`,`aid` for env changes.
3. Update `Config>>config.properties`,update value for this keys `nodePath`,`appiumServerExecutable`.
4. Update `Config>>DesiredCapabilies.json`update value for this keys `appium:udid`,`appium:app`.
5.If the run is on devicefarm also update `isDeviceFarmRun` as true.
6.To run it in IDE run `testng.xml` file.


## Reports
This project will be in `test-output>>emailableRepots`


