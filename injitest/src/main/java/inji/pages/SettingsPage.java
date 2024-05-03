package inji.pages;

import inji.constants.Target;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

public class SettingsPage extends BasePage {

    @AndroidFindBy(accessibility = "settingsScreen")
    @iOSXCUITFindBy(accessibility = "settingsScreen")
    private WebElement settingsTittle;

    @AndroidFindBy(accessibility = "logout")
    @iOSXCUITFindBy(accessibility = "Logout")
    private WebElement logoutButton;

    @AndroidFindBy(accessibility = "languageTitle")
    @iOSXCUITFindBy(accessibility = "languageTitle")
    private WebElement languageButton;

    @iOSXCUITFindBy(accessibility = "لغة")
    private WebElement languageButtonInArabic;

    @AndroidFindBy(accessibility = "fil")
    @iOSXCUITFindBy(accessibility = "fil")
    private WebElement filipinoLanguageButton;
    
    @AndroidFindBy(accessibility = "hi")
    @iOSXCUITFindBy(accessibility = "hi")
    private WebElement hindiLanguageButton;
    
    @AndroidFindBy(accessibility = "ta")
    @iOSXCUITFindBy(accessibility = "ta")
    private WebElement tamilLanguageButton;
    
    @AndroidFindBy(accessibility = "kn")
    @iOSXCUITFindBy(accessibility = "kn")
    private WebElement kannadaLanguageButton;


    @AndroidFindBy(xpath = "//*[contains(@text,'Wika')]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeOther[`label == \"\uE037 Wika \uE5CC\"`][1]")
    private WebElement wikaButton;

    @AndroidFindBy(uiAutomator = "new UiSelector().resourceId(\"listItemTitle\")")
    @iOSXCUITFindBy(accessibility = "languages")
    private List<WebElement> languages;

    @AndroidFindBy(accessibility = "aboutInjiTitle")
    @iOSXCUITFindBy(accessibility = "aboutInjiTitle")
    private WebElement aboutInji;

    @AndroidFindBy(xpath = "//*[contains(@text,'Tuvali-version:')]")
    @iOSXCUITFindBy(xpath = "//*[contains(@name,'Tuvali-version: 0.')]")
    private WebElement tuvaliVersion;

    @AndroidFindBy(accessibility = "injiTourGuide")
    @iOSXCUITFindBy(accessibility = "injiTourGuide")
    private WebElement injiTourGuide;

    @AndroidFindBy(accessibility = "receivedCards")
    @iOSXCUITFindBy(accessibility = "injiTourGuide")
    private WebElement receivedCards;

    @AndroidFindBy(accessibility = "credentialRegistryTitle")
    @iOSXCUITFindBy(accessibility = "credentialRegistryTitle")
    public WebElement credentialRegistryText;

    @AndroidFindBy(accessibility = "receiveCard")
    public WebElement receiveCardText;

    @AndroidFindBy(xpath = "//*[contains(@text,'Tumanggap ng Card')]")
    public WebElement receiveCardInfilipinoLanguageText;

    @AndroidFindBy(accessibility = "ar")
    @iOSXCUITFindBy(accessibility = "ar")
    private WebElement arabicLanguageButton;
    
    @AndroidFindBy(accessibility = "arrowLeft")
    @iOSXCUITFindBy(accessibility = "arrowLeft")
    private WebElement backButton;

    @AndroidFindBy(accessibility = "dataBackupAndRestore")
    private WebElement dataBackupAndRestore;

    @AndroidFindBy(accessibility = "newLabel")
    private WebElement newlable;


    public SettingsPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isSettingPageLoaded() {
        return this.isElementDisplayed(settingsTittle);
    }
    
    public boolean isSettingPageLoadedInFilipion() {
        return this.isElementDisplayed(settingsTittle);
    }

    public UnlockApplicationPage clickOnLogoutButton() {
        clickOnElement(logoutButton);
        return new UnlockApplicationPage(driver);
    }

