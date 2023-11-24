package io.mosip.test.mob.inji.BaseTest;

import io.mosip.test.mob.inji.constants.Target;
import io.mosip.test.mob.inji.driver.DriverManager;
import io.mosip.test.mob.inji.exceptions.PlatformNotSupportException;
import io.mosip.test.mob.inji.BaseTest.BaseTest;
import io.mosip.test.mob.inji.utils.ScreenRecording;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Parameters;

import java.net.MalformedURLException;

public class IosBaseTest extends BaseTest {
    @Parameters("platformName")
    @BeforeMethod(alwaysRun = true)
    public void setup(String platformName) {
        try {
            //Target target = Target.valueOf(platformName);
            this.driver = DriverManager.getDriver(Target.IOS);
        } catch (MalformedURLException | PlatformNotSupportException | InterruptedException e) {
            throw new RuntimeException(e);
        }
        ScreenRecording.startIosScreenRecording(driver);
    }

    @AfterMethod(alwaysRun = true)
    public void teardown(ITestResult result) {
        ScreenRecording.stopIosScreenRecording(driver,result.getMethod().getMethodName());
        driver.quit();
    }
}
