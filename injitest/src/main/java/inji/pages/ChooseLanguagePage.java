package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;

import org.openqa.selenium.Point;
import org.openqa.selenium.WebElement;

import inji.utils.AndroidUtil;


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
        boolean temp = isElementDisplayed(chooseLanguageText, "Choose language page");
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
       return this.isElementDisplayed(unlockApplications, "Unlock Application");
   }
}
