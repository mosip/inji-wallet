package io.mosip.test.mob.inji.driver;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.options.UiAutomator2Options;
import io.appium.java_client.ios.IOSDriver;
import io.appium.java_client.ios.options.XCUITestOptions;
import io.appium.java_client.service.local.AppiumDriverLocalService;
import io.mosip.test.mob.inji.constants.Target;
import io.mosip.test.mob.inji.exceptions.PlatformNotSupportException;
import io.mosip.test.mob.inji.utils.PropertiesReader;
import io.mosip.test.mob.inji.utils.TestDataReader;
import java.net.MalformedURLException;
import java.net.URL;
import org.openqa.selenium.Capabilities;

public class DriverManager {
  private static ThreadLocal<Target> platform = new ThreadLocal<>();
  
  private static ThreadLocal<AppiumDriver> appiumDriver = new ThreadLocal<>();
  
  private static AppiumDriverLocalService service;
  
  private static AppiumDriver getAndroidDriver() throws MalformedURLException {
    UiAutomator2Options options = new UiAutomator2Options();
    options.setAvd(TestDataReader.readData("androidDevice"));
    options.setApp(TestDataReader.readData("androidAppPath"));
    options.setAutoGrantPermissions(true);
    appiumDriver.set(new AndroidDriver(new URL("http://127.0.0.1:4723"), (Capabilities)options));
    return appiumDriver.get();
  }
  
  private static AppiumDriver getIosDriver() {
    XCUITestOptions options = new XCUITestOptions();
    options.setDeviceName("iPhone 14 Pro");
    options.setApp(System.getProperty("user.dir") + "/apps/ios/Inji_0.9.1.zip");
    options.autoAcceptAlerts();
    options.autoDismissAlerts();
    appiumDriver.set(new IOSDriver(service.getUrl(), (Capabilities)options));
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
	  
//	  PropertiesReader propertiesReader = new PropertiesReader();
	  //
//	          String ipAddress = System.getProperty("ipAddress") != null ? System.getProperty("ipAddress") : propertiesReader.getIpAddress();
//	          int port = System.getProperty("port") != null ? Integer.parseInt(Objects.requireNonNull(System.getProperty("ipAddress"))) : propertiesReader.getPortNumber();
	  //
//	          AppiumServiceBuilder builder = new AppiumServiceBuilder().withAppiumJS(new File(propertiesReader.getAppiumServerExecutable())).usingDriverExecutable(new File(propertiesReader.getNodePath())).withIPAddress(ipAddress).usingPort(port).withArgument(GeneralServerFlag.LOCAL_TIMEZONE).withLogFile(new File(propertiesReader.getAppiumLogFilePath()));
	  //
//	          service = AppiumDriverLocalService.buildService(builder);
//	          service.start();
  }
  
  public static void stopAppiumServer() {
    if (service != null)
      service.stop(); 
  }
  
  public static Target getPlatform() {
    return platform.get();
  }
}
