package io.mosip.test.mob.inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class MoreOptionsPage extends BasePage {

    @AndroidFindBy(accessibility = "removeFromWallet")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`name == \"listItemTitle\"`][4]")
    private WebElement removeFromWalletButton;

    @AndroidFindBy(accessibility = "kebabTitle")
    @iOSXCUITFindBy(accessibility = "More Options")
    private WebElement moreOptionsText;

    @AndroidFindBy(accessibility = "pinOrUnPinCard")
    private WebElement pinOrUnPinCardButton;

    @AndroidFindBy(accessibility = "pendingActivationOrActivated")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`label == \"Activation pending for online login!\"`]")
    private WebElement activationPending;

    @AndroidFindBy(accessibility = "profileAuthenticated")
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
