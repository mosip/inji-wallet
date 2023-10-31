package io.mosip.test.mob.inji.utils;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.screenrecording.CanRecordScreen;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

public class ScreenRecording {

    public static void startScreenRecording(AppiumDriver driver){
        ((CanRecordScreen)driver).startRecordingScreen();
    }

    public static void stopScreenRecording(AppiumDriver driver){
        String base64String = ((CanRecordScreen)driver).stopRecordingScreen();
        byte[] data = Base64.getDecoder().decode(base64String);
        String
                destinationPath="report/videoRecording.mp4";
        Path path = Paths.get(destinationPath);
        try {
            Files.write(path, data);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
