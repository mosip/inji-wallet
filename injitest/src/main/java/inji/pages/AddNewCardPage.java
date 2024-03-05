package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class AddNewCardPage extends BasePage{

    @AndroidFindBy(accessibility = "title")
    @iOSXCUITFindBy(accessibility = "title")
    private WebElement addNewCardHeader;

    @AndroidFindBy(accessibility = "issuerHeading-Mosip")
    @iOSXCUITFindBy(accessibility = "issuerHeading-Mosip")
    private WebElement downloadViaUin;
    
    @AndroidFindBy(accessibility = "goBack")
    @iOSXCUITFindBy(accessibility = "goBack")
    private WebElement backButton;
    
    @AndroidFindBy(accessibility = "issuer-ESignet")
    @iOSXCUITFindBy(accessibility = "issuer-ESignet")
    private WebElement downloadViaEsignet;

    @iOSXCUITFindBy(accessibility = "Continue")
    private WebElement continueButton;

    @iOSXCUITFindBy(accessibility = "Cancel")
    private WebElement cancelButton;

    @AndroidFindBy(accessibility = "issuersScreenDescription")
    @iOSXCUITFindBy(accessibility = "issuersScreenDescription")
    private WebElement addNewCardGuideMessage;
    
    @AndroidFindBy(accessibility = "issuerDescription-Mosip")
    @iOSXCUITFindBy(accessibility = "issuerDescription-Mosip")
    private WebElement issuerDescriptionMosip;
    
    @AndroidFindBy(accessibility = "issuerDescription-ESignet")
    @iOSXCUITFindBy(accessibility = "issuerDescription-ESignet")
    private WebElement issuerDescriptionEsignet;
    
    @AndroidFindBy(className = "android.widget.EditText")
    @iOSXCUITFindBy(accessibility = "issuerSearchBar")
    private WebElement issuerSearchBar;

    @AndroidFindBy(accessibility = "issuerHeading-Sunbird")
    @iOSXCUITFindBy(accessibility = "issuerHeading-Sunbird")
    private WebElement downloadViaSunbird;
    
    public AddNewCardPage(AppiumDriver driver) {
        super(driver);
    }
    
    public String  verifyLanguageForAddNewCardGuideMessage(){
    	 return getTextFromLocator(addNewCardGuideMessage);
    }
    
    public boolean isAddNewCardPageGuideMessageForEsignetDisplayed() {
        return this.isElementDisplayed(addNewCardGuideMessage);
    }
    
    public boolean isAddNewCardPageLoaded() {
        return this.isElementDisplayed(addNewCardHeader);
    }

    public RetrieveIdPage clickOnDownloadViaUin(){
        clickOnElement(downloadViaUin);
        return new RetrieveIdPage(driver);
    }
    
    public void clickOnBack() {
    	clickOnElement(backButton);
    }
    
    public boolean isAddNewCardGuideMessageDisplayed() {
        return this.isElementDisplayed(addNewCardGuideMessage);
    }
    
    public boolean isDownloadViaUinDisplayed() {
        return this.isElementDisplayed(downloadViaUin);
    }
    
    public boolean isDownloadViaUinDisplayedInHindi() {
        return this.isElementDisplayed(downloadViaUin);
    }
    
    public boolean isDownloadViaEsignetDisplayed() {
        return this.isElementDisplayed(downloadViaEsignet);
    }
    
    public boolean isDownloadViaEsignetDisplayedInHindi() {
        return this.isElementDisplayed(downloadViaEsignet);
    }
    
    public boolean isDownloadViaEsignetDisplayedinFillpino() {
        return this.isElementDisplayed(downloadViaEsignet);
    }
    
    public EsignetLoginPage clickOnDownloadViaEsignet(){
        clickOnElement(downloadViaEsignet);
        return new EsignetLoginPage(driver);
    }

    public void clickOnContinueButtonInSigninPopupIos(){
        clickOnElement(continueButton);
    }

    public void clickOnCancelButtonInSigninPopupIos(){
        clickOnElement(cancelButton);
    }
    
    public void isBackButtonDisplayed() {
        backButton.isDisplayed();
    }
    
    public boolean isAddNewCardGuideMessageDisplayedInFillopin() {
        return this.isElementDisplayed(addNewCardGuideMessage);
    }
    
    public boolean isAddNewCardGuideMessageDisplayedInHindi() {
        return this.isElementDisplayed(addNewCardGuideMessage);
    }
    public boolean isIssuerDescriptionMosipDisplayed() {
        return this.isElementDisplayed(issuerDescriptionMosip);
    }
    
    public boolean isIssuerDescriptionEsignetDisplayed() {
        return this.isElementDisplayed(issuerDescriptionEsignet);
    }
    
    public boolean isIssuerSearchBarDisplayed() {
    	return this.isElementDisplayed(issuerSearchBar);
    }
    
    public boolean isIssuerSearchBarDisplayedInFilipino() {
    	return this.isElementDisplayed(issuerSearchBar);
    }
    
    public boolean isIssuerSearchBarDisplayedInHindi() {
    	return this.isElementDisplayed(issuerSearchBar);
    }
    
    public void sendTextInIssuerSearchBar(String text) {
    	clearTextBoxAndSendKeys(issuerSearchBar, text);
    }

    public boolean isDownloadViaSunbirdDisplayed() {
        return this.isElementDisplayed(downloadViaSunbird);
    }
    public SunbirdLoginPage clickOnDownloadViaSunbird(){
        clickOnElement(downloadViaSunbird);
        return new SunbirdLoginPage(driver);
    }
}

