package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class TrustedDigitalWalletPage extends BasePage {

    @AndroidFindBy(accessibility = "introTitle-three")
    @iOSXCUITFindBy(accessibility = "introTitle-three")
    private WebElement trustedDigitalWalletText;

    @AndroidFindBy(accessibility = "introText-three")
    @iOSXCUITFindBy(accessibility = "introText-three")
    private WebElement trustedDigitalWalletDescription;

    @AndroidFindBy(accessibility = "next")
    @iOSXCUITFindBy(accessibility = "next")
    private WebElement nextButton;

    public TrustedDigitalWalletPage(AppiumDriver driver) {
        super(driver);
    }
    BasePage basePage = new BasePage(driver);
    
    public String  verifyLanguageforTrustedDigitalWalletPageLoaded(){
    	basePage.retrieToGetElement(trustedDigitalWalletText);
     	return getTextFromLocator(trustedDigitalWalletText);
    }

    public String getTrustedDigitalWalletDescription() {
    	basePage.retrieToGetElement(trustedDigitalWalletDescription);
        return this.getTextFromLocator(trustedDigitalWalletDescription);
    }

    public AppUnlockMethodPage clickOnNextButton() {
        this.clickOnElement(nextButton);
        return new AppUnlockMethodPage(driver);
    }
}
