package inji.pages;

import inji.utils.AndroidUtil;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;


public class ChooseLanguagePage extends BasePage {

    @AndroidFindBy(accessibility = "chooseLanguage")
    @iOSXCUITFindBy(accessibility = "chooseLanguage")
    private WebElement chooseLanguageText;

    @AndroidFindBy(accessibility = "savePreference")
    @iOSXCUITFindBy(accessibility = "savePreference")
    private WebElement savePreferenceText;


    @AndroidFindBy(accessibility = "unlockApplication")
    private WebElement unlockApplications;


    public ChooseLanguagePage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isChooseLanguagePageLoaded() {
        boolean temp = isElementDisplayed(chooseLanguageText);
        if (!temp) {
            AndroidUtil.invokeAppFromBackGroundAndroid();
        }
        return true;
    }

    public WelcomePage clickOnSavePreference() {
        clickOnElement(savePreferenceText);
        return new WelcomePage(driver);
    }

    public ChooseLanguagePage clickOnUnlockApplication() {
        clickOnElement(unlockApplications);
        return this;
    }

    public boolean isUnlockApplicationDisplayed() {
        return this.isElementDisplayed(unlockApplications);
    }
}
