package inji.driver;

import inji.utils.CapabilitiesReader;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.ios.IOSDriver;
import org.openqa.selenium.remote.DesiredCapabilities;

import java.net.MalformedURLException;
import java.net.URL;

public class DriverManager {
    private static final ThreadLocal<AppiumDriver> appiumDriver = new ThreadLocal<>();

    public static AppiumDriver getAndroidDriver() {
        DesiredCapabilities desiredCapabilities = CapabilitiesReader.getDesiredCapabilities("androidDevice", "src/main/resources/DesiredCapabilities.json");
        try {
            appiumDriver.set(new AndroidDriver(new URL("http://127.0.0.1:4723/wd/hub"), desiredCapabilities));
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
        return appiumDriver.get();
    }

    public static AppiumDriver getIosDriver() {
        DesiredCapabilities desiredCapabilities = CapabilitiesReader.getDesiredCapabilities("iosDevice", "src/main/resources/DesiredCapabilities.json");
        try {
            appiumDriver.set(new IOSDriver(new URL("http://127.0.0.1:4723/wd/hub"), desiredCapabilities));
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
        return appiumDriver.get();
    }
}
