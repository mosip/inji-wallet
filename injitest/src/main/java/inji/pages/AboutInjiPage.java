package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;

import org.openqa.selenium.WebElement;

public class AboutInjiPage extends BasePage {
    @AndroidFindBy(accessibility = "aboutInji")
    @iOSXCUITFindBy(accessibility = "aboutInji")
    private WebElement aboutInjiHeader;

    @AndroidFindBy(accessibility = "CopyText")
    @iOSXCUITFindBy(accessibility = "CopyText")
    private WebElement copy;

    @AndroidFindBy(uiAutomator = "CopyText")
    @iOSXCUITFindBy(accessibility = "CopiedText")
    private WebElement copied;

    @AndroidFindBy(accessibility = "arrowLeft")
    @iOSXCUITFindBy(accessibility = "arrowLeft")
    private WebElement backButton;

    public AboutInjiPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isAboutInjiHeaderDisplayed() {
        return this.isElementDisplayed(aboutInjiHeader);
    }

    public boolean isAppIdCopiedTextDisplayed() {
        return this.isElementDisplayed(copied);
    }

    public boolean isCopyTextDisplayed() {
        return this.isElementDisplayed(copy);
    }

    public void clickOnCopyText() {
        clickOnElement(copy);
    }

    public void clickOnBackButton() {
        clickOnElement(copy);
    }
}
