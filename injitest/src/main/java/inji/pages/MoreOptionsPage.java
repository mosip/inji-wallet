package inji.pages;

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

    @AndroidFindBy(accessibility = "viewActivityLog")
    @iOSXCUITFindBy(accessibility = "viewActivityLog")
    private WebElement viewActivityLogButton;

    @AndroidFindBy(accessibility = "pinOrUnPinCard")
    @iOSXCUITFindBy(accessibility = "pinOrUnPinCard")
    private WebElement pinOrUnPinCardButton;

    @AndroidFindBy(accessibility = "pendingActivationOrActivated")
    @iOSXCUITFindBy(accessibility = "pendingActivationOrActivated")
    private WebElement activationPending;

    @AndroidFindBy(accessibility = "profileAuthenticated")
    @iOSXCUITFindBy(accessibility = "profileAuthenticated")
    private WebElement activatedForOnlineLoginButton;

    @AndroidFindBy(accessibility = "close")
    @iOSXCUITFindBy(accessibility = "close")
    private WebElement closeButton;

    @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Something is wrong. Please try again later!\")")
    @iOSXCUITFindBy(accessibility = "walletBindingErrorTitle")
    public WebElement somethingIsWrongPopup;

    @AndroidFindBy(accessibility = "activated")
    @iOSXCUITFindBy(accessibility = "activated")
    private WebElement activated;

    public MoreOptionsPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isMoreOptionsPageLoaded() {
        return this.isElementDisplayed(moreOptionsText);
    }

    public PleaseConfirmPopupPage clickOnRemoveFromWallet() {
        clickOnElement(removeFromWalletButton);
        return new PleaseConfirmPopupPage(driver);
    }

    public void clickOnPinOrUnPinCard() {
        clickOnElement(pinOrUnPinCardButton);
    }

    public HistoryPage clickOnViewActivityLog() {
        clickOnElement(viewActivityLogButton);
        return new HistoryPage(driver);
    }

    public PleaseConfirmPopupPage clickOnActivationPending() {
        clickOnElement(activationPending);
        return new PleaseConfirmPopupPage(driver);
    }

    public boolean isVcActivatedForOnlineLogin() {
        return this.isElementDisplayed(activatedForOnlineLoginButton);
    }

    public HomePage clickOnCloseButton() {
        clickOnElement(closeButton);
        return new HomePage(driver);
    }

    public boolean isSomethingIsWrongPopupVisible() {
        return this.isElementDisplayed(somethingIsWrongPopup);
    }

    public boolean isVcActivatedDisplayed() {
        return this.isElementDisplayed(activated);
    }
}
