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

    @AndroidFindBy(accessibility = "CopiedText")
    @iOSXCUITFindBy(accessibility = "CopiedText")
    private WebElement copied;

    @AndroidFindBy(accessibility = "arrowLeft")
    @iOSXCUITFindBy(accessibility = "arrowLeft")
    private WebElement backButton;
    
    @AndroidFindBy(accessibility = "clickHere")
    @iOSXCUITFindBy(accessibility = "clickHere")
    public WebElement clickHereButton;
    
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

    public boolean  isMosipUrlIsDisplayedInChrome() throws InterruptedException {
        Thread.sleep(5000);
        String context= driver.getPageSource();
        return context.contains("Inji")||context.contains("inji");
    }

    public void clickOnCopyText() {
        clickOnElement(copy);
    }

    public void clickOnBackButton() {
        clickOnElement(copy);
    }
    
    public void clickOnClickHereButton() {
        clickOnElement(clickHereButton);
    }
}
