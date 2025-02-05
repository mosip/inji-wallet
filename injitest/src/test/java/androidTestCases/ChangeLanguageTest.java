package androidTestCases;

import BaseTest.AndroidBaseTest;
import inji.api.BaseTestCase;
import inji.constants.Target;
import inji.pages.*;
import inji.utils.TestDataReader;
import org.testng.annotations.Test;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertTrue;

public class ChangeLanguageTest extends AndroidBaseTest {
    @Test
    public void changeLanguage() {
        ChooseLanguagePage chooseLanguagePage = new ChooseLanguagePage(driver);

        assertTrue(chooseLanguagePage.isChooseLanguagePageLoaded(), "Verify if choose language page is displayed");
        WelcomePage welcomePage = chooseLanguagePage.clickOnSavePreference();

        assertTrue(welcomePage.isWelcomePageLoaded(), "Verify if welcome page is loaded");
        AppUnlockMethodPage appUnlockMethodPage = welcomePage.clickOnSkipButton();

        assertTrue(appUnlockMethodPage.isAppUnlockMethodPageLoaded(), "Verify if app unlocked page is displayed");
        SetPasscode setPasscode = appUnlockMethodPage.clickOnUsePasscode();

        assertTrue(setPasscode.isSetPassCodePageLoaded(), "Verify if set passcode page is displayed");
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.ANDROID);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.ANDROID);

        homePage.clickOnNextButtonForInjiTour();
        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        settingsPage.clickOnLanguage().clickOnFilipinoLanguage();

        assertTrue(settingsPage.verifyFilipinoLanguage(), "Verify if language is changed to filipino");
    }

    @Test
    public void languageShouldBeInNativeLanguages() {
        ChooseLanguagePage chooseLanguagePage = new ChooseLanguagePage(driver);

        assertTrue(chooseLanguagePage.isChooseLanguagePageLoaded(), "Verify if choose language page is displayed");
        WelcomePage welcomePage = chooseLanguagePage.clickOnSavePreference();

        assertTrue(welcomePage.isWelcomePageLoaded(), "Verify if welcome page is loaded");
        AppUnlockMethodPage appUnlockMethodPage = welcomePage.clickOnSkipButton();

        assertTrue(appUnlockMethodPage.isAppUnlockMethodPageLoaded(), "Verify if app unlocked page is displayed");
        SetPasscode setPasscode = appUnlockMethodPage.clickOnUsePasscode();

        assertTrue(setPasscode.isSetPassCodePageLoaded(), "Verify if set passcode page is displayed");
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.ANDROID);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.ANDROID);

        homePage.clickOnNextButtonForInjiTour();
        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        settingsPage.clickOnLanguage();

        assertTrue(settingsPage.verifyLanguagesInLanguageFilter("ANDROID"), "Verify if all languages are shown in language filter");
    }

    @Test
    public void verifyTuvaliVersion() {
        ChooseLanguagePage chooseLanguagePage = new ChooseLanguagePage(driver);

        assertTrue(chooseLanguagePage.isChooseLanguagePageLoaded(), "Verify if choose language page is displayed");
        WelcomePage welcomePage = chooseLanguagePage.clickOnSavePreference();

        assertTrue(welcomePage.isWelcomePageLoaded(), "Verify if welcome page is loaded");
        AppUnlockMethodPage appUnlockMethodPage = welcomePage.clickOnSkipButton();

        assertTrue(appUnlockMethodPage.isAppUnlockMethodPageLoaded(), "Verify if app unlocked page is displayed");
        SetPasscode setPasscode = appUnlockMethodPage.clickOnUsePasscode();

        assertTrue(setPasscode.isSetPassCodePageLoaded(), "Verify if set passcode page is displayed");
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.ANDROID);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.ANDROID);

        homePage.clickOnNextButtonForInjiTour();
        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        assertTrue(settingsPage.clickOnAboutInji().isTuvaliVersionPresent());
    }

    @Test
    public void changeLanguageToArabic() {
        ChooseLanguagePage chooseLanguagePage = new ChooseLanguagePage(driver);

        assertTrue(chooseLanguagePage.isChooseLanguagePageLoaded(), "Verify if choose language page is displayed");
        WelcomePage welcomePage = chooseLanguagePage.clickOnSavePreference();

        assertTrue(welcomePage.isWelcomePageLoaded(), "Verify if welcome page is loaded");
        AppUnlockMethodPage appUnlockMethodPage = welcomePage.clickOnSkipButton();

        assertTrue(appUnlockMethodPage.isAppUnlockMethodPageLoaded(), "Verify if app unlocked page is displayed");
        SetPasscode setPasscode = appUnlockMethodPage.clickOnUsePasscode();

        assertTrue(setPasscode.isSetPassCodePageLoaded(), "Verify if set passcode page is displayed");
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.ANDROID);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.ANDROID);

        homePage.clickOnNextButtonForInjiTour();
        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        UnlockApplicationPage unlockApplicationPage = settingsPage.clickOnLanguage().clickOnArabicLanguageButton();

        assertTrue(unlockApplicationPage.isUnlockApplicationPageLoadedInArabic(), "Verify if language is changed to arabic");
        unlockApplicationPage.clickOnUnlockApplicationButton();
        setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.ANDROID);
        HistoryPage historyPage = homePage.clickOnHistoryButton();

        assertTrue(historyPage.noHistoryAvailable(), "verify no history available in arabic");
    }

    @Test
    public void changeLanguageToFilipionAndSearchIssuer() {
        ChooseLanguagePage chooseLanguagePage = new ChooseLanguagePage(driver);

        assertTrue(chooseLanguagePage.isChooseLanguagePageLoaded(), "Verify if choose language page is displayed");
        WelcomePage welcomePage = chooseLanguagePage.clickOnSavePreference();

        assertTrue(welcomePage.isWelcomePageLoaded(), "Verify if welcome page is loaded");
        AppUnlockMethodPage appUnlockMethodPage = welcomePage.clickOnSkipButton();

        assertTrue(appUnlockMethodPage.isAppUnlockMethodPageLoaded(), "Verify if app unlocked page is displayed");
        SetPasscode setPasscode = appUnlockMethodPage.clickOnUsePasscode();

        assertTrue(setPasscode.isSetPassCodePageLoaded(), "Verify if set passcode page is displayed");
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.ANDROID);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.ANDROID);

        homePage.clickOnNextButtonForInjiTour();
        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        settingsPage.clickOnLanguage().clickOnFilipinoLanguage();

        assertTrue(settingsPage.verifyFilipinoLanguage(), "Verify if language is changed to filipino");
        homePage.clickOnHomeButton();

        assertEquals(homePage.verifyLanguageForNoVCDownloadedPageLoaded(), "Dalhin ang Iyong Digital ID");
        AddNewCardPage addNewCardPage = homePage.downloadCard();

        assertEquals(addNewCardPage.verifyLanguageForAddNewCardGuideMessage(), "Mangyaring piliin ang iyong gustong tagabigay mula sa mga opsyon sa ibaba upang magdagdag ng bagong card.");
        assertTrue(addNewCardPage.isIssuerSearchBarDisplayedInFilipino(), "verify if search bar is displayed in filipino");
        addNewCardPage.sendTextInIssuerSearchBar("I-download ang Mga Kredensyal ng MOSIP ");

        assertTrue(addNewCardPage.isDownloadViaUinDisplayed(), "verify if download via uin vid aid");
        addNewCardPage.clickOnBack();

        homePage.downloadCard();
        addNewCardPage.sendTextInIssuerSearchBar("I-download ang Mga Kredensyal ng MOSIP");
        assertTrue(addNewCardPage.isDownloadViaEsignetDisplayed(), "verify if download via e-signet is displayed");
    }

    @Test
    public void changeLanguageToFilipionAndSearchIssuerEnterIncompleteName() {
        ChooseLanguagePage chooseLanguagePage = new ChooseLanguagePage(driver);

        assertTrue(chooseLanguagePage.isChooseLanguagePageLoaded(), "Verify if choose language page is displayed");
        WelcomePage welcomePage = chooseLanguagePage.clickOnSavePreference();

        assertTrue(welcomePage.isWelcomePageLoaded(), "Verify if welcome page is loaded");
        AppUnlockMethodPage appUnlockMethodPage = welcomePage.clickOnSkipButton();

        assertTrue(appUnlockMethodPage.isAppUnlockMethodPageLoaded(), "Verify if app unlocked page is displayed");
        SetPasscode setPasscode = appUnlockMethodPage.clickOnUsePasscode();

        assertTrue(setPasscode.isSetPassCodePageLoaded(), "Verify if set passcode page is displayed");
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.ANDROID);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.ANDROID);

        homePage.clickOnNextButtonForInjiTour();
        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        settingsPage.clickOnLanguage().clickOnFilipinoLanguage();

        assertTrue(settingsPage.verifyFilipinoLanguage(), "Verify if language is changed to filipino");
        homePage.clickOnHomeButton();

        assertEquals(homePage.verifyLanguageForNoVCDownloadedPageLoaded(), "Dalhin ang Iyong Digital ID");
        AddNewCardPage addNewCardPage = homePage.downloadCard();

        assertEquals(addNewCardPage.verifyLanguageForAddNewCardGuideMessage(), "Mangyaring piliin ang iyong gustong tagabigay mula sa mga opsyon sa ibaba upang magdagdag ng bagong card.");
        assertTrue(addNewCardPage.isIssuerSearchBarDisplayedInFilipino(), "verify if search bar is displayed in filipino");
        addNewCardPage.sendTextInIssuerSearchBar("otp");

        assertTrue(addNewCardPage.isDownloadViaUinDisplayed(), "verify if download via uin vid aid");
        addNewCardPage.clickOnBack();

        homePage.downloadCard();
        addNewCardPage.sendTextInIssuerSearchBar("I-download ang");
        assertTrue(addNewCardPage.isDownloadViaEsignetDisplayed(), "verify if download via e-signet is displayed");
    }

    @Test
    public void changeLanguageToHindiAndSearchIssuer() {
        ChooseLanguagePage chooseLanguagePage = new ChooseLanguagePage(driver);

        assertTrue(chooseLanguagePage.isChooseLanguagePageLoaded(), "Verify if choose language page is displayed");
        WelcomePage welcomePage = chooseLanguagePage.clickOnSavePreference();

        assertTrue(welcomePage.isWelcomePageLoaded(), "Verify if welcome page is loaded");
        AppUnlockMethodPage appUnlockMethodPage = welcomePage.clickOnSkipButton();

        assertTrue(appUnlockMethodPage.isAppUnlockMethodPageLoaded(), "Verify if app unlocked page is displayed");
        SetPasscode setPasscode = appUnlockMethodPage.clickOnUsePasscode();

        assertTrue(setPasscode.isSetPassCodePageLoaded(), "Verify if set passcode page is displayed");
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.ANDROID);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.ANDROID);

        homePage.clickOnNextButtonForInjiTour();
        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        settingsPage.clickOnLanguage().clickOnHindiLanguage();

        assertTrue(settingsPage.verifyHindiLanguage(), "Verify if language is changed to hindi");
        homePage.clickOnHomeButton();

        assertEquals(homePage.verifyLanguageForNoVCDownloadedPageLoaded(), "अपनी डिजिटल आईडी लाओ");
        AddNewCardPage addNewCardPage = homePage.downloadCard();

        assertEquals(addNewCardPage.verifyLanguageForAddNewCardGuideMessage(), "नया कार्ड जोड़ने के लिए कृपया नीचे दिए गए विकल्पों में से अपना पसंदीदा जारीकर्ता चुनें।");
        assertTrue(addNewCardPage.isIssuerSearchBarDisplayedInHindi(), "verify if search bar is displayed in hindi");
        addNewCardPage.sendTextInIssuerSearchBar("OTP के माध्यम से MOSIP क्रेडेंशियल डाउनलोड करें");

        assertTrue(addNewCardPage.isDownloadViaUinDisplayedInHindi(), "verify if download via uin vid aid displayed in hindi");
        addNewCardPage.clickOnBack();

        homePage.downloadCard();

        addNewCardPage.sendTextInIssuerSearchBar("MOSIP क्रेडेंशियल डाउनलोड करेंं");
        assertTrue(addNewCardPage.isDownloadViaEsignetDisplayedInHindi(), "verify if download via e-signet is displayed");
    }

    @Test
    public void changeLanguageToFilipionAndcheckInjiTour() {
        ChooseLanguagePage chooseLanguagePage = new ChooseLanguagePage(driver);

        assertTrue(chooseLanguagePage.isChooseLanguagePageLoaded(), "Verify if choose language page is displayed");
        WelcomePage welcomePage = chooseLanguagePage.clickOnSavePreference();

        assertTrue(welcomePage.isWelcomePageLoaded(), "Verify if welcome page is loaded");
        AppUnlockMethodPage appUnlockMethodPage = welcomePage.clickOnSkipButton();

        assertTrue(appUnlockMethodPage.isAppUnlockMethodPageLoaded(), "Verify if app unlocked page is displayed");
        SetPasscode setPasscode = appUnlockMethodPage.clickOnUsePasscode();

        assertTrue(setPasscode.isSetPassCodePageLoaded(), "Verify if set passcode page is displayed");
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.ANDROID);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.ANDROID);

        homePage.clickOnNextButtonForInjiTour();
        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        settingsPage.clickOnLanguage().clickOnFilipinoLanguage();

        assertTrue(settingsPage.verifyFilipinoLanguage(), "Verify if language is changed to filipino");

        settingsPage.clickOnInjiTourGuide();

        assertTrue(homePage.verifyLanguageForHelpAndFrequentlyAskedQuationsHeaderDisplayed("Filipino"), "Verify if help and frequently asked quations header displayed");
        assertTrue(homePage.verifyLanguageForHelpAndFrequentlyAskedQuationsDescriptionDisplayed("Filipino"), "Verify if help and frequently asked quations description displayed");
        homePage.clickOnFirstNextButton();

        assertTrue(homePage.verifyLanguageForDownloadCardHeaderDisplayed("Filipino"), "Verify if download card header text displayed");
        assertTrue(homePage.verifyLanguageForDownloadCardDescriptionDisplayed("Filipino"), "Verify if download card description displayed");
        homePage.clickOnSecondNextButton();

        assertTrue(homePage.verifyLanguageForShareCardHeaderDisplayed("Filipino"), "Verify if share card header text displayed");
        assertTrue(homePage.verifyLanguageForShareCardDescriptionDisplayed("Filipino"), "Verify if share card description displayed");
        homePage.clickOnThirdNextButton();

        assertTrue(homePage.verifyLanguageForAccesstoHistoryHeaderDisplayed("Filipino"), "Verify if access to history header text displayed");
        assertTrue(homePage.verifyLanguageForaccesstoHistoryDescriptionDisplayed("Filipino"), "Verify if access to history description displayed");
        homePage.clickOnForthNextButton();

        assertTrue(homePage.verifyLanguageForAppSettingsHeaderDisplayed("Filipino"), "Verify if app settings header text displayed");
        assertTrue(homePage.verifyLanguageForAppSettingsDescriptionDisplayed("Filipino"), "Verify if app settings description displayed");
        homePage.clickOnFifthDoneButton();
        assertEquals(homePage.getShareButton(), "Ibahagi");
    }

    @Test
    public void changeLanguageToHindiAndcheckInjiTour() {
        ChooseLanguagePage chooseLanguagePage = new ChooseLanguagePage(driver);

        assertTrue(chooseLanguagePage.isChooseLanguagePageLoaded(), "Verify if choose language page is displayed");
        WelcomePage welcomePage = chooseLanguagePage.clickOnSavePreference();

        assertTrue(welcomePage.isWelcomePageLoaded(), "Verify if welcome page is loaded");
        AppUnlockMethodPage appUnlockMethodPage = welcomePage.clickOnSkipButton();

        assertTrue(appUnlockMethodPage.isAppUnlockMethodPageLoaded(), "Verify if app unlocked page is displayed");
        SetPasscode setPasscode = appUnlockMethodPage.clickOnUsePasscode();

        assertTrue(setPasscode.isSetPassCodePageLoaded(), "Verify if set passcode page is displayed");
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.ANDROID);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.ANDROID);

        homePage.clickOnNextButtonForInjiTour();
        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        settingsPage.clickOnLanguage().clickOnHindiLanguage();

        assertTrue(settingsPage.verifyHindiLanguage(), "Verify if language is changed to hindi");

        settingsPage.clickOnInjiTourGuide();

        assertTrue(homePage.verifyLanguageForHelpAndFrequentlyAskedQuationsHeaderDisplayed("Hindi"), "Verify if help and frequently asked quations header displayed");
        assertTrue(homePage.verifyLanguageForHelpAndFrequentlyAskedQuationsDescriptionDisplayed("Hindi"), "Verify if help and frequently asked quations description displayed");
        homePage.clickOnFirstNextButton();

        assertTrue(homePage.verifyLanguageForDownloadCardHeaderDisplayed("Hindi"), "Verify if download card header text displayed");
        assertTrue(homePage.verifyLanguageForDownloadCardDescriptionDisplayed("Hindi"), "Verify if download card description displayed");
        homePage.clickOnSecondNextButton();

        assertTrue(homePage.verifyLanguageForShareCardHeaderDisplayed("Hindi"), "Verify if share card header text displayed");
        assertTrue(homePage.verifyLanguageForShareCardDescriptionDisplayed("Hindi"), "Verify if share card description displayed");
        homePage.clickOnThirdNextButton();

        assertTrue(homePage.verifyLanguageForAccesstoHistoryHeaderDisplayed("Hindi"), "Verify if access to history header text displayed");
        assertTrue(homePage.verifyLanguageForaccesstoHistoryDescriptionDisplayed("Hindi"), "Verify if access to history description displayed");
        homePage.clickOnForthNextButton();

        assertTrue(homePage.verifyLanguageForAppSettingsHeaderDisplayed("Hindi"), "Verify if app settings header text displayed");
        assertTrue(homePage.verifyLanguageForAppSettingsDescriptionDisplayed("Hindi"), "Verify if app settings description displayed");
        homePage.clickOnFifthDoneButton();
        assertEquals(homePage.getShareButton(), "शेयर करना");
    }

    @Test
    public void changeLanguageToTamilAndcheckInjiTour() {
        ChooseLanguagePage chooseLanguagePage = new ChooseLanguagePage(driver);

        assertTrue(chooseLanguagePage.isChooseLanguagePageLoaded(), "Verify if choose language page is displayed");
        WelcomePage welcomePage = chooseLanguagePage.clickOnSavePreference();

        assertTrue(welcomePage.isWelcomePageLoaded(), "Verify if welcome page is loaded");
        AppUnlockMethodPage appUnlockMethodPage = welcomePage.clickOnSkipButton();

        assertTrue(appUnlockMethodPage.isAppUnlockMethodPageLoaded(), "Verify if app unlocked page is displayed");
        SetPasscode setPasscode = appUnlockMethodPage.clickOnUsePasscode();

        assertTrue(setPasscode.isSetPassCodePageLoaded(), "Verify if set passcode page is displayed");
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.ANDROID);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.ANDROID);

        homePage.clickOnNextButtonForInjiTour();
        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        settingsPage.clickOnLanguage().clickOnTamilLanguage();

        assertTrue(settingsPage.verifyTamilLanguage(), "Verify if language is changed to tamil");

        settingsPage.clickOnInjiTourGuide();

        assertTrue(homePage.verifyLanguageForHelpAndFrequentlyAskedQuationsHeaderDisplayed("Tamil"), "Verify if help and frequently asked quations header displayed");
        assertTrue(homePage.verifyLanguageForHelpAndFrequentlyAskedQuationsDescriptionDisplayed("Tamil"), "Verify if help and frequently asked quations description displayed");
        homePage.clickOnFirstNextButton();

        assertTrue(homePage.verifyLanguageForDownloadCardHeaderDisplayed("Tamil"), "Verify if download card header text displayed");
        assertTrue(homePage.verifyLanguageForDownloadCardDescriptionDisplayed("Tamil"), "Verify if download card description displayed");
        homePage.clickOnSecondNextButton();

        assertTrue(homePage.verifyLanguageForShareCardHeaderDisplayed("Tamil"), "Verify if share card header text displayed");
        assertTrue(homePage.verifyLanguageForShareCardDescriptionDisplayed("Tamil"), "Verify if share card description displayed");
        homePage.clickOnThirdNextButton();

        assertTrue(homePage.verifyLanguageForAccesstoHistoryHeaderDisplayed("Tamil"), "Verify if access to history header text displayed");
        assertTrue(homePage.verifyLanguageForaccesstoHistoryDescriptionDisplayed("Tamil"), "Verify if access to history description displayed");
        homePage.clickOnForthNextButton();

        assertTrue(homePage.verifyLanguageForAppSettingsHeaderDisplayed("Tamil"), "Verify if app settings header text displayed");
        assertTrue(homePage.verifyLanguageForAppSettingsDescriptionDisplayed("Tamil"), "Verify if app settings description displayed");
        homePage.clickOnFifthDoneButton();
        assertEquals(homePage.getShareButton(), "பகிர்");
    }

    @Test
    public void changeLanguageToKannadAndcheckInjiTour() {
        ChooseLanguagePage chooseLanguagePage = new ChooseLanguagePage(driver);

        assertTrue(chooseLanguagePage.isChooseLanguagePageLoaded(), "Verify if choose language page is displayed");
        WelcomePage welcomePage = chooseLanguagePage.clickOnSavePreference();

        assertTrue(welcomePage.isWelcomePageLoaded(), "Verify if welcome page is loaded");
        AppUnlockMethodPage appUnlockMethodPage = welcomePage.clickOnSkipButton();

        assertTrue(appUnlockMethodPage.isAppUnlockMethodPageLoaded(), "Verify if app unlocked page is displayed");
        SetPasscode setPasscode = appUnlockMethodPage.clickOnUsePasscode();

        assertTrue(setPasscode.isSetPassCodePageLoaded(), "Verify if set passcode page is displayed");
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.ANDROID);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.ANDROID);

        homePage.clickOnNextButtonForInjiTour();
        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        settingsPage.clickOnLanguage().clickOnKannadaLanguage();

        assertTrue(settingsPage.verifyKannadaLanguage(), "Verify if language is changed to kannada");

        settingsPage.clickOnInjiTourGuide();

        assertTrue(homePage.verifyLanguageForHelpAndFrequentlyAskedQuationsHeaderDisplayed("Kannada"), "Verify if help and frequently asked quations header displayed");
        assertTrue(homePage.verifyLanguageForHelpAndFrequentlyAskedQuationsDescriptionDisplayed("Kannada"), "Verify if help and frequently asked quations description displayed");
        homePage.clickOnFirstNextButton();

        assertTrue(homePage.verifyLanguageForDownloadCardHeaderDisplayed("Kannada"), "Verify if download card header text displayed");
        assertTrue(homePage.verifyLanguageForDownloadCardDescriptionDisplayed("Kannada"), "Verify if download card description displayed");
        homePage.clickOnSecondNextButton();

        assertTrue(homePage.verifyLanguageForShareCardHeaderDisplayed("Kannada"), "Verify if share card header text displayed");
        assertTrue(homePage.verifyLanguageForShareCardDescriptionDisplayed("Kannada"), "Verify if share card description displayed");
        homePage.clickOnThirdNextButton();

        assertTrue(homePage.verifyLanguageForAccesstoHistoryHeaderDisplayed("Kannada"), "Verify if access to history header text displayed");
        assertTrue(homePage.verifyLanguageForaccesstoHistoryDescriptionDisplayed("Kannada"), "Verify if access to history description displayed");
        homePage.clickOnForthNextButton();

        assertTrue(homePage.verifyLanguageForAppSettingsHeaderDisplayed("Kannada"), "Verify if app settings header text displayed");
        assertTrue(homePage.verifyLanguageForAppSettingsDescriptionDisplayed("Kannada"), "Verify if app settings description displayed");
        homePage.clickOnFifthDoneButton();
        assertEquals(homePage.getShareButton(), "ಹಂಚಿಕೊಳ್ಳಿ");
    }

    @Test
    public void downloadVcAndChnageLangaugeVerifyVcViaSunbird() throws InterruptedException {
        ChooseLanguagePage chooseLanguagePage = new ChooseLanguagePage(driver);

        assertTrue(chooseLanguagePage.isChooseLanguagePageLoaded(), "Verify if choose language page is displayed");
        WelcomePage welcomePage = chooseLanguagePage.clickOnSavePreference();

        assertTrue(welcomePage.isWelcomePageLoaded(), "Verify if welcome page is loaded");
        AppUnlockMethodPage appUnlockMethodPage = welcomePage.clickOnSkipButton();

        assertTrue(appUnlockMethodPage.isAppUnlockMethodPageLoaded(), "Verify if app unlocked page is displayed");
        SetPasscode setPasscode = appUnlockMethodPage.clickOnUsePasscode();

        assertTrue(setPasscode.isSetPassCodePageLoaded(), "Verify if set passcode page is displayed");
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.ANDROID);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.ANDROID);

        homePage.clickOnNextButtonForInjiTour();
        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        AddNewCardPage addNewCardPage = homePage.downloadCard();

        assertTrue(addNewCardPage.isAddNewCardPageLoaded(), "Verify if add new card page is displayed");
        assertTrue(addNewCardPage.isIssuerDescriptionEsignetDisplayed(), "Verify if issuer description  esignet displayed");
        assertTrue(addNewCardPage.isIssuerSearchBarDisplayed(), "Verify if issuer search bar displayed");
        assertTrue(addNewCardPage.isAddNewCardPageLoaded(), "Verify if add new card page is displayed");
        assertTrue(addNewCardPage.isAddNewCardPageGuideMessageForEsignetDisplayed(), "Verify if add new card guide message displayed");
        assertTrue(addNewCardPage.isDownloadViaSunbirdDisplayed(), "Verify if download sunbird displayed");
        SunbirdLoginPage sunbirdLoginPage = addNewCardPage.clickOnDownloadViaSunbird();
        addNewCardPage.clickOnCredentialTypeHeadingInsuranceCredential();

        sunbirdLoginPage.enterPolicyNumberTextBox(TestDataReader.readData("policyNumberSunbird"));
        sunbirdLoginPage.enterFullNameTextBox(TestDataReader.readData("fullNameSunbird"));
        sunbirdLoginPage.enterDateOfBirthTextBox();
        sunbirdLoginPage.clickOnloginButton();

        assertTrue(sunbirdLoginPage.isSunbirdCardIsActive(), "Verify if download sunbird displayed active");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        settingsPage.clickOnLanguage().clickOnHindiLanguage();

        assertTrue(settingsPage.verifyHindiLanguage(), "Verify if language is changed to hindi");
        homePage.clickOnHomeButton();

        assertTrue(sunbirdLoginPage.isSunbirdCardLogoIsDisplayed(), "Verify if download sunbird logo displayed");
        // assertEquals(sunbirdLoginPage.getFullNameForSunbirdCard(),TestDataReader.readData("fullNameSunbird"));
        sunbirdLoginPage.openDetailedSunbirdVcView();

        assertEquals(sunbirdLoginPage.getFullNameForSunbirdCard(), TestDataReader.readData("fullNameSunbird"));
        assertEquals(sunbirdLoginPage.getPolicyNameForSunbirdCard(), TestDataReader.readData("policyNameSunbird"));
        assertEquals(sunbirdLoginPage.getPhoneNumberForSunbirdCard(), TestDataReader.readData("phoneNumberSunbird"));
        assertEquals(sunbirdLoginPage.getDateofBirthValueForSunbirdCard(), TestDataReader.readData("dateOfBirthSunbird"));
        assertEquals(sunbirdLoginPage.getGenderValueForSunbirdCard(), TestDataReader.readData("genderValueSunbird"));
        assertEquals(sunbirdLoginPage.getEmailIdValueForSunbirdCard(), TestDataReader.readData("emailIdValueSunbird"));
        assertEquals(sunbirdLoginPage.getStatusValueForSunbirdCard(), "वैध");
        assertTrue(sunbirdLoginPage.isPolicyExpiresOnValueDisplayed(), "Verify if policy expireson value displayed");
        assertEquals(sunbirdLoginPage.getIdTypeValueForSunbirdCard(), TestDataReader.readData("idTypeSunbirdHindi"));
        sunbirdLoginPage.clickOnBackArrow();

        homePage.clickOnSettingIcon();
        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        UnlockApplicationPage unlockApplicationPage = settingsPage.clickOnLanguage().clickOnArabicLanguageButton();

        assertTrue(unlockApplicationPage.isUnlockApplicationPageLoadedInArabic(), "Verify if language is changed to arabic");
        unlockApplicationPage.clickOnUnlockApplicationButton();
        setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.ANDROID);
        assertTrue(sunbirdLoginPage.isStatusIconDisplayed(), "Verify if status icon displayed");
    }

    @Test
    public void DownloadAndVerifyVcInArabic() {
        ChooseLanguagePage chooseLanguagePage = new ChooseLanguagePage(driver);

        assertTrue(chooseLanguagePage.isChooseLanguagePageLoaded(), "Verify if choose language page is displayed");
        WelcomePage welcomePage = chooseLanguagePage.clickOnSavePreference();

        assertTrue(welcomePage.isWelcomePageLoaded(), "Verify if welcome page is loaded");
        AppUnlockMethodPage appUnlockMethodPage = welcomePage.clickOnSkipButton();

        assertTrue(appUnlockMethodPage.isAppUnlockMethodPageLoaded(), "Verify if app unlocked page is displayed");
        SetPasscode setPasscode = appUnlockMethodPage.clickOnUsePasscode();

        assertTrue(setPasscode.isSetPassCodePageLoaded(), "Verify if set passcode page is displayed");
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.ANDROID);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.ANDROID);

        homePage.clickOnNextButtonForInjiTour();
        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        UnlockApplicationPage unlockApplicationPage = settingsPage.clickOnLanguage().clickOnArabicLanguageButton();

        assertTrue(unlockApplicationPage.isUnlockApplicationPageLoadedInArabic(), "Verify if language is changed to arabic");
        unlockApplicationPage.clickOnUnlockApplicationButton();
        setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.ANDROID);
        AddNewCardPage addNewCardPage = homePage.downloadCard();

        assertEquals(addNewCardPage.verifyLanguageForAddNewCardGuideMessage(), "يرجى اختيار جهة الإصدار المفضلة لديك من الخيارات أدناه لإضافة بطاقة جديدة.");
        RetrieveIdPage retrieveIdPage = addNewCardPage.clickOnDownloadViaUin();
        String uin = TestDataReader.readData("uin");
        OtpVerificationPage otpVerification = retrieveIdPage.setEnterIdTextBox(uin).clickOnGenerateCardButton();

        assertTrue(otpVerification.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
        otpVerification.enterOtp(BaseTestCase.getOtp(), Target.ANDROID);

        DetailedVcViewPage detailedVcViewPage = homePage.openDetailedVcView();
        assertEquals(homePage.getFullNameValue(), "TEST_FULLNAMEara");
        assertEquals(homePage.GetActivationPendingHeaderText(), "التنشيط معلق لتسجيل الدخول عبر الإنترنت!");
    }

    @Test
    public void changeLanguageToHindiAndVerifyEsignetPage() {
        ChooseLanguagePage chooseLanguagePage = new ChooseLanguagePage(driver);

        assertTrue(chooseLanguagePage.isChooseLanguagePageLoaded(), "Verify if choose language page is displayed");
        WelcomePage welcomePage = chooseLanguagePage.clickOnSavePreference();

        assertTrue(welcomePage.isWelcomePageLoaded(), "Verify if welcome page is loaded");
        AppUnlockMethodPage appUnlockMethodPage = welcomePage.clickOnSkipButton();

        assertTrue(appUnlockMethodPage.isAppUnlockMethodPageLoaded(), "Verify if app unlocked page is displayed");
        SetPasscode setPasscode = appUnlockMethodPage.clickOnUsePasscode();

        assertTrue(setPasscode.isSetPassCodePageLoaded(), "Verify if set passcode page is displayed");
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.ANDROID);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.ANDROID);

        homePage.clickOnNextButtonForInjiTour();
        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        settingsPage.clickOnLanguage().clickOnHindiLanguage();

        assertTrue(settingsPage.verifyHindiLanguage(), "Verify if language is changed to hindi");
        homePage.clickOnHomeButton();

        assertEquals(homePage.verifyLanguageForNoVCDownloadedPageLoaded(), "अपनी डिजिटल आईडी लाओ");
        AddNewCardPage addNewCardPage = homePage.downloadCard();

        assertEquals(addNewCardPage.verifyLanguageForAddNewCardGuideMessage(), "नया कार्ड जोड़ने के लिए कृपया नीचे दिए गए विकल्पों में से अपना पसंदीदा जारीकर्ता चुनें।");
        assertTrue(addNewCardPage.isIssuerSearchBarDisplayedInHindi(), "verify if search bar is displayed in hindi");

        EsignetLoginPage esignetLoginPage = addNewCardPage.clickOnDownloadViaEsignet();
        esignetLoginPage.clickOnCredentialTypeHeadingMOSIPVerifiableCredential();
        esignetLoginPage.clickOnEsignetLoginWithOtpButton();
