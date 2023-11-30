package inji.utils;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.screenrecording.CanRecordScreen;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

public class ScreenRecording {
    public static void startAndroidScreenRecording(AppiumDriver driver){
        ((CanRecordScreen)driver).startRecordingScreen();
    }

    public static void stopAndroidScreenRecording(AppiumDriver driver, String methodName){
        String base64String = ((CanRecordScreen)driver).stopRecordingScreen();
        byte[] data = Base64.getDecoder().decode(base64String);
        String
                destinationPath="report/recordings/android/"+methodName+".mp4";
        Path path = Paths.get(destinationPath);
        try {
            Files.write(path, data);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static void startIosScreenRecording(AppiumDriver driver){
        ((CanRecordScreen)driver).startRecordingScreen();
    }

    public static void stopIosScreenRecording(AppiumDriver driver, String methodName){
        String base64String = ((CanRecordScreen)driver).stopRecordingScreen();
        byte[] data = Base64.getDecoder().decode(base64String);
        String
                destinationPath="report/recordings/ios/"+methodName+".mp4";
        Path path = Paths.get(destinationPath);
        try {
            Files.write(path, data);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
