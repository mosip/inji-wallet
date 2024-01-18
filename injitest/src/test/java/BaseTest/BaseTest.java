package BaseTest;


import inji.api.BaseTestCase;
import inji.utils.TestDataReader;
import io.appium.java_client.AppiumDriver;
import inji.driver.DriverManager;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeSuite;

public class BaseTest {
    protected AppiumDriver driver;
    protected Boolean isDeviceFarmRun = Boolean.parseBoolean(TestDataReader.readData("isDeviceFarmRun"));

    @BeforeSuite(alwaysRun = true)
    public void beforeSuite() {
        if (!isDeviceFarmRun) {
            DriverManager.startAppiumServer();
          //  BaseTestCase.intiateUINGenration();
        }
    }

    @AfterSuite(alwaysRun = true)
    public void afterSuite() {
        if (!isDeviceFarmRun) {
            DriverManager.stopAppiumServer();
        }
    }

}