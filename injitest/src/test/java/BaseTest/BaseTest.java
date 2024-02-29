package BaseTest;


import io.appium.java_client.AppiumDriver;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeSuite;

public class BaseTest {
    protected AppiumDriver driver;

    @BeforeSuite(alwaysRun = true)
    public void beforeSuite() {
        //  BaseTestCase.intiateUINGenration();
    }

    @AfterSuite(alwaysRun = true)
    public void afterSuite() {
    }

}