package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class AboutInjiPage extends BasePage {
    @AndroidFindBy(accessibility = "aboutInji")
    @iOSXCUITFindBy(accessibility = "aboutInji")
    private WebElement aboutInjiHeader;
    
    @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Copy\")")
    @iOSXCUITFindBy(accessibility = "\uE173 Copy")
    private WebElement copy;
    
    @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Copied\")")
    @iOSXCUITFindBy(accessibility = "\uE173 Copied")
    private WebElement copied;
    
    @AndroidFindBy(uiAutomator = "new UiSelector().resourceId(\"iconIcon\")")
    @iOSXCUITFindBy(accessibility = "closeModal")
    private WebElement backButton;
    
    public AboutInjiPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isaboutInjiHeaderDisplayed() {
        return this.isElementDisplayed(aboutInjiHeader, "ABOUT INJI");
    }
    
    public boolean isAppidIsCopied() {
        return this.isElementDisplayed(copied, "Copied");
    }
    
    public boolean isCopyTextDisplayed() {
        return this.isElementDisplayed(copy, "Copy");
    }

    public AboutInjiPage clickOnCopy(){
        clickOnElement(copy);
        return this;
    }
    
    public AboutInjiPage clickOnBack(){
        clickOnElement(copy);
        return this;
    }
}
