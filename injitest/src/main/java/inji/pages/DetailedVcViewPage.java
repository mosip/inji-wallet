package inji.pages;

import inji.utils.IosUtil;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public class DetailedVcViewPage extends BasePage {
    @AndroidFindBy(xpath = "//*[contains(@text,'ID Details')]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`label == \"ID Details\"`]")
    private WebElement detailedVcViewPageTitle;

    @AndroidFindBy(accessibility = "fullNameValue")
    @iOSXCUITFindBy(accessibility = "fullNameValue")
    private WebElement fullNameValue;

    @AndroidFindBy(accessibility = "genderValue")
    @iOSXCUITFindBy(accessibility = "genderValue")
    private WebElement genderValue;

    @AndroidFindBy(accessibility = "dateOfBirthValue")
    @iOSXCUITFindBy(accessibility = "dateOfBirthValue")
    private WebElement dateOfBirthValue;

    @AndroidFindBy(accessibility = "nationalCard")
    @iOSXCUITFindBy(accessibility = "nationalCard")
    private WebElement idTypeValue;

    @AndroidFindBy(accessibility = "valid")
    @iOSXCUITFindBy(accessibility = "valid")
    private WebElement statusValue;

    @AndroidFindBy(accessibility = "uinNumber")
    @iOSXCUITFindBy(accessibility = "uinNumber")
    private WebElement uinNumberValue;

    @AndroidFindBy(accessibility = "generatedOnValue")
    @iOSXCUITFindBy(accessibility = "generatedOnValue")
    private WebElement generatedOnValue;

    @AndroidFindBy(accessibility = "phoneNumberValue")
    @iOSXCUITFindBy(accessibility = "phoneNumberValue")
    private WebElement phoneNumberValue;

    @AndroidFindBy(accessibility = "emailIdValue")
    @iOSXCUITFindBy(accessibility = "emailIdValue")
    private WebElement emailIdValue;

    @AndroidFindBy(accessibility = "enableVerification")
    @iOSXCUITFindBy(accessibility = "enableVerification")
    private WebElement activateButton;

    @AndroidFindBy(accessibility = "profileAuthenticated")
    @iOSXCUITFindBy(accessibility = "profileAuthenticated")
    private WebElement profileAuthenticated;

    @AndroidFindBy(accessibility = "close")
    @iOSXCUITFindBy(accessibility = "close")
    private WebElement crossIcon;

    @AndroidFindBy(uiAutomator = "new UiSelector().resourceId(\"iconIcon\")")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeOther[`label == \"\uE5CD\"`][3]")
    private WebElement qrCloseIcon;

    @AndroidFindBy(xpath = "//android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/android.view.ViewGroup/android.view.ViewGroup")
    @iOSXCUITFindBy(xpath = "(//XCUIElementTypeOther[contains(@name, \"Full Name\")]/XCUIElementTypeOther[1]/XCUIElementTypeOther[2])[3]")
    private WebElement detailedVcViewPageQr;

    @AndroidFindBy(accessibility = "qrCodeHeader")
    @iOSXCUITFindBy(accessibility = "qrCodeHeader")
    private WebElement qrCodeHeader;

    @AndroidFindBy(accessibility = "credentialRegistry")
    @iOSXCUITFindBy(accessibility = "credentialRegistry")
    private WebElement credentialRegistryText;

    @AndroidFindBy(accessibility = "credentialRegistryValue")
    @iOSXCUITFindBy(accessibility = "credentialRegistryValue")
    private WebElement credentialRegistryValue;

    @AndroidFindBy(accessibility = "esignet-logo")
    @iOSXCUITFindBy(xpath = "(//XCUIElementTypeImage)[3]")
    private WebElement esignetLogo;

    public DetailedVcViewPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isDetailedVcViewPageLoaded() {
        return this.isElementDisplayed(detailedVcViewPageTitle, "detailed Vc view page title page");
    }

    public String getNameInDetailedVcView() {
        return getTextFromLocator(fullNameValue);
    }

    public String getGenderInDetailedVcView() {
        return getTextFromLocator(genderValue);
    }

    public String getDateOfBirthInDetailedVcView() {
        return getTextFromLocator(dateOfBirthValue);
    }

    public String getIdTypeValueInDetailedVcView() {
        return getTextFromLocator(idTypeValue);
    }

    public String getStatusInDetailedVcView() {
        return getTextFromLocator(statusValue);
    }

    public String getUinInDetailedVcView() {
        return getTextFromLocator(uinNumberValue);
    }

    public String getGeneratedOnValueInDetailedVcView() {
        return getTextFromLocator(generatedOnValue);
    }

    public String getPhoneInDetailedVcView() {
        return getTextFromLocator(phoneNumberValue);
    }

    public String getEmailInDetailedVcView() {
        return getTextFromLocator(emailIdValue);
    }

    public boolean isActivateButtonDisplayed() {
        return this.isElementDisplayed(activateButton, "activate button");
    }

    public PleaseConfirmPopupPage clickOnActivateButton() {
        clickOnElement(activateButton);
        return new PleaseConfirmPopupPage(driver);
    }

    public boolean isProfileAuthenticatedDisplayed() {
        return this.isElementDisplayed(profileAuthenticated, "Credentials are enabled for online authentication");
    }

    public HomePage clickOnCrossIcon() {
        clickOnElement(crossIcon);
        return new HomePage(driver);
    }

    public HomePage clickOnQrCrossIcon() {
        clickOnElement(qrCloseIcon);
        return new HomePage(driver);
    }

    public PleaseConfirmPopupPage clickOnQrCodeButton() {
        clickOnElement(detailedVcViewPageQr);
        return new PleaseConfirmPopupPage(driver);
    }

    public boolean isQrCodeDisplayed() {
        return qrCodeHeader.isDisplayed();
    }

    public boolean isCredentialRegistryTextDisplayed() {
        return this.isElementDisplayed(credentialRegistryText, "credentialRegistry");
    }

    public String getCredentialRegistryValue() {
        return getTextFromLocator(credentialRegistryValue);
    }

    public boolean isEsignetLogoDisplayed() {
        return esignetLogo.isDisplayed();
    }
}