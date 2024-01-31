package inji.utils;

import java.io.IOException;

public class AndroidUtil {

    public static void invokeAppFromBackGroundAndroid() {
        try {
        	ProcessBuilder processBuilder=null;
            String osName = System.getProperty("os.name");
            if (osName.contains("Windows")) {
            	processBuilder = new ProcessBuilder("cmd.exe", "/c", "adb shell am start -n io.mosip.residentapp/io.mosip.residentapp.MainActivity");
               
            } else {
            	processBuilder = new ProcessBuilder("/bin/bash", "-c", "adb shell am start -n io.mosip.residentapp/io.mosip.residentapp.MainActivity");
            }
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
    
    public static void disableBluetooth() {
        try {
        	ProcessBuilder processBuilder=null;
            String osName = System.getProperty("os.name");
            if (osName.contains("Windows")) {
            	processBuilder = new ProcessBuilder("cmd.exe", "/c", "adb shell cmd bluetooth_manager disable");
               
            } else {
            	processBuilder = new ProcessBuilder("/bin/bash", "-c", "adb shell cmd bluetooth_manager disable");
            }
            processBuilder.redirectErrorStream(true);
            processBuilder.start();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    public static void ForceStopeApp() {
        try {
        	ProcessBuilder processBuilder=null;
            String osName = System.getProperty("os.name");
            if (osName.contains("Windows")) {
            	processBuilder = new ProcessBuilder("cmd.exe", "/c", "adb shell am force-stop io.mosip.residentapp");
               
            } else {
            	processBuilder = new ProcessBuilder("/bin/bash", "-c", "adb shell am force-stop io.mosip.residentapp");
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