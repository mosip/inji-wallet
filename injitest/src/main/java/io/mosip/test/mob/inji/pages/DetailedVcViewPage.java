package io.mosip.test.mob.inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public class DetailedVcViewPage extends BasePage{
    @AndroidFindBy(xpath = "//*[contains(@text,'ID Details')]")
    private WebElement detailedVcViewPageTitle;

    @AndroidFindBy(accessibility = "fullNameValue")
    private WebElement fullNameValue;

    @AndroidFindBy(accessibility = "genderValue")
    private WebElement genderValue;

    @AndroidFindBy(accessibility = "dateOfBirthValue")
    private WebElement dateOfBirthValue;

    @AndroidFindBy(accessibility = "nationalCard")
    private WebElement idTypeValue;

    @AndroidFindBy(accessibility = "valid")
    private WebElement statusValue;

    @AndroidFindBy(accessibility = "uinNumber")
    private WebElement uinNumberValue;

    @AndroidFindBy(accessibility = "generatedOnValue")
    private WebElement generatedOnValue;

    @AndroidFindBy(accessibility = "phoneNumberValue")
    private WebElement phoneNumberValue;

    @AndroidFindBy(accessibility = "emailIdValue")
    private WebElement emailIdValue;

    @AndroidFindBy(accessibility = "enableVerification")
    private WebElement activateButton;

    @AndroidFindBy(accessibility = "profileAuthenticated")
    private WebElement profileAuthenticated;

//    @AndroidFindBy(accessibility = "close")
//    private WebElement crossIcon;
//    
    @AndroidFindBy(xpath = "//*[@resource-id=\"iconIcon\"]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeOther[`label == \"\uE5CD\"`][2]")
    private WebElement crossIcon;
    
    @AndroidFindBy(xpath = "//android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/android.view.ViewGroup/android.view.ViewGroup")
    private WebElement detailedVcViewPageQr;
    
    @AndroidFindBy(accessibility = "qrCodeHeader")
    private WebElement qrCodeHeader;

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

    public PleaseConfirmPopupPage clickOnActivateButton(){
        clickOnElement(activateButton);
        return new PleaseConfirmPopupPage(driver);
    }

    public boolean isProfileAuthenticatedDisplayed() {
        return this.isElementDisplayed(profileAuthenticated, "Credentials are enabled for online authentication");
    }

    public HomePage clickOnCrossIcon(){
        clickOnElement(crossIcon);
        return new HomePage(driver);
    }
    
    public PleaseConfirmPopupPage clickOnQrCodeButton(){
        clickOnElement(detailedVcViewPageQr);
        return new PleaseConfirmPopupPage(driver);
    }
    
    public boolean isQRCodeDisplayed() {
    	return qrCodeHeader.isDisplayed();
    }
}
