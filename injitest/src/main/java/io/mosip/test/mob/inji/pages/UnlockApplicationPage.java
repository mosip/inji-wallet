package io.mosip.test.mob.inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class UnlockApplicationPage extends BasePage {

    @AndroidFindBy(accessibility = "unlockApplication")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`label == \"Unlock application\"`]")
    private WebElement unlockApplicationButton;

    public UnlockApplicationPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isUnlockApplicationPageLoaded() {
        return this.isElementDisplayed(unlockApplicationButton, "Unlock application page");
    }

    public EnterYourPasscodePage clickOnUnlockApplicationButton() {
        clickOnElement(unlockApplicationButton);
        return new EnterYourPasscodePage(driver);
    }
}
