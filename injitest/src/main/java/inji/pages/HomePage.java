package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebElement;

import com.google.common.collect.ImmutableMap;

public class HomePage extends BasePage {
    @AndroidFindBy(accessibility = "plusIcon")
    @iOSXCUITFindBy(accessibility = "downloadCardButton")
    private WebElement downloadCardButton;

    @AndroidFindBy(accessibility = "home")
    @iOSXCUITFindBy(accessibility = "home")
    private WebElement homeButton;

    @AndroidFindBy(accessibility = "settings")
    @iOSXCUITFindBy(accessibility = "settings")
    private WebElement settingButton;

    @AndroidFindBy(accessibility = "helpText")
    @iOSXCUITFindBy(accessibility = "helpText")
    private WebElement helpButton;

    @AndroidFindBy(accessibility = "history")
    @iOSXCUITFindBy(accessibility = "history")
    private WebElement historyButton;

    @iOSXCUITFindBy(accessibility = "ellipsis")
    @AndroidFindBy(accessibility = "ellipsis")
    private WebElement moreOptionsButton;

    @iOSXCUITFindBy(xpath = "(//XCUIElementTypeOther[@name=\"ellipsis\"])[2]")
    @AndroidFindBy(xpath = "(//android.view.ViewGroup[@content-desc=\"ellipsis\"])[2]")
    private WebElement moreOptionsButtonForSecondVc;

    @iOSXCUITFindBy(xpath = "(//XCUIElementTypeOther[@name=\"ellipsis\"])[1]")
    @AndroidFindBy(xpath = "(//android.view.ViewGroup[@content-desc=\"ellipsis\"])[1]")
    private WebElement moreOptionsButtonForFirstVc;

    @AndroidFindBy(xpath = "//*[contains(@text,'Secure Key Storage not found')]")
    private WebElement secureKeyStoragePopup;

    @AndroidFindBy(xpath = "//*[contains(@text,'Some security features will be unavailable')]")
    private WebElement securityFeatureUnavailablePopup;

    @AndroidFindBy(xpath = "//*[contains(@text,'OK, I')]")
    private WebElement riskItButton;

    @AndroidFindBy(xpath = "//*[contains(@text,'Ok')]")
    private WebElement okButton;

    @AndroidFindBy(accessibility = "pinIcon")
    @iOSXCUITFindBy(accessibility = "pinIcon")
    private WebElement pinIcon;

    @AndroidFindBy(accessibility = "bringYourDigitalID")
    @iOSXCUITFindBy(accessibility = "bringYourDigitalID")
    private WebElement bringYourDigitalIdentity;

    @AndroidFindBy(accessibility = "noInternetConnectionErrorTitle")
    @iOSXCUITFindBy(accessibility = "noInternetConnectionErrorTitle")
    private WebElement noInternetConnection;

    @AndroidFindBy(accessibility = "share")
    @iOSXCUITFindBy(accessibility = "share")
    private WebElement shareButton;

    @AndroidFindBy(uiAutomator = "new UiSelector().className(\"android.widget.TextView\").instance(5)")// fix with accecibility
    @iOSXCUITFindBy(accessibility = "share")
    private WebElement shareButtonByForText;

    @AndroidFindBy(accessibility = "idTypeValue")
    @iOSXCUITFindBy(accessibility = "idTypeValue")
    private WebElement idTypeValue;
    
    @AndroidFindBy(xpath = "//android.widget.TextView[@text=\"Try again\"]")
    @iOSXCUITFindBy(accessibility = "tryAgain")
    private WebElement tryAgainButton;

