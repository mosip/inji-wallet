package BaseTest;

import inji.constants.Target;
import inji.driver.DriverManager;
import inji.exceptions.PlatformNotSupportException;
import inji.utils.ScreenRecording;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Parameters;

import java.net.MalformedURLException;

public class AndroidBaseTest extends BaseTest {
    @BeforeMethod(alwaysRun = true)
    public void setup() {
        try {
            this.driver = DriverManager.getDriver(Target.ANDROID, isDeviceFarmRun);
        } catch (MalformedURLException | PlatformNotSupportException | InterruptedException e) {
            throw new RuntimeException(e);
        }
        if (!isDeviceFarmRun) {
            ScreenRecording.startAndroidScreenRecording(driver);
        }
    }

    @AfterMethod(alwaysRun = true)
    public void teardown(ITestResult result) {
        if (!isDeviceFarmRun) {
            ScreenRecording.stopAndroidScreenRecording(driver, result.getMethod().getMethodName());
        }
        driver.quit();
    }
}
