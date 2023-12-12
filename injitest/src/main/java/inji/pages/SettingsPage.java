package inji.pages;

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

    @AndroidFindBy(xpath = "//*[contains(@text,'Language')]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`label == \"Language\"`]")
    private WebElement languageButton;

    @AndroidFindBy(xpath = "//*[contains(@text,'Filipino')]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`label == \"Filipino\"`]")
    private WebElement filipinoLanguageButton;

    @AndroidFindBy(xpath = "//*[contains(@text,'Wika')]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`label == \"Wika\"`]")
    private WebElement wikaButton;

    @AndroidFindBy(uiAutomator = "new UiSelector().resourceId(\"listItemTitle\")")
    private List<WebElement> languages;

    @AndroidFindBy(uiAutomator = "new UiSelector().resourceId(\"aboutInji\")")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`label == \"About Inji\"`]")
    private WebElement aboutInji;

    @AndroidFindBy(xpath = "//*[contains(@text,'Tuvali-version: v')]")
    @iOSXCUITFindBy(xpath = "//*[contains(@name,'Tuvali-version: v')]")
    private WebElement tuvaliVersion;

    @AndroidFindBy(accessibility = "injiTourGuide")
    @iOSXCUITFindBy(accessibility = "injiTourGuide")
    private WebElement injiTourGuide;

    @AndroidFindBy(accessibility = "receivedCards")
    @iOSXCUITFindBy(accessibility = "injiTourGuide")
    private WebElement receivedCards;

    @AndroidFindBy(xpath = "//*[contains(@text,'Credential Registry')]")
    public WebElement credentialRegistryText;

    @AndroidFindBy(xpath = "//*[contains(@text,'Receive Card')]")
    public WebElement receiveCardText;

    @AndroidFindBy(xpath = "//*[contains(@text,'Tumanggap ng Card')]")
    public WebElement receiveCardInfilipinoLanguageText;

    @AndroidFindBy(xpath = "(//*[@resource-id=\"padView\"])[3]")
    private WebElement arabicLanguageButton;

    @AndroidFindBy(className = "android.widget.TextView")
    private WebElement chooseLanguageInArabic;

    public SettingsPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isSettingPageLoaded() {
        return this.isElementDisplayed(settingsTittle, "Setting page");
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

    public boolean verifyFilipinoLanguage() {
        return this.isElementDisplayed(wikaButton, "Filipino language");
    }

    public boolean verifyLanguagesInLanguageFilter() {
        List<String> expectedLanguages = Arrays.asList("English", "Filipino", "عربى", "हिंदी", "ಕನ್ನಡ", "தமிழ்");

        List<String> actualLanguages = languages.stream()
                .map(WebElement::getText)
                .collect(Collectors.toList());

        return new HashSet<>(expectedLanguages).equals(new HashSet<>(actualLanguages));
    }

    public SettingsPage clickOnAboutInji() {
        clickOnElement(aboutInji);
        return this;
    }

    public boolean isTuvaliVersionPresent() {
        return this.isElementDisplayed(tuvaliVersion, "Tuvali-version");
    }

    public void clickOnInjiTourGuide() {
        clickOnElement(injiTourGuide);
    }

    public boolean isReceivedCardsPresent() {
        return this.isElementDisplayed(receivedCards, "Received Cards");
    }
    
    public boolean verifyArabicLanguage() {
        return this.isElementDisplayed(chooseLanguageInArabic, "فتح التطبيق");
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

    public void clickOnArabicLanguageButton() {
        clickOnElement(arabicLanguageButton);
    }
}
