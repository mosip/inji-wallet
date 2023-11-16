package io.mosip.test.mob.inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import org.openqa.selenium.WebElement;

public class AboutInjiPage extends BasePage{

    @AndroidFindBy(accessibility = "aboutInji")
    private WebElement aboutInjiHeader;
    
    @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Copy\")")
    private WebElement Copy;
    
    @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Copied\")")
    private WebElement Copied;
    
    @AndroidFindBy(xpath = "//*[@resource-id=\"iconIcon\"]")
    private WebElement Back;
  //android.widget.TextView[@resource-id="iconIcon" and @text=""]
    
    
    public AboutInjiPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isaboutInjiHeaderDisplayed() {
        return this.isElementDisplayed(aboutInjiHeader, "ABOUT INJI");
    }
    
    public boolean isAppidIsCopied() {
        return this.isElementDisplayed(Copied, "Copied");
    }
    
    public boolean isAppidIsCopy() {
        return this.isElementDisplayed(Copy, "Copy");
    }

    public AboutInjiPage clickOnCopy(){
        clickOnElement(Copy);
        return new AboutInjiPage(driver);
    }
    
    public AboutInjiPage clickOnBack(){
        clickOnElement(Copy);
        return new AboutInjiPage(driver);
    }
}
