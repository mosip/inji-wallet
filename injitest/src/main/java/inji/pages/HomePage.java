package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

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

    @AndroidFindBy(accessibility = "scan")
    @iOSXCUITFindBy(accessibility = "scan")
    private WebElement scanButton;

    @AndroidFindBy(accessibility = "nationalCard")
    @iOSXCUITFindBy(accessibility = "nationalCard")
    private WebElement idTypeValue;
    
    @AndroidFindBy(accessibility = "tryAgain")
    @iOSXCUITFindBy(accessibility = "errorTitle")
    private WebElement tryAgainButton;
    
    @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Subukan muli\")")
    private WebElement tryAgainButtonInFillpino;

    public HomePage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isHomePageLoaded() {
        /*if (isElementDisplayed(secureKeyStoragePopup, "secure key storage popup")) {
            clickOnElement(riskItButton);
        }*/
//        if (isElementDisplayed(securityFeatureUnavailablePopup, "security features will be unavailable popup")) {
//            clickOnElement(okButton);
//        }
        return this.isElementDisplayed(homeButton, "Home page");
    }

    public AddNewCardPage downloadCard() {
        this.clickOnElement(downloadCardButton);
        return new AddNewCardPage(driver);
    }

    public boolean isNameDisplayed(String name) {
        By fullName = By.xpath("//*[contains(@value,'" + name + "') or contains(@text,'" + name + "')]");
        return this.isElementDisplayed(fullName, 120, "Name on downloaded card");
    }
    
   public boolean isSecondNameDisplayed(String name) {
    	By fullName = By.xpath("(//*[contains(@value,'" + name + "') or contains(@text,'" + name + "')])[2]");
        return this.isElementDisplayed(fullName, 60, "Name on downloaded card");
    	
   }

    public DetailedVcViewPage openDetailedVcView(String name) {
        By fullName = By.xpath("//*[contains(@value,'" + name + "') or contains(@text,'" + name + "')]");
        clickOnElement(fullName);
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
        return this.isElementDisplayed(pinIcon, "pin icon");
    }
    
    public boolean isNoVCDownloaded() {
        return this.isElementDisplayed(bringYourDigitalIdentity, "Bring your digital identity");
    }
    
    public boolean isNoVCDownloadedInFilipino() {
        return this.isElementDisplayed(bringYourDigitalIdentity, "Dalhin ang Iyong Digital ID");
    }

    public boolean isNoInternetConnectionDisplayed() {
        return this.isElementDisplayed(noInternetConnection, "No internet connection");
    }
    
    public boolean isNoInternetConnectionDisplayedInTamil() {
        return this.isElementDisplayed(noInternetConnection, "இணைய இணைப்பு இல்லை");
    }
    public boolean isNoInternetConnectionDisplayedFlillpino() {
        return this.isElementDisplayed(noInternetConnection, "Pakisuri ang iyong koneksyon at subukang muli");
    }

    public ScanPage clickOnScanButton(){
        clickOnElement(scanButton);
        return new ScanPage(driver);
    }
    public boolean isIdTypeDisplayed() {
        return this.isElementDisplayed(idTypeValue, "Name on downloaded card");
    }
    
    public boolean isTryAgainButtonDisplayedInFlillpino() {
        return this.isElementDisplayed(tryAgainButtonInFillpino, "Subukan muli");
    }
    
    public boolean isTryAgainButtonDisplayedInTamil() {
        return this.isElementDisplayed(tryAgainButton, "மீண்டும் முயற்சி செய்");
    }
    
    public boolean isTryAgainButtonNotDisplayedInFlillpino() {
        return this.isElementInvisibleYet(tryAgainButtonInFillpino, "Subukan muli");
    }
    
    public boolean isTryAgainButtonDisplayed() {
        return this.isElementDisplayed(tryAgainButton, "Try again");
    }
    
    public boolean isTryAgainButtonNotDisplayed() {
        return this.isElementInvisibleYet(tryAgainButton, "Try again");
    }

    public HomePage clickOnTryAgainButton() {
    	 clickOnElement(tryAgainButton);
         return this;
    }
    
    public HomePage clickOnTryAgainButtonInFlillpino() {
   	 clickOnElement(tryAgainButtonInFillpino);
        return this;
   }
    
}
