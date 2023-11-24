package BaseTest;


import inji.api.BaseTestCase;
import io.appium.java_client.AppiumDriver;
import inji.driver.DriverManager;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeSuite;

public class BaseTest {
    protected AppiumDriver driver;
    //protected Target target = null;

    @BeforeSuite(alwaysRun = true)
    public void beforeSuite() {
        DriverManager.startAppiumServer();
        BaseTestCase.intiateUINGenration();
    }

    @AfterSuite(alwaysRun = true)
    public void afterSuite() {
        DriverManager.stopAppiumServer();
    }
    
}