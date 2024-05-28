package BaseTest;

import inji.driver.DriverManager;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

public class AndroidBaseTest extends BaseTest {
    @BeforeMethod(alwaysRun = true)
    public void setup() {
        this.driver = DriverManager.getAndroidDriver();
    }

    @AfterMethod(alwaysRun = true)
    public void teardown(ITestResult result) {
        driver.quit();
    }
}
