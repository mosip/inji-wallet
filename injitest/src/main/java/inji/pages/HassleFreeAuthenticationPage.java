package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class HassleFreeAuthenticationPage extends BasePage {

    @AndroidFindBy(accessibility = "introTitle")
    @iOSXCUITFindBy(xpath = "(//XCUIElementTypeStaticText[@name=\"introTitle\"])[4]")
    private WebElement hassleFreeAuthenticationText;

    @AndroidFindBy(accessibility = "introText")
    @iOSXCUITFindBy(xpath = "(//XCUIElementTypeStaticText[@name=\"introText\"])[4]")
    private WebElement hassleFreeAuthenticationDescription;

    @AndroidFindBy(accessibility = "getStarted")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`label == \"Back\"`][4]")
    public WebElement goBackButton;

    public HassleFreeAuthenticationPage(AppiumDriver driver) {
        super(driver);
    }
    
    public String  verifyLanguageforHassleFreeAuthenticationPageLoaded(){
    	return getTextFromLocator(hassleFreeAuthenticationText);
    }

    public String getHassleFreeAuthenticationDescription() {
        return this.getTextFromLocator(hassleFreeAuthenticationDescription);
    }
    
    public HassleFreeAuthenticationPage clickOnGoBack() {
        clickOnElement(goBackButton);
        return this;
    }
}
