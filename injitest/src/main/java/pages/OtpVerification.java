package pages;

import constants.Target;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class OtpVerification extends BasePage {

    @AndroidFindBy(xpath = "//*[contains(@text,'OTP Verification')]")
    @iOSXCUITFindBy(accessibility = "OTP Verification")
    private WebElement otpVerificationText;

    public OtpVerification(AppiumDriver driver) {
        super(driver);
    }

    public boolean isOtpVerificationPageLoaded() {
        return this.isElementDisplayed(otpVerificationText, "Otp verification page");
    }

    public HomePage enterOtp(String otp, Target os) {
        SetPasscode setPasscode = new SetPasscode(driver);
        setPasscode.enterPasscode(otp, os);
        return new HomePage(driver);
    }
}
