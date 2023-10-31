package io.mosip.test.mob.inji.testcases;

import io.appium.java_client.AppiumDriver;
import io.mosip.test.mob.inji.api.MockSMTPListener;
import io.mosip.test.mob.inji.constants.Target;
import io.mosip.test.mob.inji.driver.DriverManager;
import io.mosip.test.mob.inji.utils.TestDataReader;

import java.net.MalformedURLException;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.BeforeSuite;
import org.testng.annotations.Parameters;

public class BaseTest {
  protected AppiumDriver driver;
  static String NewOtp =GetOtp();
  
  Target target = null;
  
  @BeforeSuite(alwaysRun = true)
  public void beforeSuite() {
	  MockSMTPListener mockSMTPListener = new MockSMTPListener();
		mockSMTPListener.run();
    DriverManager.startAppiumServer();
  }
  
  @Parameters({"platformName"})
  @BeforeMethod(alwaysRun = true)
  public void setup(String platformName) {
    try {
      this.target = Target.valueOf(platformName);
      this.driver = DriverManager.getDriver(this.target);
    } catch (MalformedURLException|io.mosip.test.mob.inji.exceptions.PlatformNotSupportException|InterruptedException e) {
      throw new RuntimeException(e);
    } 
  }
  
  @AfterMethod(alwaysRun = true)
  public void teardown() {
    this.driver.quit();
  }
  
  @AfterSuite(alwaysRun = true)
  public void afterSuite() {
    DriverManager.stopAppiumServer();
    MockSMTPListener mockSMTPListener = new MockSMTPListener();
		mockSMTPListener.bTerminate = true;
  }
  
  public static String GetOtp() {
	  String otp="";
	  String externalemail = TestDataReader.readData("externalemail");
	  otp = MockSMTPListener.getOtp(externalemail);
	  return otp;
  }
}
