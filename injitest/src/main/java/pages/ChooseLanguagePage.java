package pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;
import utils.CommonMethods;


public class ChooseLanguagePage extends BasePage {

    @AndroidFindBy(xpath = "//*[contains(@text,'Choose Language')]")
    @iOSXCUITFindBy(accessibility = "Choose Language")
    private WebElement chooseLanguageText;

    @AndroidFindBy(xpath = "//*[contains(@text,'Save Preference')]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`label == \"Save Preference\"`]")
    private WebElement savePreferenceText;

    public ChooseLanguagePage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isChooseLanguagePageLoaded() {
        boolean temp = isElementDisplayed(chooseLanguageText, "Choose language page");
        if (!temp) {
            CommonMethods.invokeAppFromBackGroundAndroid();
        }
        return true;
    }

    public WelcomePage clickOnSavePreference() {
        clickOnElement(savePreferenceText);
        return new WelcomePage(driver);
    }
}
