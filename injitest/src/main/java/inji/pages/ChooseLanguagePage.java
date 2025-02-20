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

    @AndroidFindBy(accessibility = "fil")
    @iOSXCUITFindBy(accessibility = "fil")
    private WebElement filipinoLanguage;

    @AndroidFindBy(accessibility = "hi")
    @iOSXCUITFindBy(accessibility = "hi")
    private WebElement hindiLanguage;

    @AndroidFindBy(accessibility = "kn")
    @iOSXCUITFindBy(accessibility = "kn")
    private WebElement KannadaLanguage;

    @AndroidFindBy(accessibility = "ta")
    @iOSXCUITFindBy(accessibility = "ta")
    private WebElement tamilLanguage;

    @AndroidFindBy(accessibility = "ar")
    @iOSXCUITFindBy(accessibility = "ar")
    private WebElement arabicLanguage;



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

    public void clickOnFilipinoLangauge(){
        clickOnElement(filipinoLanguage);
    }

    public void clickOnHindiLanguage(){
        clickOnElement(hindiLanguage);
    }

    public void clickOnKannadaLanguage(){
        clickOnElement(KannadaLanguage);
    }

    public void clickOnTamilLanguage(){
        clickOnElement(tamilLanguage);
    }

    public void clickOnArabicLanguage(){
        clickOnElement(arabicLanguage);
    }



}