//        assertTrue(esignetLoginPage.verifyLanguageEnterUinOrVidBoxTextDisplayed("Hindi"),"verify if enter uin or vid text hindi");
        assertTrue(esignetLoginPage.verifyLanguageLoginHeaderTextDisplayed("Hindi"), "verify login text in hindi");
        assertTrue(esignetLoginPage.verifyLanguagePleaseEnterUinHeaderTextDisplayed("Hindi"), "verify if enter uin/vid header in hindi");
    }

    @Test
    public void changeLanguageToTamilAndVerifyEsignetPage() {
        ChooseLanguagePage chooseLanguagePage = new ChooseLanguagePage(driver);

        assertTrue(chooseLanguagePage.isChooseLanguagePageLoaded(), "Verify if choose language page is displayed");
        WelcomePage welcomePage = chooseLanguagePage.clickOnSavePreference();

        assertTrue(welcomePage.isWelcomePageLoaded(), "Verify if welcome page is loaded");
        AppUnlockMethodPage appUnlockMethodPage = welcomePage.clickOnSkipButton();

        assertTrue(appUnlockMethodPage.isAppUnlockMethodPageLoaded(), "Verify if app unlocked page is displayed");
        SetPasscode setPasscode = appUnlockMethodPage.clickOnUsePasscode();

        assertTrue(setPasscode.isSetPassCodePageLoaded(), "Verify if set passcode page is displayed");
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.ANDROID);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.ANDROID);

        homePage.clickOnNextButtonForInjiTour();
        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        settingsPage.clickOnLanguage().clickOnTamilLanguage();

        assertTrue(settingsPage.verifyTamilLanguage(), "Verify if language is changed to tamil");
        homePage.clickOnHomeButton();

        AddNewCardPage addNewCardPage = homePage.downloadCard();
        EsignetLoginPage esignetLoginPage = addNewCardPage.clickOnDownloadViaEsignet();
        esignetLoginPage.clickOnCredentialTypeHeadingMOSIPVerifiableCredential();
        esignetLoginPage.clickOnEsignetLoginWithOtpButton();
        assertTrue(esignetLoginPage.verifyLanguageLoginHeaderTextDisplayed("Tamil"), "verify login text in tamil");
        assertTrue(esignetLoginPage.verifyLanguagePleaseEnterUinHeaderTextDisplayed("Tamil"), "verify if enter uin/vid header in tamil");
    }

    @Test
    public void changeLanguageToKannadaAndVerifyEsignetPage() {
        ChooseLanguagePage chooseLanguagePage = new ChooseLanguagePage(driver);

        assertTrue(chooseLanguagePage.isChooseLanguagePageLoaded(), "Verify if choose language page is displayed");
        WelcomePage welcomePage = chooseLanguagePage.clickOnSavePreference();

        assertTrue(welcomePage.isWelcomePageLoaded(), "Verify if welcome page is loaded");
        AppUnlockMethodPage appUnlockMethodPage = welcomePage.clickOnSkipButton();

        assertTrue(appUnlockMethodPage.isAppUnlockMethodPageLoaded(), "Verify if app unlocked page is displayed");
        SetPasscode setPasscode = appUnlockMethodPage.clickOnUsePasscode();

        assertTrue(setPasscode.isSetPassCodePageLoaded(), "Verify if set passcode page is displayed");
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.ANDROID);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.ANDROID);

        homePage.clickOnNextButtonForInjiTour();
        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        settingsPage.clickOnLanguage().clickOnKannadaLanguage();

        assertTrue(settingsPage.verifyKannadaLanguage(), "Verify if language is changed to Kannada");
        homePage.clickOnHomeButton();

        AddNewCardPage addNewCardPage = homePage.downloadCard();
        EsignetLoginPage esignetLoginPage = addNewCardPage.clickOnDownloadViaEsignet();
        esignetLoginPage.clickOnCredentialTypeHeadingMOSIPVerifiableCredential();
        esignetLoginPage.clickOnEsignetLoginWithOtpButton();
        assertTrue(esignetLoginPage.verifyLanguageLoginHeaderTextDisplayed("Kannada"), "verify login text in Kannada");
        assertTrue(esignetLoginPage.verifyLanguagePleaseEnterUinHeaderTextDisplayed("Kannada"), "verify if enter uin/vid header in Kannada");

    }

    @Test
    public void changeLanguageToArabicAndVerifyEsignetPage() {
        ChooseLanguagePage chooseLanguagePage = new ChooseLanguagePage(driver);

        assertTrue(chooseLanguagePage.isChooseLanguagePageLoaded(), "Verify if choose language page is displayed");
        WelcomePage welcomePage = chooseLanguagePage.clickOnSavePreference();

        assertTrue(welcomePage.isWelcomePageLoaded(), "Verify if welcome page is loaded");
        AppUnlockMethodPage appUnlockMethodPage = welcomePage.clickOnSkipButton();

        assertTrue(appUnlockMethodPage.isAppUnlockMethodPageLoaded(), "Verify if app unlocked page is displayed");
        SetPasscode setPasscode = appUnlockMethodPage.clickOnUsePasscode();

        assertTrue(setPasscode.isSetPassCodePageLoaded(), "Verify if set passcode page is displayed");
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.ANDROID);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.ANDROID);

        homePage.clickOnNextButtonForInjiTour();
        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        settingsPage.clickOnLanguage().clickOnArabicLanguageButton();

        UnlockApplicationPage unlockApplicationPage = new UnlockApplicationPage(driver);
        assertTrue(unlockApplicationPage.isUnlockApplicationPageLoadedInArabic(), "Verify if language is changed to arabic");
        unlockApplicationPage.clickOnUnlockApplicationButton();
        setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.ANDROID);

        homePage.clickOnHomeButton();
        AddNewCardPage addNewCardPage = homePage.downloadCard();
        EsignetLoginPage esignetLoginPage = addNewCardPage.clickOnDownloadViaEsignet();
        esignetLoginPage.clickOnCredentialTypeHeadingMOSIPVerifiableCredential();
        esignetLoginPage.clickOnEsignetLoginWithOtpButton();
        assertTrue(esignetLoginPage.verifyLanguageLoginHeaderTextDisplayed("Arabic"), "verify login text in arabic");
        assertTrue(esignetLoginPage.verifyLanguagePleaseEnterUinHeaderTextDisplayed("Arabic"), "verify if enter uin/vid header in arabic");

    }

    @Test
    public void changeLanguageToFillipineAndVerifyEsignetPage() {
        ChooseLanguagePage chooseLanguagePage = new ChooseLanguagePage(driver);

        assertTrue(chooseLanguagePage.isChooseLanguagePageLoaded(), "Verify if choose language page is displayed");
        WelcomePage welcomePage = chooseLanguagePage.clickOnSavePreference();

        assertTrue(welcomePage.isWelcomePageLoaded(), "Verify if welcome page is loaded");
        AppUnlockMethodPage appUnlockMethodPage = welcomePage.clickOnSkipButton();

        assertTrue(appUnlockMethodPage.isAppUnlockMethodPageLoaded(), "Verify if app unlocked page is displayed");
        SetPasscode setPasscode = appUnlockMethodPage.clickOnUsePasscode();

        assertTrue(setPasscode.isSetPassCodePageLoaded(), "Verify if set passcode page is displayed");
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.ANDROID);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.ANDROID);

        homePage.clickOnNextButtonForInjiTour();
        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        settingsPage.clickOnLanguage().clickOnKannadaLanguage();

        assertTrue(settingsPage.verifyKannadaLanguage(), "Verify if language is changed to Kannada");
        homePage.clickOnHomeButton();

        AddNewCardPage addNewCardPage = homePage.downloadCard();
        EsignetLoginPage esignetLoginPage = addNewCardPage.clickOnDownloadViaEsignet();
        esignetLoginPage.clickOnCredentialTypeHeadingMOSIPVerifiableCredential();
        esignetLoginPage.clickOnEsignetLoginWithOtpButton();
        assertTrue(esignetLoginPage.verifyLanguageLoginHeaderTextDisplayed("Kannada"), "verify login text in Kannada");
        assertTrue(esignetLoginPage.verifyLanguagePleaseEnterUinHeaderTextDisplayed("Kannada"), "verify if enter uin/vid header in Kannada");

        esignetLoginPage.clickOnCloseButton();
        addNewCardPage.clickOnBack();
        homePage.clickOnNextButtonForInjiTour();
        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");

        homePage.clickOnSettingIcon();
        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        settingsPage.clickOnLanguage().clickOnFilipinoLanguage();

        homePage.clickOnHomeButton();
        homePage.downloadCard();
        addNewCardPage.clickOnDownloadViaEsignet();
        esignetLoginPage.clickOnCredentialTypeHeadingMOSIPVerifiableCredential();
        esignetLoginPage.clickOnEsignetLoginWithOtpButton();
        assertTrue(esignetLoginPage.verifyLanguageLoginHeaderTextDisplayed("Kannada"), "verify login text in Kannada");
        assertTrue(esignetLoginPage.verifyLanguagePleaseEnterUinHeaderTextDisplayed("Kannada"), "verify if enter uin/vid header in Kannada");
    }

    @Test
    public void changeLanguageFromKannadaToEnglishAndVerifyEsignetPage() {
        ChooseLanguagePage chooseLanguagePage = new ChooseLanguagePage(driver);

        assertTrue(chooseLanguagePage.isChooseLanguagePageLoaded(), "Verify if choose language page is displayed");
        WelcomePage welcomePage = chooseLanguagePage.clickOnSavePreference();

        assertTrue(welcomePage.isWelcomePageLoaded(), "Verify if welcome page is loaded");
        AppUnlockMethodPage appUnlockMethodPage = welcomePage.clickOnSkipButton();

        assertTrue(appUnlockMethodPage.isAppUnlockMethodPageLoaded(), "Verify if app unlocked page is displayed");
        SetPasscode setPasscode = appUnlockMethodPage.clickOnUsePasscode();

        assertTrue(setPasscode.isSetPassCodePageLoaded(), "Verify if set passcode page is displayed");
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.ANDROID);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.ANDROID);

        homePage.clickOnNextButtonForInjiTour();
        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        settingsPage.clickOnLanguage().clickOnKannadaLanguage();

        assertTrue(settingsPage.verifyKannadaLanguage(), "Verify if language is changed to Kannada");
        homePage.clickOnHomeButton();

        AddNewCardPage addNewCardPage = homePage.downloadCard();
        EsignetLoginPage esignetLoginPage = addNewCardPage.clickOnDownloadViaEsignet();
        esignetLoginPage.clickOnCredentialTypeHeadingMOSIPVerifiableCredential();
        esignetLoginPage.clickOnEsignetLoginWithOtpButton();
        assertTrue(esignetLoginPage.verifyLanguageLoginHeaderTextDisplayed("Kannada"), "verify login text in Kannada");
        assertTrue(esignetLoginPage.verifyLanguagePleaseEnterUinHeaderTextDisplayed("Kannada"), "verify if enter uin/vid header in Kannada");

        esignetLoginPage.clickOnCloseButton();
        addNewCardPage.clickOnBack();
        homePage.clickOnNextButtonForInjiTour();
        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");

        homePage.clickOnSettingIcon();
        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        settingsPage.clickOnLanguage().clickOnEnglishLanguage();

        homePage.clickOnHomeButton();
        homePage.downloadCard();
        addNewCardPage.clickOnDownloadViaEsignet();
        esignetLoginPage.clickOnCredentialTypeHeadingMOSIPVerifiableCredential();
        esignetLoginPage.clickOnEsignetLoginWithOtpButton();
        assertTrue(esignetLoginPage.verifyLanguageLoginHeaderTextDisplayed("English"), "verify login text in english");
        assertTrue(esignetLoginPage.verifyLanguagePleaseEnterUinHeaderTextDisplayed("English"), "verify if enter uin/vid header in english");
    }

}