    public SettingsPage clickOnLanguage() {
        clickOnElement(languageButton);
        return this;
    }



    public void clickOnFilipinoLanguage() {
        clickOnElement(filipinoLanguageButton);
    }

    public void clickOnTamilLanguage() {
        clickOnElement(tamilLanguageButton);
    }
    
    public void clickOnHindiLanguage() {
        clickOnElement(hindiLanguageButton);
    }
    
    public void clickOnKannadaLanguage() {
        clickOnElement(kannadaLanguageButton);
    }

    public boolean verifyFilipinoLanguage() {
        return this.isElementDisplayed(wikaButton);
    }
    
    public boolean verifyTamilLanguage() {
        return this.isElementDisplayed(languageButton);
    }
    
    public boolean verifyHindiLanguage() {
        return this.isElementDisplayed(languageButton);
    }
    
    public boolean verifyKannadaLanguage() {
        return this.isElementDisplayed(languageButton);
    }

    public boolean verifyLanguagesInLanguageFilter(String os) {
        List<String> expectedLanguages=null;
        List<String> actualLanguages= null;
       if(os.equals("IOS")){
         expectedLanguages = Arrays.asList("English \uE5CA Filipino عربى हिंदी ಕನ್ನಡ தமிழ்");
         } else if (os.equals("ANDROID")) {
           expectedLanguages = Arrays.asList("English", "Filipino","عربى", "हिंदी", "ಕನ್ನಡ", "தமிழ்");
       }
        actualLanguages = languages.stream()
                .map(WebElement::getText)
                .collect(Collectors.toList());
        return new HashSet<>(expectedLanguages).equals(new HashSet<>(actualLanguages));
    }

    public SettingsPage clickOnAboutInji() {
        clickOnElement(aboutInji);
        return this;
    }

    public boolean isTuvaliVersionPresent() {
        return this.isElementDisplayed(tuvaliVersion);
    }

    public void clickOnInjiTourGuide() {
        clickOnElement(injiTourGuide);
    }

    public boolean isReceivedCardsPresent() {
        return this.isElementDisplayed(receivedCards);
    }

    public CredentialRegistryPage clickOnCredentialRegistry() {
        clickOnElement(credentialRegistryText);
        return new CredentialRegistryPage(driver);
    }

    public ReceiveCardPage clickOnReceiveCard() {
        clickOnElement(receiveCardText);
        return new ReceiveCardPage(driver);
    }

    public ReceiveCardPage clickOnReceiveCardFilipinoLanguage() {
        clickOnElement(receiveCardInfilipinoLanguageText);
        return new ReceiveCardPage(driver);
    }

    public AboutInjiPage clickOnAbouInji() {
        clickOnElement(aboutInji);
        return new AboutInjiPage(driver);
    }

    public SettingsPage clickOnBackArrow() {
        clickOnElement(backButton);
        return this;
    }
    public UnlockApplicationPage clickOnlanguageButtonInArabic() {
        clickOnElement(languageButtonInArabic);
        return new UnlockApplicationPage(driver);
    }

    
    public UnlockApplicationPage clickOnArabicLanguageButton() {
        clickOnElement(arabicLanguageButton);
        return new UnlockApplicationPage(driver);
    }

    public boolean isdataBackupAndRestoreDisplayed() {
        return this.isElementDisplayed(dataBackupAndRestore);
    }

    public BackupAndRestorePage clickOnDataBackupAndRestoreButton() {
        clickOnElement(dataBackupAndRestore);
        return new BackupAndRestorePage(driver);
    }

    public boolean isNewlableDisplayed() {
        return this.isElementDisplayed(newlable);
    }
    public String  getDataBackupAndRestoreText(){
        return getTextFromLocator(dataBackupAndRestore);
    }

    public String getreceiveCardText(){
        return getTextFromLocator(receiveCardText);
    }

}
