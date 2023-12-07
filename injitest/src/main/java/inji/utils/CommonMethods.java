package inji.utils;

import inji.driver.DriverManager;
import inji.exceptions.PlatformNotSupportException;
import org.openqa.selenium.OutputType;

import java.io.IOException;
import java.net.MalformedURLException;

public class CommonMethods {

    public static void invokeAppFromBackGroundAndroid() {
        try {
            ProcessBuilder processBuilder = new ProcessBuilder("/bin/bash", "-c", "adb shell am start -n io.mosip.residentapp/io.mosip.residentapp.MainActivity");
            processBuilder.redirectErrorStream(true);
            processBuilder.start();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    public static void enableAirplaneMode() {
        try {
        	ProcessBuilder processBuilder=null;
            String osName = System.getProperty("os.name");
            if (osName.contains("Windows")) {
            	processBuilder = new ProcessBuilder("cmd.exe", "/c", "adb shell cmd connectivity airplane-mode enable");
               
            } else {
            	processBuilder = new ProcessBuilder("/bin/bash", "-c", "adb shell cmd connectivity airplane-mode enable");
            }
            processBuilder.redirectErrorStream(true);
            processBuilder.start();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    public static void disableAirplaneMode() {
        try {
        	ProcessBuilder processBuilder=null;
            String osName = System.getProperty("os.name");
            if (osName.contains("Windows")) {
            	processBuilder = new ProcessBuilder("cmd.exe", "/c", "adb shell cmd connectivity airplane-mode disable");
               
            } else {
            	processBuilder = new ProcessBuilder("/bin/bash\", \"-c\", \"adb shell cmd connectivity airplane-mode disable");
            }
            processBuilder.redirectErrorStream(true);
            processBuilder.start();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
