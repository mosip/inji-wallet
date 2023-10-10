package io.mosip.test.mob.inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public class HomePage extends BasePage {
    @AndroidFindBy(xpath = "//*[contains(@text,'Download Card')]")
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

    @AndroidFindBy(xpath = "//*[contains(@text,'OK, I')]")
    private WebElement riskItButton;

    @AndroidFindBy(accessibility = "pinIcon")
    private WebElement pinIcon;


    public HomePage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isHomePageLoaded() {
        if (isElementDisplayed(secureKeyStoragePopup, "secure key storage popup")) {
            clickOnElement(riskItButton);
        }
        return this.isElementDisplayed(homeButton, "Home page");
    }

    public RetrieveIdPage downloadCard() {
        this.clickOnElement(downloadCardButton);
        return new RetrieveIdPage(driver);
    }

    public boolean isNameDisplayed(String name) {
        By fullName = By.xpath("//*[contains(@name,'" + name + "') or contains(@text,'" + name + "')]");
        return this.isElementDisplayed(fullName, 60, "Name on downloaded card");
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
        Thread.sleep(1000);
        clickOnElement(moreOptionsButton);
        return new MoreOptionsPage(driver);
    }

    public boolean isPinIconDisplayed() {
        return this.isElementDisplayed(pinIcon, "pin icon");
    }

}
