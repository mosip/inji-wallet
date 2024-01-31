package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class TrustedDigitalWalletPage extends BasePage {

    @AndroidFindBy(accessibility = "introTitle")
    @iOSXCUITFindBy(xpath = "(//XCUIElementTypeStaticText[@name=\"introTitle\"])[2]")
    private WebElement trustedDigitalWalletText;

    @AndroidFindBy(accessibility = "introText")
    @iOSXCUITFindBy(xpath = "(//XCUIElementTypeStaticText[@name=\"introText\"])[2]")
    private WebElement trustedDigitalWalletDescription;

    @AndroidFindBy(accessibility = "next")
    @iOSXCUITFindBy(xpath = "(//XCUIElementTypeOther[@name=\"Susunod\" or @name=\"next\" or @name=\"अगला\" or @name=\"ಮುಂದೆ\" or @name=\"அடுத்தது\"])[4]\n")
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
