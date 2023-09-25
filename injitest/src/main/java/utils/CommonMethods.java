package utils;

import driver.DriverManager;
import exceptions.PlatformNotSupportException;
import org.openqa.selenium.OutputType;

import java.io.IOException;
import java.net.MalformedURLException;

public class CommonMethods {

    public String getBase64Image() {
        try {
            return DriverManager.getDriver(DriverManager.getPlatform()).getScreenshotAs(OutputType.BASE64);
        } catch (MalformedURLException | PlatformNotSupportException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    public static void invokeAppFromBackGroundAndroid() {
        try {
            ProcessBuilder processBuilder = new ProcessBuilder("/bin/bash", "-c", "adb shell am start -n io.mosip.residentapp/io.mosip.residentapp.MainActivity");
            processBuilder.redirectErrorStream(true);
            processBuilder.start();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}