    @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Subukan muli\")")
    private WebElement tryAgainButtonInFillpino;
    
    @AndroidFindBy(accessibility = "downloadingVcPopupText")
    @iOSXCUITFindBy(accessibility = "Downloading your card, this can take upto 5 minutes")
    private WebElement downloadingVcPopup;

    @AndroidFindBy(accessibility = "fullNameValue")
    @iOSXCUITFindBy(accessibility = "fullNameValue")
    private WebElement fullNameValue;

    @AndroidFindBy(accessibility = "activationPending")
    @iOSXCUITFindBy(accessibility = "activationPending")
    private WebElement activationPending;

    @AndroidFindBy(accessibility = "offlineAuthDisabledHeader")
    @iOSXCUITFindBy(accessibility = "offlineAuthDisabledHeader")
    private WebElement offlineAuthDisabledHeader;

    @AndroidFindBy(xpath = "(//android.view.ViewGroup[@content-desc=\"ellipsis\"])[1]")
    private WebElement moreOptionsforFirstVc;

    @AndroidFindBy(xpath = "(//android.view.ViewGroup[@content-desc=\"ellipsis\"])[2]")
    private WebElement moreOptionsforSecondVc;

    @AndroidFindBy(accessibility = "close")
    @iOSXCUITFindBy(accessibility = "close")
    private WebElement popupCloseButton;

    @AndroidFindBy(accessibility = "activatedVcPopupText")
    @iOSXCUITFindBy(accessibility = "activatedVcPopupText")
    private WebElement activatedVcPopupText;

    @AndroidFindBy(accessibility = "fullNameTitle")
    @iOSXCUITFindBy(accessibility = "fullNameTitle")
    private WebElement fullNameTitle;

    @AndroidFindBy(xpath = "//android.widget.EditText[@resource-id=\"issuerSearchBar\"]")
    @iOSXCUITFindBy(accessibility = "issuerSearchBar")
    private WebElement issuerSearchBar;

    @AndroidFindBy(xpath = "//*[@text=\"2 card\"]")
    @iOSXCUITFindBy(xpath = "//*[@name=\"2 cards\"]")
    private WebElement visibleCard;

    @AndroidFindBy(xpath = "//*[@text=\"2 card\"]")
    @iOSXCUITFindBy(xpath = "//*[@name=\"1 card\"]")
    private WebElement visibleCardOne;


    @AndroidFindBy(xpath = "//*[@text=\"No Cards Found!\"]")
    @iOSXCUITFindBy(accessibility = "No Cards Found!")
    private WebElement noCardFound;

    @iOSXCUITFindBy(accessibility = "Return")
    private WebElement ReturnButton;

    @AndroidFindBy(accessibility = "wallet-unactivated-icon")
    @iOSXCUITFindBy(accessibility = "wallet-unactivated-icon")
    private WebElement walletUnactivatedIcon;

    @AndroidFindBy(accessibility = "verificationStatus")
    @iOSXCUITFindBy(accessibility = "verificationStatus")
    private WebElement verificationStatus;


    public HomePage(AppiumDriver driver) {
        super(driver);
    }

    BasePage basePage = new BasePage(driver);
    public boolean isHomePageLoaded() {
        /*if (isElementDisplayed(secureKeyStoragePopup, "secure key storage popup")) {
            clickOnElement(riskItButton);
        }*/
//        if (isElementDisplayed(securityFeatureUnavailablePopup, "security features will be unavailable popup")) {
//            clickOnElement(okButton);
//        }
        return this.isElementDisplayed(homeButton);
    }

    public AddNewCardPage downloadCard() {
        this.clickOnElement(downloadCardButton);
        return new AddNewCardPage(driver);
    }

    public boolean isNameDisplayed(String name) {
        By fullName = By.xpath("//*[contains(@value,'" + name + "') or contains(@text,'" + name + "')]");
        return this.isElementDisplayed(fullName, 220);
    }

    public boolean isSecondNameDisplayed(String name) {
        By fullName = By.xpath("(//*[contains(@value,'" + name + "') or contains(@text,'" + name + "')])[2]");
        return this.isElementDisplayed(fullName, 150);

    }

    public DetailedVcViewPage openDetailedVcView(String name) {
        By fullName = By.xpath("//*[contains(@value,'" + name + "') or contains(@text,'" + name + "')]");
        clickOnElement(fullNameValue);
        return new DetailedVcViewPage(driver);
    }

    public SettingsPage clickOnSettingIcon() {
        clickOnElement(settingButton);
        return new SettingsPage(driver);
    }

    public HelpPage clickOnHelpIcon() {
        clickOnElement(helpButton);
        return new HelpPage(driver);
    }

    public HistoryPage clickOnHistoryButton() {
        clickOnElement(historyButton);
        return new HistoryPage(driver);
    }

    public MoreOptionsPage clickOnMoreOptionsButton() throws InterruptedException {
        Thread.sleep(2000);
        clickOnElement(moreOptionsButton);
        return new MoreOptionsPage(driver);
    }

    public boolean isPinIconDisplayed() {
        return this.isElementDisplayed(pinIcon);
    }
    
    public String  verifyLanguageForNoVCDownloadedPageLoaded(){
    	return getTextFromLocator(bringYourDigitalIdentity); 
    }

    public boolean  verifyLanguageForNoInternetConnectionDisplayed(String language){
    	String actualText = getTextFromLocator(noInternetConnection);

    	switch (language) {
    	case "English":
    		boolean isEnglishMatch  = (actualText.equalsIgnoreCase("No internet connection")==true) ? true : false;
    		return isEnglishMatch ;
    	case "Tamil":
    		boolean isTamilMatch  = (actualText.equalsIgnoreCase("இணைய இணைப்பு இல்லை")==true) ? true : false;
    		return isTamilMatch ;
    	case "Filipino":
    		boolean isFilipinoMatch  = (actualText.equalsIgnoreCase("Pakisuri ang iyong koneksyon at subukang muli")==true) ? true : false;
    		return isFilipinoMatch ;

    	}
    	return false;
    }

    public SharePage clickOnShareButton() {
        clickOnElement(shareButton);
        return new SharePage(driver);
    }
    
    public String getShareButton() {
    	return getTextFromLocator(shareButtonByForText);
    }

    public boolean isIdTypeDisplayed() {
        return this.isElementDisplayed(idTypeValue);
    }
    
    public boolean  verifyLanguageForTryAgainButtonDisplayed(String language){
    	String actualText = getTextFromLocator(tryAgainButton);

    	switch (language) {
    	case "English":
    		boolean isEnglishMatch  = (actualText.equalsIgnoreCase("Try again")==true) ? true : false;
    		return isEnglishMatch ;
    	case "Tamil":
    		boolean isTamilMatch  = (actualText.equalsIgnoreCase("மீண்டும் முயற்சி செய்")==true) ? true : false;
    		return isTamilMatch ;
    	case "Filipino":
    		boolean isFilipinoMatch  = (actualText.equalsIgnoreCase("Subukan muli")==true) ? true : false;
    		return isFilipinoMatch ;

    	}
    	return false;
    }

    public boolean isTryAgainButtonNotDisplayedInFlillpino() {
        return this.isElementInvisibleYet(tryAgainButtonInFillpino);
    }

    public boolean isTryAgainButtonDisplayedInFlillpino() {
        return this.isElementDisplayed(tryAgainButtonInFillpino);
    }

    public boolean isTryAgainButtonNotDisplayed() {
        return this.isElementInvisibleYet(tryAgainButton);
    }

    public void clickOnTryAgainButton() {
        clickOnElement(tryAgainButton);
    }

    public void clickOnTryAgainFillpinoButton() {
        clickOnElement(tryAgainButtonInFillpino);
    }

    public boolean isDownloadingVcPopupDisplayed() {
        return this.retrieIsElementVisible(downloadingVcPopup);
    }

    public String getfullNameTitleText() {
        return this.getTextFromLocator(fullNameTitle);
    }
    public String  getFullNameValue(){
        return getTextFromLocator(fullNameValue);
    }
    public String GetIdTypeText() {
        return this.getTextFromLocator(idTypeValue);
    }

    public String GetActivationPendingText() {
        return this.getTextFromLocator(activationPending);
    }

    public String GetActivationPendingHeaderText() {
        return this.getTextFromLocator(offlineAuthDisabledHeader);
    }

    public void clickOnFirstVcsEllipsisButton() {
        clickOnElement(moreOptionsforFirstVc);
    }

    public void clickOnSecondVcsEllipsisButton() {
        clickOnElement(moreOptionsforSecondVc);
    }

    public boolean isActivatedVcPopupTextDisplayed() {
        return this.retrieIsElementVisible(activatedVcPopupText);
    }

    public void clickPopupCloseButtonButton() {
        clickOnElement(popupCloseButton);
    }

    public void clickOnHomeButton() {
        clickOnElement(homeButton);
    }

    public void sendTextInIssuerSearchBar(String text) {
        clearTextBoxAndSendKeys(issuerSearchBar, text);
    }

    public boolean isIssuerSearchBarDisplayed() {
        return this.isElementDisplayed(issuerSearchBar);
    }

    public boolean isCardCountDisplayed() {
        return this.isElementDisplayed(visibleCard);
    }

    public boolean isCardCountAfterSearchDisplayed() {
        return this.isElementDisplayed(visibleCardOne);
    }

    public boolean isNoCardFoundTextDisplayed() {
        return this.isElementDisplayed(noCardFound);
    }

    public boolean isWalletUnactivatedIconDisplayed() {
        return this.isElementDisplayed(walletUnactivatedIcon);
    }

    public void clickOnSecondVcEllipsis() {
        clickOnElement(moreOptionsButtonForSecondVc);
    }

    public void clickOnFirstVcEllipsis() {
        clickOnElement(moreOptionsButtonForFirstVc);
    }

    public void clickOnReturnButton(){
        clickOnElement(ReturnButton);
    }

    public  String   getTextFromVerificationStatus(){
        return getTextFromLocator(verificationStatus);
    }

}
