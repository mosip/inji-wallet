package io.mosip.test.mob.inji.pages;

import io.mosip.test.mob.inji.constants.Target;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class OtpVerificationPage extends BasePage {

    @AndroidFindBy(xpath = "//*[contains(@text,'OTP Verification')]")
    @iOSXCUITFindBy(accessibility = "OTP Verification")
    private WebElement otpVerificationText;

    @AndroidFindBy(xpath = "//*[contains(@text,'OTP is invalid')]")
    private WebElement invalidOtpMessage;

    @AndroidFindBy(xpath = "//*[contains(@text,'Something is wrong. Please try again later!')]")
    private WebElement invalidOtpMessageInVcActivation;

    @AndroidFindBy(xpath = "//*[contains(@text,'Cancel')]")
    private WebElement cancelButton;
    
    @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"VID not available in database\")")
	  private WebElement VidNotAvailableMessage;

    @AndroidFindBy(accessibility = "close")
    private WebElement crossIcon;

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

    public boolean invalidOtpMessageDisplayed() {
        return this.isElementDisplayed(invalidOtpMessage, "OTP is invalid");
    }

    public boolean somethingWetWrongInVcActivationDisplayed() {
        return this.isElementDisplayed(invalidOtpMessageInVcActivation, "Something is wrong. Please try again later!");
    }
    
    public boolean VidNotAvailableDisplayed() {
        return this.isElementDisplayed(VidNotAvailableMessage, "VID not available in database");
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
}
