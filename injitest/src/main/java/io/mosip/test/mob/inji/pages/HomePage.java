package io.mosip.test.mob.inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public class HomePage extends BasePage {
    @AndroidFindBy(uiAutomator = "new UiSelector().resourceId(\"downloadIcon\")")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`label == \"Download Card\"`]")
    private WebElement downloadCardButton;

    @AndroidFindBy(xpath = "//*[contains(@text,'Home')]")
    @iOSXCUITFindBy(accessibility = "Home, tab, 1 of 3")
    private WebElement homeButton;

    @AndroidFindBy(xpath = "//*[@resource-id=\"iconIcon\"]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeOther[`label == \"\uE09A\"`][6]")
    private WebElement settingButton;

    @AndroidFindBy(xpath = "(//*[@class=\"android.widget.ImageView\"])[2]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeOther[`label == \"\uE09A\"`][5]/XCUIElementTypeOther[1]")
    private WebElement helpButton;

    @AndroidFindBy(xpath = "//*[contains(@text,'History')]")
    @iOSXCUITFindBy(accessibility = "History, tab, 3 of 3")
    private WebElement historyButton;

    @iOSXCUITFindBy(iOSClassChain = "Need to update")
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
    private WebElement pinIcon;
    
    @AndroidFindBy(xpath = "//*[contains(@text,'Scan')]")
	 private WebElement scan;

    @AndroidFindBy(accessibility = "bringYourDigitalID")
    private WebElement bringYourDigitalIdentity;

    @AndroidFindBy(accessibility = "errorTitle")
    private WebElement noInternetConnection;

    @AndroidFindBy(xpath = "//*[contains(@text,'Scan')]")
    private WebElement scanButton;


    public HomePage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isHomePageLoaded() {
        /*if (isElementDisplayed(secureKeyStoragePopup, "secure key storage popup")) {
            clickOnElement(riskItButton);
        }*/
        if (isElementDisplayed(securityFeatureUnavailablePopup, "security features will be unavailable popup")) {
            clickOnElement(okButton);
        }
        return this.isElementDisplayed(homeButton, "Home page");
    }

    public AddNewCardPage downloadCard() {
        this.clickOnElement(downloadCardButton);
        return new AddNewCardPage(driver);
    }

    public boolean isNameDisplayed(String name) {
        By fullName = By.xpath("//*[contains(@name,'" + name + "') or contains(@text,'" + name + "')]");
        return this.isElementDisplayed(fullName, 60, "Name on downloaded card");
    }
    
    		public boolean isNameDisplayed1(String name) {
    	        By fullName = By.xpath("(//*[contains(@text,'" + name + "')])[2]");
    	        return this.isElementDisplayed(fullName, 60, "Name on downloaded card");
    	    }

    public DetailedVcViewPage openDetailedVcView(String name) {
        By fullName = By.xpath("//*[contains(@name,'" + name + "') or contains(@text,'" + name + "')]");
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
    
    public Scan clickOnScanButton() {
        this.clickOnElement(scan);
        return new Scan(driver);
    }

    public boolean isNoVCDownloaded() {
        return this.isElementDisplayed(bringYourDigitalIdentity, "Bring your digital identity");
    }

    public boolean isNoInternetConnectionDisplayed() {
        return this.isElementDisplayed(noInternetConnection, "No internet connection");
    }

    public ScanPage clickOnScanButton(){
        clickOnElement(scanButton);
        return new ScanPage(driver);
    }

}
