package io.mosip.test.mob.inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class SettingsPage extends BasePage {

    @AndroidFindBy(xpath = "//*[contains(@text,'Settings')]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`label == \"Settings\"`]")
    private WebElement settingsTittle;

    @AndroidFindBy(xpath = "//*[contains(@text,'Logout')]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`label == \"Logout\"`]")
    private WebElement logoutButton;

    @AndroidFindBy(xpath = "//*[contains(@text,'Language')]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeOther[`label == \"Language\"`]")
    private WebElement languageButton;

    @AndroidFindBy(xpath = "//*[contains(@text,'Filipino')]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`label == \"Filipino\"`]")
    private WebElement filipinoLanguageButton;

    @AndroidFindBy(xpath = "//*[contains(@text,'Wika')]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`label == \"Wika\"`]")
    private WebElement wikaButton;

    public SettingsPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isSettingPageLoaded() {
        return this.isElementDisplayed(settingsTittle, "Setting page");
    }

    public UnlockApplicationPage clickOnLogoutButton() {
        clickOnElement(logoutButton);
        return new UnlockApplicationPage(driver);
    }

    public SettingsPage clickOnLanguage() {
        clickOnElement(languageButton);
        return this;
    }

    public void clickOnFilipinoLanguage() {
        clickOnElement(filipinoLanguageButton);
    }

    public boolean verifyFilipinoLanguage() {
        return this.isElementDisplayed(wikaButton, "Filipino language");
    }

}
