package io.mosip.test.mob.inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class MoreOptionsPage extends BasePage {

    @AndroidFindBy(xpath = "//*[contains(@text,'Remove from Wallet')]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`name == \"listItemTitle\"`][4]")
    private WebElement removeFromWalletButton;

    @AndroidFindBy(xpath = "//*[contains(@text,'More Options')]")
    @iOSXCUITFindBy(accessibility = "More Options")
    private WebElement moreOptionsText;

    @AndroidFindBy(xpath = "//*[contains(@text,'Pin Card')]")
    private WebElement pinOrUnPinCardButton;

    @AndroidFindBy(xpath = "//*[contains(@text,'Activation pending for online login!')]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`label == \"Activation pending for online login!\"`]")
    private WebElement activationPending;

    @AndroidFindBy(xpath = "//*[contains(@text,'Activated for online login!')]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeOther[`label == \"\uE8E8 Activated for online login!\"`][4]")
    private WebElement activatedForOnlineLoginButton;

    public MoreOptionsPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isMoreOptionsPageLoaded() {
        return this.isElementDisplayed(moreOptionsText, "More options page");
    }

    public PleaseConfirmPopupPage clickOnRemoveFromWallet() {
        clickOnElement(removeFromWalletButton);
        return new PleaseConfirmPopupPage(driver);
    }

    public void clickOnPinOrUnPinCard() {
        clickOnElement(pinOrUnPinCardButton);
    }

    public PleaseConfirmPopupPage clickOnActivationPending() {
        clickOnElement(activationPending);
        return new PleaseConfirmPopupPage(driver);
    }

    public boolean isVcActivatedForOnlineLogin() {
        return this.isElementDisplayed(activatedForOnlineLoginButton, "Activated for online login text");
    }
}
