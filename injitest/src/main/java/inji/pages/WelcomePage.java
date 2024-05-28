package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;
import org.testng.Assert;

public class WelcomePage extends BasePage {

    @AndroidFindBy(accessibility = "introTitle-one")
    @iOSXCUITFindBy(accessibility = "introTitle-one")
    private WebElement welcomeText;

    @AndroidFindBy(accessibility = "introText-one")
    @iOSXCUITFindBy(accessibility = "introText-one")
    private WebElement welcomeTextDescription;

    @AndroidFindBy(accessibility = "skipButton-one")
    @iOSXCUITFindBy(accessibility = "skipButton-one")
    private WebElement skipButton;

    @AndroidFindBy(accessibility = "next")
    @iOSXCUITFindBy(accessibility = "next")
    private WebElement nextButton;

    @AndroidFindBy(accessibility = "backButton-one")
    @iOSXCUITFindBy(accessibility = "backButton-one")
    public WebElement backButton;

    public WelcomePage(AppiumDriver driver) {
        super(driver);
    }
    BasePage basePage = new BasePage(driver);

    public String  verifyLanguageforWelcomePageLoaded(){
        return getTextFromLocator(welcomeText);
    }

    public boolean isWelcomePageLoaded() {
        basePage.retrieToGetElement(welcomeText);
        return this.isElementDisplayed(welcomeText);
    }

    public AppUnlockMethodPage clickOnSkipButton() {
        this.clickOnElement(skipButton);
        return new AppUnlockMethodPage(driver);
    }

    public void clickOnNextButton() {
        this.clickOnElement(nextButton);
        new AppUnlockMethodPage(driver);
    }

    public String getWelcomeDescription() {
        basePage.retrieToGetElement(welcomeTextDescription);
        return this.getTextFromLocator(welcomeTextDescription);
    }

    public void clickOnBackButton() {
        this.clickOnElement(backButton);
    }
}
