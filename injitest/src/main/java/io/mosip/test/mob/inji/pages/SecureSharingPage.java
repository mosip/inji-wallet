package io.mosip.test.mob.inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class SecureSharingPage extends BasePage {

    @AndroidFindBy(xpath = "//*[contains(@text,'Secure Sharing')]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`label == \"Secure Sharing\"`]")
    private WebElement secureSharingText;

    @AndroidFindBy(xpath = "(//*[@class='android.widget.TextView'])[3]")
    @iOSXCUITFindBy(xpath = "//*[contains(@value,'Share your cards')]")
    private WebElement secureSharingDescription;

    @AndroidFindBy(xpath = "//*[@text='Next']")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeOther[`label == \"Next\"`][4]")
    private WebElement nextButton;

    public SecureSharingPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isSecureSharingPageLoaded() {
        return this.isElementDisplayed(secureSharingText, "Secure sharing page");
    }

    public String getSecureSharingDescription() {
        return this.getTextFromLocator(secureSharingDescription);
    }

    public AppUnlockMethodPage clickOnNextButton() {
        this.clickOnElement(nextButton);
        return new AppUnlockMethodPage(driver);
    }
}
