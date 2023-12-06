package inji.pages;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;

import org.openqa.selenium.WebElement;

public class EsignetLoginPage extends BasePage{
    
    @AndroidFindBy(xpath = "//*[contains(@text,'Login with OTP')]")
    private WebElement esignetLoginButton;
    
    @AndroidFindBy(xpath = "//*[contains(@text,'Login with e-Signet')]")
    private WebElement esignetLoginHeader;
    
    @AndroidFindBy(xpath = "//*[contains(@text,'Enter Your VID')]")
    private WebElement enterYourVidTextHeader;
    
    @AndroidFindBy(xpath = "//android.widget.EditText[@resource-id=\"Otp_mosip-vid\"]")
    private WebElement enterIdTextBox;
    
    @AndroidFindBy(xpath = "//android.widget.Button[@resource-id=\"get_otp\"]")
    private WebElement getOtpButton;
    
    @AndroidFindBy(xpath = "//android.widget.Button[@resource-id=\"verify_otp\"]")
    private WebElement verifyButton;
    
    @AndroidFindBy(xpath = "//*[contains(@text,'OTP has been sent to your registered Mobile Number')]")
    private WebElement otpSendMessage;
    
    @AndroidFindBy(className = "android.view.ViewGroup")
    private WebElement redirectingPage;
    
    @AndroidFindBy(accessibility = "progressingLogo")
    private WebElement progressingLogo;
    
    @AndroidFindBy(accessibility = "loaderTitle")
    private WebElement loadingPageHeader;
    
    @AndroidFindBy(accessibility = "loaderSubTitle")
    private WebElement settingUpTextOrDownloadingCredentials;
    
    public EsignetLoginPage(AppiumDriver driver) {
        super(driver);
    }
    
    public boolean isLoadingPageTextLoaded() {
        return this.isElementDisplayed(loadingPageHeader, "Loading...");
    }
    
    public boolean isSettingUpTextDisplayed() {
        return this.isElementDisplayed(settingUpTextOrDownloadingCredentials, "Setting up");
    }
    
    public boolean isDownloadingCredentialsTextDisplayed() {
        return this.isElementDisplayed(settingUpTextOrDownloadingCredentials, "Downloading Credentials");
    }
    
    public boolean isOtpHasSendMessageDisplayed() {
        return this.isElementDisplayed(otpSendMessage, "OTP has been sent to your registered Mobile Number");
    }
    
    public boolean isEsignetLoginPageDisplayed() {
        return this.isElementDisplayed(esignetLoginHeader, "Login with e-Signet");
    }
    
    public EsignetLoginPage clickOnEsignetLoginWithOtpButton(){
        clickOnElement(esignetLoginButton);
        return this;
    }
    
    public OtpVerificationPage setEnterIdTextBox(String uinOrVid) {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        sendKeysToTextBox(enterIdTextBox, uinOrVid, "uin or vid textbox");
        return new OtpVerificationPage(driver);
    }
    
    public boolean isEnterYourVidTextDisplayed() {
        return this.isElementDisplayed(enterYourVidTextHeader, "Enter Your VID");
    }
    
    public boolean isProgressingLogoDisplayed() {
    	return redirectingPage.isDisplayed();
    }
    
    public EsignetLoginPage clickOnGetOtpButton(){
        clickOnElement(getOtpButton);
        return this;
    }
    
    public EsignetLoginPage clickOnVerifyButton(){
        clickOnElement(verifyButton);
        return this;
    }
    
}
