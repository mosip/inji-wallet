package io.mosip.test.mob.inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;

import org.openqa.selenium.WebElement;

public class HelpPage extends BasePage {

    @AndroidFindBy(accessibility = "helpScreen")
    @iOSXCUITFindBy(accessibility = "helpScreen")
    private WebElement helpText;

    @AndroidFindBy(xpath = "//*[@resource-id=\"iconIcon\"]")
    @iOSXCUITFindBy(accessibility = "close")
    private WebElement crossIcon;
    
    @AndroidFindBy(uiAutomator = "new UiScrollable(new UiSelector()).scrollIntoView(text(\"How to view activity logs?\"));")
    public WebElement howToViewActivity;
    
    public HelpPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isHelpPageLoaded() {
        return this.isElementDisplayed(helpText, "Help page");
    }

    public void exitHelpPage() {
        this.clickOnElement(crossIcon);
    }
    
    public void ScrollToViewActivityLog() {
    	howToViewActivity.click();
    }
    
}
