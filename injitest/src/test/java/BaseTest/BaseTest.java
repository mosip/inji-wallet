package BaseTest;


import inji.api.BaseTestCase;
import io.appium.java_client.AppiumDriver;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeSuite;

public class BaseTest {
    protected AppiumDriver driver;

    @BeforeSuite(alwaysRun = true)
    public void beforeSuite() {
          BaseTestCase.intiateUINGenration();
        try {
            Thread.sleep(9000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @AfterSuite(alwaysRun = true)
    public void afterSuite() {
    }

}