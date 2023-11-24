package io.mosip.test.mob.inji.BaseTest;


import io.appium.java_client.AppiumDriver;
import io.mosip.test.mob.inji.constants.Target;
import io.mosip.test.mob.inji.driver.DriverManager;

import org.testng.annotations.*;

public class BaseTest {
    protected AppiumDriver driver;
    //protected Target target = null;

    @BeforeSuite(alwaysRun = true)
    public void beforeSuite() {
        DriverManager.startAppiumServer();
    }

    @AfterSuite(alwaysRun = true)
    public void afterSuite() {
        DriverManager.stopAppiumServer();
    }
    
}