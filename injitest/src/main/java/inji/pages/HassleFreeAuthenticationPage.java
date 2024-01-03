package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class HassleFreeAuthenticationPage extends BasePage {

    @AndroidFindBy(accessibility = "introTitle")
    @iOSXCUITFindBy(iOSNsPredicate = "label == \"Hassle free authentication\"")
    private WebElement hassleFreeAuthenticationText;

    @AndroidFindBy(accessibility = "introText")
    @iOSXCUITFindBy(xpath = "//*[contains(@value,'Authenticate yourself')]")
    private WebElement hassleFreeAuthenticationDescription;

    @AndroidFindBy(accessibility = "getStarted")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`label == \"Back\"`][4]")
    public WebElement goBackButton;

    public HassleFreeAuthenticationPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isHassleFreeAuthenticationPageLoaded() {
        return this.isElementDisplayed(hassleFreeAuthenticationText);
    }

    public String getHassleFreeAuthenticationDescription() {
        return this.getTextFromLocator(hassleFreeAuthenticationDescription);
    }

    public void clickOnGoBack() {
        clickOnElement(goBackButton);
    }
}
