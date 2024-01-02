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
    @iOSXCUITFindBy(accessibility = "languageTitle")
    private WebElement languageButton;

    @AndroidFindBy(xpath = "//*[contains(@text,'Filipino')]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`label == \"Filipino\"`]")
    private WebElement filipinoLanguageButton;

    @AndroidFindBy(xpath = "//*[contains(@text,'Wika')]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeOther[`label == \"\uE037 Wika \uE5CC\"`][1]")
    private WebElement wikaButton;

    @AndroidFindBy(uiAutomator = "new UiSelector().resourceId(\"listItemTitle\")")
    @iOSXCUITFindBy(iOSNsPredicate = "name == \"listItemTitle\"")
    private List<WebElement> languages;

    @AndroidFindBy(uiAutomator = "new UiSelector().resourceId(\"aboutInji\")")
    @iOSXCUITFindBy(accessibility = "aboutInjiTitle")
    private WebElement aboutInji;

    @AndroidFindBy(xpath = "//*[contains(@text,'Tuvali-version: v')]")
    @iOSXCUITFindBy(xpath = "//*[contains(@name,'Tuvali-version: 0.4.6')]")
    private WebElement tuvaliVersion;

    @AndroidFindBy(accessibility = "injiTourGuide")
    @iOSXCUITFindBy(accessibility = "injiTourGuide")
    private WebElement injiTourGuide;

    @AndroidFindBy(accessibility = "receivedCards")
    private WebElement receivedCards;

    @AndroidFindBy(xpath = "//*[contains(@text,'Credential Registry')]")
    @iOSXCUITFindBy(accessibility = "credentialRegistryTitle")
    public WebElement credentialRegistryText;

    @AndroidFindBy(xpath = "//*[contains(@text,'Receive Card')]")
    public WebElement receiveCardText;

    @AndroidFindBy(xpath = "//*[contains(@text,'Tumanggap ng Card')]")
    public WebElement receiveCardInfilipinoLanguageText;

    @AndroidFindBy(xpath = "(//*[@resource-id=\"padView\"])[3]")
    @iOSXCUITFindBy(accessibility = "عربى")
    private WebElement arabicLanguageButton;

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

    public UnlockApplicationPage clickOnArabicLanguageButton() {
        clickOnElement(arabicLanguageButton);
        return new UnlockApplicationPage(driver);
    }
}
