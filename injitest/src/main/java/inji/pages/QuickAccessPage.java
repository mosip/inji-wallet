package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class QuickAccessPage extends BasePage {

    @AndroidFindBy(accessibility = "introTitle-four")
    @iOSXCUITFindBy(xpath = "(//XCUIElementTypeStaticText[@name=\"introTitle\"])[2]")
    private WebElement quickAccessText;

    @AndroidFindBy(accessibility = "introText-four")
    @iOSXCUITFindBy(xpath = "(//XCUIElementTypeStaticText[@name=\"introText\"])[2]")
    private WebElement quickAccessDescription;

    @AndroidFindBy(accessibility = "next")
    @iOSXCUITFindBy(xpath = "(//XCUIElementTypeOther[@name=\"Susunod\" or @name=\"next\" or @name=\"अगला\" or @name=\"ಮುಂದೆ\" or @name=\"அடுத்தது\"])[4]\n")
    private WebElement nextButton;

    public QuickAccessPage(AppiumDriver driver) {
        super(driver);
    }
    BasePage basePage = new BasePage(driver);
    
    public String  verifyLanguageforQuickAccessTextPageLoaded(){
    	basePage.retrieToGetElement(quickAccessText);
     	return getTextFromLocator(quickAccessText);
    }

    public String getQuickAccessDescription() {
    	basePage.retrieToGetElement(quickAccessDescription);
        return this.getTextFromLocator(quickAccessDescription);
    }

    public AppUnlockMethodPage clickOnNextButton() {
        this.clickOnElement(nextButton);
        return new AppUnlockMethodPage(driver);
    }

}
