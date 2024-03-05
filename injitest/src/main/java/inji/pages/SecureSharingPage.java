package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class SecureSharingPage extends BasePage {

    @AndroidFindBy(accessibility = "introTitle-two")
    @iOSXCUITFindBy(accessibility = "introTitle-two")
    private WebElement secureSharingText;

    @AndroidFindBy(accessibility = "introText-two")
    @iOSXCUITFindBy(accessibility = "introText-two")
    private WebElement secureSharingDescription;

    @AndroidFindBy(accessibility = "next")
    @iOSXCUITFindBy(accessibility = "next")
    private WebElement nextButton;

    public SecureSharingPage(AppiumDriver driver) {
        super(driver);
    }
    BasePage basePage = new BasePage(driver);

    public String  verifyLanguageforSecureSharingPageLoaded(){
        basePage.retrieToGetElement(secureSharingText);
        return getTextFromLocator(secureSharingText);

    }

    public String getSecureSharingDescription() {
        basePage.retrieToGetElement(secureSharingDescription);
        return this.getTextFromLocator(secureSharingDescription);
    }

    public void clickOnNextButton() {
        this.clickOnElement(nextButton);
        new AppUnlockMethodPage(driver);
    }
}
