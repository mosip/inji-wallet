package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class WelcomePage extends BasePage {

    @AndroidFindBy(accessibility = "introTitle")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`label == \"Welcome!\"`]")
    private WebElement welcomeText;

    @AndroidFindBy(accessibility = "introText")
    @iOSXCUITFindBy(xpath = "//*[contains(@value,'Keep your digital')]")
    private WebElement welcomeTextDescription;

    @AndroidFindBy(accessibility = "skip")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`label == \"Skip\"`][1]")
    private WebElement skipButton;

    @AndroidFindBy(accessibility = "next")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeOther[`label == \"Next\"`][4]")
    private WebElement nextButton;
    
    @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Back\")")
    public WebElement backButton;


    public WelcomePage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isWelcomePageLoaded() {
        return this.isElementDisplayed(welcomeText, "Welcome page");
    }

    public AppUnlockMethodPage clickOnSkipButton() {
        this.clickOnElement(skipButton);
        return new AppUnlockMethodPage(driver);
    }

    public AppUnlockMethodPage clickOnNextButton() {
        this.clickOnElement(nextButton);
        return new AppUnlockMethodPage(driver);
    }

    public String getWelcomeDescription() {
        return this.getTextFromLocator(welcomeTextDescription);
    }

    public void clickOnBackButton() {
    	this.clickOnElement(backButton);
    }
}
