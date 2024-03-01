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

    @AndroidFindBy(accessibility = "help")
    @iOSXCUITFindBy(accessibility = "help")
    private WebElement helpButton;

    @AndroidFindBy(accessibility = "history")
    @iOSXCUITFindBy(accessibility = "history")
    private WebElement historyButton;

    @iOSXCUITFindBy(accessibility = "ellipsis")
    @AndroidFindBy(accessibility = "ellipsis")
    private WebElement moreOptionsButton;

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

    @AndroidFindBy(accessibility = "errorTitle")
    @iOSXCUITFindBy(accessibility = "errorTitle")
    private WebElement noInternetConnection;

    @AndroidFindBy(accessibility = "share")
    @iOSXCUITFindBy(accessibility = "share")
    private WebElement shareButton;
    
    @AndroidFindBy(uiAutomator = "new UiSelector().className(\"android.widget.TextView\").instance(6);")// fix with accecibility
    @iOSXCUITFindBy(accessibility = "share")
    private WebElement shareButtonByForText;

    @AndroidFindBy(accessibility = "nationalCard")
    @iOSXCUITFindBy(accessibility = "nationalCard")
    private WebElement idTypeValue;
    
    @AndroidFindBy(accessibility = "tryAgain")
    @iOSXCUITFindBy(accessibility = "errorTitle")
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
        return this.isElementDisplayed(fullName, 120);
    }

    public boolean isSecondNameDisplayed(String name) {
        By fullName = By.xpath("(//*[contains(@value,'" + name + "') or contains(@text,'" + name + "')])[2]");
        return this.isElementDisplayed(fullName, 60);

    }

    public DetailedVcViewPage openDetailedVcView(String name) {
        By fullName = By.xpath("//*[contains(@value,'" + name + "') or contains(@text,'" + name + "')]");
        clickOnElement(fullNameTitle);
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

    public boolean isTryAgainButtonNotDisplayed() {
        return this.isElementInvisibleYet(tryAgainButton);
    }

    public void clickOnTryAgainButton() {
        clickOnElement(tryAgainButton);
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

    public void clickOnFirstVcsEllipsisButton() {
        clickOnElement(moreOptionsforFirstVc);
    }

    public void clickOnSecondVcsEllipsisButton() {
        clickOnElement(moreOptionsforSecondVc);
    }

    public boolean isActivatedVcPopupTextDisplayed() {
        return this.isElementDisplayed(activatedVcPopupText);
    }

    public void clickPopupCloseButtonButton() {
        clickOnElement(popupCloseButton);
    }

}
