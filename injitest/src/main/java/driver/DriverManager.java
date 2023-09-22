package driver;

import constants.Target;
import exceptions.PlatformNotSupportException;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.options.UiAutomator2Options;
import io.appium.java_client.ios.IOSDriver;
import io.appium.java_client.ios.options.XCUITestOptions;
import io.appium.java_client.service.local.AppiumDriverLocalService;
import io.appium.java_client.service.local.AppiumServiceBuilder;
import io.appium.java_client.service.local.flags.GeneralServerFlag;
import utils.PropertiesReader;

import java.io.File;
import java.net.MalformedURLException;
import java.util.Objects;

public class DriverManager {
    private static ThreadLocal<Target> platform = new ThreadLocal<>();
    private static ThreadLocal<AppiumDriver> appiumDriver = new ThreadLocal<>();

    private static AppiumDriverLocalService service;

    private static AppiumDriver getAndroidDriver() {
        UiAutomator2Options options = new UiAutomator2Options();
        options.setAvd("nightwatch-android-11");
        options.setApp(System.getProperty("user.dir") + "/apps/android/Inji_latest.apk");
        options.setAutoGrantPermissions(true);
        //options.setIsHeadless(true);
        appiumDriver.set(new AndroidDriver(service.getUrl(), options));
        return appiumDriver.get();
    }

    private static AppiumDriver getIosDriver() {
        XCUITestOptions options = new XCUITestOptions();
        options.setDeviceName("iPhone 14 Pro");
        options.setApp(System.getProperty("user.dir") + "/apps/ios/Inji_0.9.1.zip");
        options.autoAcceptAlerts();
        options.autoDismissAlerts();
        appiumDriver.set(new IOSDriver(service.getUrl(), options));
        return appiumDriver.get();
    }

    public static AppiumDriver getDriver(Target target) throws MalformedURLException, PlatformNotSupportException, InterruptedException {
        platform.set(target);
        switch (target) {
            case ANDROID:
                return getAndroidDriver();
            case IOS:
                return getIosDriver();
            default:
                throw new PlatformNotSupportException("Please provide supported OS");
        }
    }

    public static void startAppiumServer() {
        PropertiesReader propertiesReader = new PropertiesReader();

        String ipAddress = System.getProperty("ipAddress") != null ? System.getProperty("ipAddress") : propertiesReader.getIpAddress();
        int port = System.getProperty("port") != null ? Integer.parseInt(Objects.requireNonNull(System.getProperty("ipAddress"))) : propertiesReader.getPortNumber();

        AppiumServiceBuilder builder = new AppiumServiceBuilder().withAppiumJS(new File(propertiesReader.getAppiumServerExecutable())).usingDriverExecutable(new File(propertiesReader.getNodePath())).withIPAddress(ipAddress).usingPort(port).withArgument(GeneralServerFlag.LOCAL_TIMEZONE).withLogFile(new File(propertiesReader.getAppiumLogFilePath()));

        service = AppiumDriverLocalService.buildService(builder);
        service.start();
    }

    public static void stopAppiumServer() {
        if (service != null) {
            service.stop();
        }
    }

    public static Target getPlatform() {
        return platform.get();
    }

}
