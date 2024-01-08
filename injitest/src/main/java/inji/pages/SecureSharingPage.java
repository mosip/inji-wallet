package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class SecureSharingPage extends BasePage {

    @AndroidFindBy(accessibility = "introTitle")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`label == \"Secure Sharing\"`]")
    private WebElement secureSharingText;

    @AndroidFindBy(accessibility = "introText")
    @iOSXCUITFindBy(xpath = "//*[contains(@value,'Share your cards')]")
    private WebElement secureSharingDescription;

    @AndroidFindBy(accessibility = "next")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeOther[`label == \"Next\"`][4]")
    private WebElement nextButton;

    public SecureSharingPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isSecureSharingPageLoaded() {
        return this.isElementDisplayed(secureSharingText);
    }
    
    public boolean isSecureSharingPageLoadedInFilipino() {
        return this.isElementDisplayed(secureSharingText);
    }
    
    
    public boolean isSecureSharingPageLoadedInTamil() {
        return this.isElementDisplayed(secureSharingText);
    }
    
    public boolean isSecureSharingPageLoadedInKannada() {
        return this.isElementDisplayed(secureSharingText);
    }

    
    public boolean isSecureSharingPageLoadedInHindi() {
        return this.isElementDisplayed(secureSharingText);
    }

    public String getSecureSharingDescription() {
        return this.getTextFromLocator(secureSharingDescription);
    }

    public void clickOnNextButton() {
        this.clickOnElement(nextButton);
        new AppUnlockMethodPage(driver);
    }
}
