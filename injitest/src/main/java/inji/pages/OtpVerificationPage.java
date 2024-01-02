package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import inji.constants.Target;
import org.openqa.selenium.WebElement;

public class OtpVerificationPage extends BasePage {

    @AndroidFindBy(xpath = "//*[contains(@text,'OTP Verification')]")
    @iOSXCUITFindBy(accessibility = "otpVerificationHeader")
    private WebElement otpVerificationText;

    @AndroidFindBy(xpath = "//*[contains(@text,'OTP is invalid')]")
    @iOSXCUITFindBy(accessibility = "otpVerificationError")
    private WebElement invalidOtpMessage;

    @AndroidFindBy(xpath = "//*[contains(@text,'Something is wrong. Please try again later!')]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`label == \"Something is wrong. Please try again later!\"`]")
    private WebElement invalidOtpMessageInVcActivation;

    @AndroidFindBy(xpath = "//*[contains(@text,'Cancel')]")
    @iOSXCUITFindBy(accessibility = "cancel")
    private WebElement cancelButton;

    @AndroidFindBy(accessibility = "close")
    @iOSXCUITFindBy(accessibility = "close")
    private WebElement crossIcon;
    
    @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"VID not available in database\")")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`label == \"VID not available in database\"`]")
	  private WebElement vidNotAvailableMessage;

    public OtpVerificationPage(AppiumDriver driver) {
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
    
    public HomePage enterOtpForEsignet(String otp, Target os) {
        SetPasscode setPasscode = new SetPasscode(driver);
        setPasscode.enterPasscodeForEsignet(otp, os);
        return new HomePage(driver);
    }

    public boolean invalidOtpMessageDisplayed() {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        return this.isElementDisplayed(invalidOtpMessage, "OTP is invalid");
    }

    public boolean somethingWetWrongInVcActivationDisplayed() {
        return this.isElementDisplayed(invalidOtpMessageInVcActivation, "Something is wrong. Please try again later!");
    }

    public boolean isCancelButtonDisplayed() {
        return this.isElementDisplayed(cancelButton, "Cancel button");
    }

    public MoreOptionsPage clickOnCancelButton(){
        clickOnElement(cancelButton);
        return new MoreOptionsPage(driver);
    }
    public void clickOnCrossIcon(){
        clickOnElement(crossIcon);
    }
    
    public boolean vidNotAvailableDisplayed() {
        return this.isElementDisplayed(vidNotAvailableMessage, "VID not available in database");
    }
}
