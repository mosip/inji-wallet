package com.test;

import constants.Target;
import driver.DriverManager;
import exceptions.PlatformNotSupportException;
import io.appium.java_client.AppiumDriver;
import org.testng.annotations.*;

import java.net.MalformedURLException;

public class BaseTest {
    protected AppiumDriver driver;
    Target target = null;

    @BeforeSuite(alwaysRun = true)
    public void beforeSuite() {
        DriverManager.startAppiumServer();
    }

    @Parameters("platformName")
    @BeforeMethod(alwaysRun = true)
    public void setup(String platformName) {
        try {
            target = Target.valueOf(platformName);
            this.driver = DriverManager.getDriver(target);
        } catch (MalformedURLException | PlatformNotSupportException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @AfterMethod(alwaysRun = true)
    public void teardown() {
        driver.quit();
    }

    @AfterSuite(alwaysRun = true)
    public void afterSuite() {
        DriverManager.stopAppiumServer();
    }

}
