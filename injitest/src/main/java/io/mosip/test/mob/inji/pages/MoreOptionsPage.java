package io.mosip.test.mob.inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class MoreOptionsPage extends BasePage {

    @AndroidFindBy(accessibility = "removeFromWallet")
    @iOSXCUITFindBy(accessibility = "removeFromWallet")
    private WebElement removeFromWalletButton;

    @AndroidFindBy(accessibility = "kebabTitle")
    @iOSXCUITFindBy(accessibility = "kebabTitle")
    private WebElement moreOptionsText;

    @AndroidFindBy(accessibility = "pinOrUnPinCard")
    @iOSXCUITFindBy(accessibility = "pinOrUnPinCard")
    private WebElement pinOrUnPinCardButton;

    @AndroidFindBy(accessibility = "pendingActivationOrActivated")
    @iOSXCUITFindBy(accessibility = "pendingActivationOrActivated")
    private WebElement activationPending;

    @AndroidFindBy(accessibility = "profileAuthenticated")
    @iOSXCUITFindBy(accessibility = "profileAuthenticated")
    private WebElement activatedForOnlineLoginButton;
    
    @AndroidFindBy(uiAutomator = "new UiSelector().resourceId(\"iconIcon\")")
    @iOSXCUITFindBy(iOSClassChain ="**/XCUIElementTypeOther[`label == \"\uE5CD\"`][1]")
    private WebElement closeButton;

    @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Something is wrong. Please try again later!\")")
    public WebElement somthingIsWrongPopup;

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
    
    public HomePage clickOnCloseButton() {
    	clickOnElement(closeButton);
    	return new HomePage(driver);
    }
    
    public boolean isSomthingIsWrongPopupVisible() {
        return this.isElementDisplayed(somthingIsWrongPopup, "Something is wrong. Please try again later!");
    }
}
