package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;

import java.util.Set;

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
    
    @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Click here\")")
    @iOSXCUITFindBy(accessibility = "Click here")
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
    
    public boolean isMosipUrlIsDisplayedInChrome() throws InterruptedException {
    	Thread.sleep(5000);
    	Set<String> contexts = ((AndroidDriver) driver).getContextHandles();
    	String actualUrl=null;
    	for (String context : contexts) {
    		if (context.contains("WEBVIEW"))
    		{
    			((AndroidDriver) driver).context(context);
    			actualUrl= driver.getCurrentUrl();
    		}
    	}
    	boolean result = (actualUrl.equalsIgnoreCase("https://docs.mosip.io/inji")  == true) ? true : false;
    	return result;
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
