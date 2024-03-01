package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class WelcomePage extends BasePage {

    @AndroidFindBy(accessibility = "introTitle-one")
    @iOSXCUITFindBy(accessibility = "introTitle-one")
    private WebElement welcomeText;

    @AndroidFindBy(accessibility = "introText-one")
    @iOSXCUITFindBy(xpath = "(//XCUIElementTypeStaticText[@name=\"introText\"])[1]")
    private WebElement welcomeTextDescription;

    @AndroidFindBy(accessibility = "skipButton-one")
    @iOSXCUITFindBy(accessibility = "skipButton-one")
    private WebElement skipButton;

    @AndroidFindBy(accessibility = "next")
    @iOSXCUITFindBy(xpath = "(//XCUIElementTypeOther[@name=\"Susunod\" or @name=\"next\" or @name=\"अगला\" or @name=\"ಮುಂದೆ\" or @name=\"அடுத்தது\"])[4]\n")
    private WebElement nextButton;

    @AndroidFindBy(accessibility = "backButton-one")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`label == \"Back\"`][1]")
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
