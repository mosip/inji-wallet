package inji.driver;

import inji.constants.Target;
import inji.exceptions.PlatformNotSupportException;
import inji.utils.CapabilitiesReader;
import inji.utils.PropertiesReader;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.ios.IOSDriver;
import io.appium.java_client.service.local.AppiumDriverLocalService;
import io.appium.java_client.service.local.AppiumServiceBuilder;
import io.appium.java_client.service.local.flags.GeneralServerFlag;
import org.openqa.selenium.remote.DesiredCapabilities;

import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;

public class DriverManager {
    private static ThreadLocal<Target> platform = new ThreadLocal<>();
    private static ThreadLocal<AppiumDriver> appiumDriver = new ThreadLocal<>();
    private static AppiumDriverLocalService service = null;

    private static Boolean isStartAppiumServer = false;
    private static AppiumDriver getAndroidDriver() {
        DesiredCapabilities desiredCapabilities = CapabilitiesReader.getDesiredCapabilities("androidDevice", "src/test/resources/DesiredCapabilities.json");
        if(isStartAppiumServer){
            appiumDriver.set(new AndroidDriver(service.getUrl(), desiredCapabilities));
        }else{
            try {
                appiumDriver.set(new AndroidDriver(new URL("http://127.0.0.1:4723/wd/hub"), desiredCapabilities));
            } catch (MalformedURLException e) {
                throw new RuntimeException(e);
            }
        }

        return appiumDriver.get();
    }

    private static AppiumDriver getIosDriver() {
        DesiredCapabilities desiredCapabilities = CapabilitiesReader.getDesiredCapabilities("iosDevice", "src/test/resources/DesiredCapabilities.json");
        appiumDriver.set(new IOSDriver(service.getUrl(), desiredCapabilities));
        if(isStartAppiumServer){
            appiumDriver.set(new IOSDriver(service.getUrl(), desiredCapabilities));
        }else{
            try {
                appiumDriver.set(new IOSDriver(new URL("http://127.0.0.1:4723/wd/hub"), desiredCapabilities));
            } catch (MalformedURLException e) {
                throw new RuntimeException(e);
            }
        }
        return appiumDriver.get();
    }

    public static AppiumDriver getDriver(Target target) throws MalformedURLException, PlatformNotSupportException, InterruptedException {
        platform.set(target);
        switch (target) {
            case ANDROID:
                return getAndroidDriver();
            case IOS:
                return getIosDriver();
        }
        throw new PlatformNotSupportException("Please provide supported OS");
    }

    public static void startAppiumServer() {
        PropertiesReader propertiesReader = new PropertiesReader();
        String ipAddress = System.getProperty("ipAddress") != null ? System.getProperty("ipAddress") : propertiesReader.getIpAddress();
        isStartAppiumServer = Boolean.parseBoolean(System.getProperty("ipAddress") != null ? System.getProperty("ipAddress") : propertiesReader.getAppiumServerStartStatus());

        if(isStartAppiumServer) {
            AppiumServiceBuilder builder = new AppiumServiceBuilder().withAppiumJS(new File(propertiesReader.getAppiumServerExecutable())).usingDriverExecutable(new File(propertiesReader.getNodePath())).withIPAddress(ipAddress).usingAnyFreePort().withArgument(GeneralServerFlag.LOCAL_TIMEZONE).withLogFile(new File(propertiesReader.getAppiumLogFilePath()));
            service = AppiumDriverLocalService.buildService(builder);
            service.start();
        }
    }

    public static void stopAppiumServer() {
        if (service != null)
            service.stop();
    }

    public static Target getPlatform() {
        return platform.get();
    }
}
