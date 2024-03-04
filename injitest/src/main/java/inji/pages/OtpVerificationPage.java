package inji.pages;

import inji.constants.Target;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.HidesKeyboard;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class OtpVerificationPage extends BasePage {

    @AndroidFindBy(accessibility = "otpVerificationHeader")
    @iOSXCUITFindBy(accessibility = "otpVerificationHeader")
    private WebElement otpVerificationText;

    @AndroidFindBy(accessibility = "otpVerificationError")
    @iOSXCUITFindBy(accessibility = "otpVerificationError")
    private WebElement invalidOtpMessage;

    @AndroidFindBy(accessibility = "walletBindingErrorTitle")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`label == \"Something is wrong. Please try again later!\"`]")
    private WebElement invalidOtpMessageInVcActivation;

    @AndroidFindBy(xpath = "cancel")
    @iOSXCUITFindBy(accessibility = "cancel")
    private WebElement cancelButton;

    @AndroidFindBy(accessibility = "close")
    @iOSXCUITFindBy(accessibility = "close")
    private WebElement crossIcon;

    @AndroidFindBy(accessibility = "cancel")
    @iOSXCUITFindBy(accessibility = "cancel")
    private WebElement cancelPopupButton;

    @AndroidFindBy(accessibility = "otpVerificationTimer")
    @iOSXCUITFindBy(accessibility = "otpVerificationTimer")
    private WebElement otpVerificationTimer;

    @AndroidFindBy(accessibility = "confirmationPopupHeader")
    @iOSXCUITFindBy(accessibility = "confirmationPopupHeader")
    private WebElement confirmationPopupHeader;

    @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"VID not available in database\")")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`label == \"VID not available in database\"`]")
    private WebElement vidNotAvailableMessage;

    @AndroidFindBy(xpath = "//android.view.ViewGroup[@resource-id=\"resendCodeView\"]") //Not using accessibility id as parent component has correct element property
    @iOSXCUITFindBy(accessibility = "resendCode")
    private WebElement resendCodeButton;

    @AndroidFindBy(accessibility = "wait")
    @iOSXCUITFindBy(accessibility = "wait")
    private WebElement waitPopupButton;


    public OtpVerificationPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isOtpVerificationPageLoaded() {
        return this.isElementDisplayed(otpVerificationText);
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
        return this.isElementDisplayed(invalidOtpMessage);
    }

    public boolean somethingWetWrongInVcActivationDisplayed() {
        return this.isElementDisplayed(invalidOtpMessageInVcActivation);
    }

    public boolean isCancelButtonDisplayed() {
        return this.isElementDisplayed(cancelButton);
    }

    public MoreOptionsPage clickOnCancelButton() {
        clickOnElement(cancelButton);
        return new MoreOptionsPage(driver);
    }

    public void clickOnCrossIcon() {
        clickOnElement(crossIcon);
    }

    public void clickOnCancelPopupButton() {
        clickOnElement(cancelPopupButton);
    }

    public boolean vidNotAvailableDisplayed() {
        return this.isElementDisplayed(vidNotAvailableMessage);
    }

    public boolean verifyResendCodeButtonDisplayedEnabled() {
        return this.isElementEnabled(resendCodeButton,30);
    }
    
    public void clickOnResendButton() {
        ((HidesKeyboard) driver).hideKeyboard();
        clickIfVisible(waitPopupButton);
        retrieClickOnElemet(resendCodeButton);
    }

    public boolean confirmPopupHeaderDisplayed() {
        return this.isElementDisplayed(confirmationPopupHeader);
    }

    public boolean verifyOtpVerificationTimerCompleted() {
        return this.WaitTillElementVisible(otpVerificationTimer, 186);
    }
    
    public boolean verifyOtpVerificationTimerDisplayedAfterClickOnResend() {
        return this.isElementDisplayed(otpVerificationTimer);

    }
}
