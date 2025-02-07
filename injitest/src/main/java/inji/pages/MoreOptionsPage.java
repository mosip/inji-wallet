package inji.pages;

import inji.utils.IosUtil;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class MoreOptionsPage extends BasePage {

//    @AndroidFindBy(accessibility = "outlined-delete-icon")
//    @iOSXCUITFindBy(accessibility = "removeFromWallet")
//    private WebElement removeFromWalletButton;

    @AndroidFindBy(uiAutomator = "new UiScrollable(new UiSelector().scrollable(true).instance(0)).scrollIntoView(new UiSelector().description(\"outlined-delete-icon\"))")
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

    @AndroidFindBy(accessibility = "wallet-activated-icon")
    @iOSXCUITFindBy(accessibility = "wallet-activated-icon")
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

    @AndroidFindBy(accessibility = "enableVerification")
    @iOSXCUITFindBy(accessibility = "enableVerification")
    private WebElement enableVerification;

    @AndroidFindBy(accessibility = "shareVcWithSelfieFromKebab")
    @iOSXCUITFindBy(accessibility = "shareVcWithSelfieFromKebab")
    private WebElement shareVcWithSelfieFromKebab;


    public MoreOptionsPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isMoreOptionsPageLoaded() {
        return this.isElementDisplayed(moreOptionsText);
    }

    public PleaseConfirmPopupPage clickOnRemoveFromWallet() {
        IosUtil.scrollToElement(driver, 59, 755, 119, 20);
        clickOnElement(removeFromWalletButton);
        return new PleaseConfirmPopupPage(driver);
    }

    public void clickOnPinOrUnPinCard() {
        clickOnElement(pinOrUnPinCardButton);
    }

    public HistoryPage clickOnViewActivityLog() {
        IosUtil.scrollToElement(driver, 171, 2149, 625, 1944);
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
        if(isElementDisplayed(closeButton)) {
            clickOnElement(closeButton);
        }
        return new HomePage(driver);
    }

    public boolean isSomethingIsWrongPopupVisible() {
        return this.isElementDisplayed(somethingIsWrongPopup);
    }

    public boolean isVcActivatedDisplayed() {
        return this.isElementDisplayed(activatedForOnlineLoginButton);
    }

    public void clickOnActivationButton() {
        clickOnElement(enableVerification);
    }

    public void clickOnDetailsViewActivationButton() {
        clickOnElement(activationPending);
    }

    public void clickOnShareVcWithSelfieFromKebabButton() {
        clickOnElement(shareVcWithSelfieFromKebab);
    }
}