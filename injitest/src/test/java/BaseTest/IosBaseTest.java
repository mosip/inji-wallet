package BaseTest;

import inji.constants.Target;
import inji.driver.DriverManager;
import inji.exceptions.PlatformNotSupportException;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

import java.net.MalformedURLException;

public class IosBaseTest extends BaseTest {
    @BeforeMethod(alwaysRun = true)
    public void setup() {
        this.driver = DriverManager.getIosDriver();
    }

    @AfterMethod(alwaysRun = true)
    public void teardown(ITestResult result) {
        driver.quit();
    }
}
