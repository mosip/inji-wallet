package inji.pages;

import inji.utils.IosUtil;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public class DetailedVcViewPage extends BasePage{
    @AndroidFindBy(accessibility = "idDetailsHeader")
    @iOSXCUITFindBy(accessibility = "idDetailsHeader")
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

    @AndroidFindBy(accessibility = "idTypeValue")
    @iOSXCUITFindBy(accessibility = "idTypeValue")
    private WebElement idTypeValue;

    @AndroidFindBy(accessibility = "verificationStatus")
    @iOSXCUITFindBy(accessibility = "verificationStatus")
    private WebElement statusValue;

    @AndroidFindBy(accessibility = "UINValue")
    @iOSXCUITFindBy(accessibility = "UINValue")
    private WebElement uinNumberValue;

    @AndroidFindBy(accessibility = "generatedOnValue")
    @iOSXCUITFindBy(accessibility = "generatedOnValue")
    private WebElement generatedOnValue;

    @AndroidFindBy(accessibility = "phoneValue")
    @iOSXCUITFindBy(accessibility = "phoneValue")
    private WebElement phoneNumberValue;

    @AndroidFindBy(accessibility = "emailValue")
    @iOSXCUITFindBy(accessibility = "emailValue")
    private WebElement emailIdValue;

    @AndroidFindBy(accessibility = "enableVerification")
    @iOSXCUITFindBy(accessibility = "enableVerification")
    private WebElement activateButton;
    
    @iOSXCUITFindBy(accessibility = "enableVerification")
    private WebElement activeButtonIos;
    
    @AndroidFindBy(accessibility = "profileAuthenticated")
    @iOSXCUITFindBy(accessibility = "profileAuthenticated")
    private WebElement profileAuthenticated;

    @AndroidFindBy(accessibility = "close")
    @iOSXCUITFindBy(accessibility = "close")
    private WebElement crossIcon;

    @AndroidFindBy(accessibility = "qrCodeCloseIcon")
    @iOSXCUITFindBy(accessibility = "qrCodeCloseIcon")
    private WebElement qrCloseIcon;

    @AndroidFindBy(accessibility = "qrCodePressable")
    @iOSXCUITFindBy(accessibility = "qrCodePressable")
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

    @AndroidFindBy(accessibility = "mosip-logo")
    @iOSXCUITFindBy(accessibility = "mosip-logo")
    private WebElement esignetLogo;
    
    @AndroidFindBy(accessibility = "goBack")
    @iOSXCUITFindBy(accessibility = "goBack")
    public WebElement backArrow;

    @AndroidFindBy(accessibility = "KebabIcon")
    @iOSXCUITFindBy(accessibility = "KebabIcon")
    public WebElement moreOptionsButton;


    public DetailedVcViewPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isDetailedVcViewPageLoaded() {
        return this.isElementDisplayed(detailedVcViewPageTitle);
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
        return this.isElementDisplayed(activateButton);
    }

    public PleaseConfirmPopupPage clickOnActivateButtonAndroid(){
        IosUtil.scrollToElement(driver,58,712,160,129);
        clickOnElement(activateButton);
        return new PleaseConfirmPopupPage(driver);
    }
    
    public PleaseConfirmPopupPage clickOnActivateButtonIos(){
        IosUtil.scrollToElement(driver,58,712,160,129);
        clickOnElement(activeButtonIos);
        return new PleaseConfirmPopupPage(driver);
    }

    public boolean isProfileAuthenticatedDisplayed() {
        return this.isElementDisplayed(profileAuthenticated);
    }

    public HomePage clickOnBackArrow() {
        clickOnElement(backArrow);
        return new HomePage(driver);
    }

    public HomePage clickOnQrCrossIcon() {
        if (isElementDisplayed(qrCloseIcon)){
        clickOnElement(qrCloseIcon);
        }
        return new HomePage(driver);
    }

    public HomePage clickOnCrossIcon() {
       if(isElementDisplayed(crossIcon)) {
            clickOnElement(crossIcon);
        }
        return new HomePage(driver);
    }

    public void clickOnQrCodeButton() {
        if(isElementDisplayed(detailedVcViewPageQr)) {
            clickOnElement(detailedVcViewPageQr);
        }
        new PleaseConfirmPopupPage(driver);
    }

    public boolean isQrCodeDisplayed() {
        return isElementDisplayed(qrCodeHeader);
    }

    public boolean isCredentialRegistryTextDisplayed() {
        return this.isElementDisplayed(credentialRegistryText);
    }

    public String getCredentialRegistryValue() {
        return getTextFromLocator(credentialRegistryValue);
    }

    public boolean isEsignetLogoDisplayed() {
        return isElementDisplayed(esignetLogo);
    }

    public void clickOnMoreOptionsInDetails() {
        if(retrieIsElementVisible(moreOptionsButton)) {
            clickOnElement(moreOptionsButton);
        }
    }

}