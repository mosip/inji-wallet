package io.mosip.test.mob.inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class PleaseConfirmPopupPage extends BasePage {
    @AndroidFindBy(accessibility = "yesConfirm")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`label == \"Yes, I confirm\"`]")
    private WebElement yesButton;

    public PleaseConfirmPopupPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isPleaseConfirmPopupPageLoaded() {
        return this.isElementDisplayed(yesButton, "Popup confirmation page");
    }

    public void clickOnConfirmButton() {
        clickOnElement(yesButton);
    }

}
