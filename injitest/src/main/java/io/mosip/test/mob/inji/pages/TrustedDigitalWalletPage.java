package io.mosip.test.mob.inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class TrustedDigitalWalletPage extends BasePage {

    @AndroidFindBy(xpath = "//*[contains(@text,'Trusted Digital Wallet')]")
    @iOSXCUITFindBy(accessibility = "Trusted Digital Wallet")
    private WebElement trustedDigitalWalletText;

    @AndroidFindBy(xpath = "(//*[@class='android.widget.TextView'])[3]")
    @iOSXCUITFindBy(xpath = "//*[contains(@value,'Store and carry')]")
    private WebElement trustedDigitalWalletDescription;

    @AndroidFindBy(xpath = "//*[@text='Next']")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeOther[`label == \"Next\"`][4]")
    private WebElement nextButton;

    public TrustedDigitalWalletPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isTrustedDigitalWalletPageLoaded() {
        return this.isElementDisplayed(trustedDigitalWalletText, "Trusted digital wallet page");
    }

    public String getTrustedDigitalWalletDescription() {
        return this.getTextFromLocator(trustedDigitalWalletDescription);
    }

    public AppUnlockMethodPage clickOnNextButton() {
        this.clickOnElement(nextButton);
        return new AppUnlockMethodPage(driver);
    }

}
