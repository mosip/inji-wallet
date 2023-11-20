package io.mosip.test.mob.inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import io.mosip.test.mob.inji.utils.CommonMethods;

import org.openqa.selenium.WebElement;


public class ChooseLanguagePage extends BasePage {

    @AndroidFindBy(accessibility = "chooseLanguage")
    @iOSXCUITFindBy(accessibility = "chooseLanguage")
    private WebElement chooseLanguageText;

    @AndroidFindBy(accessibility = "savePreference")
    @iOSXCUITFindBy(accessibility = "savePreference")
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
