package io.mosip.test.mob.inji.driver;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.ios.IOSDriver;
import io.appium.java_client.service.local.AppiumDriverLocalService;
import io.appium.java_client.service.local.AppiumServiceBuilder;
import io.appium.java_client.service.local.flags.GeneralServerFlag;
import io.mosip.test.mob.inji.constants.Target;
import io.mosip.test.mob.inji.exceptions.PlatformNotSupportException;
import io.mosip.test.mob.inji.utils.CapabilitiesReader;
import io.mosip.test.mob.inji.utils.PropertiesReader;
import org.openqa.selenium.remote.DesiredCapabilities;

import java.io.File;
import java.net.MalformedURLException;

public class DriverManager {
    private static ThreadLocal<Target> platform = new ThreadLocal<>();
    private static ThreadLocal<AppiumDriver> appiumDriver = new ThreadLocal<>();
    private static AppiumDriverLocalService service;

    private static AppiumDriver getAndroidDriver() {
        DesiredCapabilities desiredCapabilities = CapabilitiesReader.getDesiredCapabilities("androidDevice", "src/main/resources/DesiredCapabilities.json");
        appiumDriver.set(new AndroidDriver(service.getUrl(), desiredCapabilities));
        return appiumDriver.get();
    }

    private static AppiumDriver getIosDriver() {
        DesiredCapabilities desiredCapabilities = CapabilitiesReader.getDesiredCapabilities("iosDevice", "src/main/resources/DesiredCapabilities.json");
        appiumDriver.set(new IOSDriver(service.getUrl(), desiredCapabilities));
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
        AppiumServiceBuilder builder = new AppiumServiceBuilder().withAppiumJS(new File(propertiesReader.getAppiumServerExecutable())).usingDriverExecutable(new File(propertiesReader.getNodePath())).withIPAddress(ipAddress).usingAnyFreePort().withArgument(GeneralServerFlag.LOCAL_TIMEZONE).withLogFile(new File(propertiesReader.getAppiumLogFilePath()));
        service = AppiumDriverLocalService.buildService(builder);
        service.start();
    }

    public static void stopAppiumServer() {
        if (service != null)
            service.stop();
    }

    public static Target getPlatform() {
        return platform.get();
    }
}
