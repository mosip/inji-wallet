package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.HidesKeyboard;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class EsignetLoginPage extends BasePage {


    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`label == \"“Inji” Wants to Use “mosip.net” to Sign In\"`]")
    private WebElement iosSignInPermissionPopup;

    @iOSXCUITFindBy(accessibility = "Continue")
    private WebElement iosContinueButton;

    @AndroidFindBy(xpath = "//*[contains(@text,'Login with OTP')]")
    @iOSXCUITFindBy(accessibility = "Login with OTP")
    private WebElement esignetLoginButton;

    @AndroidFindBy(xpath = "//*[contains(@text,'Login with e-Signet')]")
    @iOSXCUITFindBy(xpath = "//*[contains(@text,'Login with e-Signet')]")
    private WebElement esignetLoginHeader;

    @AndroidFindBy(xpath = "//*[contains(@text,'Enter Your VID')]")
    @iOSXCUITFindBy(xpath = "//*[contains(@text,'Enter Your VID')]")
    private WebElement enterYourVidTextHeader;

    @AndroidFindBy(uiAutomator = "UiSelector().className(\"android.widget.EditText\").instance(1)")
    @iOSXCUITFindBy(accessibility = "tooltips.vid_tooltip")
    private WebElement enterIdTextBox;

    @AndroidFindBy(xpath = "//android.widget.Button[@text=\"Get OTP\"]")
    @iOSXCUITFindBy(accessibility = "Get OTP")
    private WebElement getOtpButton;


    @AndroidFindBy(uiAutomator = "new UiSelector().className(\"android.widget.Button\").instance(1)")
    @iOSXCUITFindBy(accessibility = "Verify")
    private WebElement verifyButton;

    @AndroidFindBy(xpath = "//*[contains(@text,'OTP has been sent to your registered Mobile Number')]")
    @iOSXCUITFindBy(xpath = "//*[contains(@text,'OTP has been sent to your registered Mobile Number')]")
    private WebElement otpSendMessage;

    @AndroidFindBy(className = "android.view.ViewGroup")
    private WebElement redirectingPage;

    @AndroidFindBy(accessibility = "progressingLogo")
    private WebElement progressingLogo;

    @AndroidFindBy(accessibility = "loaderTitle")
    private WebElement loadingPageHeader;

    @iOSXCUITFindBy(accessibility = "Done")
    private WebElement DoneButton;

    @AndroidFindBy(accessibility = "loaderSubTitle")
    private WebElement settingUpTextOrDownloadingCredentials;

    public EsignetLoginPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isLoadingPageTextLoaded() {
        return this.isElementDisplayed(loadingPageHeader);
    }

    public boolean isSettingUpTextDisplayed() {
        return this.isElementDisplayed(settingUpTextOrDownloadingCredentials);
    }

    public boolean isDownloadingCredentialsTextDisplayed() {
        return this.isElementDisplayed(settingUpTextOrDownloadingCredentials);
    }

    public boolean isOtpHasSendMessageDisplayed() {
        return this.isElementDisplayed(otpSendMessage);
    }

    public boolean isEsignetLoginPageDisplayed() {
        return this.isElementDisplayed(esignetLoginHeader);
    }

    public void clickOnEsignetLoginWithOtpButton() {
        if(isElementDisplayed(esignetLoginButton)) {
            clickOnElement(esignetLoginButton);
        }
    }

    public OtpVerificationPage setEnterIdTextBox(String uinOrVid) {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        sendKeysToTextBox(enterIdTextBox, uinOrVid);
        return new OtpVerificationPage(driver);
    }

    public boolean isEnterYourVidTextDisplayed() {
        return this.isElementDisplayed(enterYourVidTextHeader);
    }

    public boolean isProgressingLogoDisplayed() {
        return redirectingPage.isDisplayed();
    }

    public void clickOnGetOtpButton() {
        clickOnElement(getOtpButton);
    }

    public void clickOnVerifyButton() {
    	((HidesKeyboard) driver).hideKeyboard();
        clickOnElement(verifyButton);
    }

    public void clickOnVerifyButtonIos() {
        clickOnElement(verifyButton);
    }

}
