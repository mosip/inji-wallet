package pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class WelcomePage extends BasePage {

    @AndroidFindBy(xpath = "//*[contains(@text,'Welcome!')]")
    @iOSXCUITFindBy(accessibility = "Welcome!")
    private WebElement welcomeText;

    @AndroidFindBy(xpath = "(//*[@class='android.widget.TextView'])[3]")
    @iOSXCUITFindBy(xpath = "//*[contains(@value,'Keep your digital')]")
    private WebElement welcomeTextDescription;

    @AndroidFindBy(xpath = "//*[contains(@text,'Skip')]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`label == \"Skip\"`][1]")
    private WebElement skipButton;

    @AndroidFindBy(xpath = "//*[@text='Next']")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeOther[`label == \"Next\"`][4]")
    private WebElement nextButton;


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


}
