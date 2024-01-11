package iosTestCases;

import BaseTest.IosBaseTest;
import inji.constants.Target;
import inji.pages.*;
import inji.utils.TestDataReader;
import org.testng.annotations.Test;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertTrue;

public class ChangeLanguageTest extends IosBaseTest {

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
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.IOS);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.IOS);

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
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.IOS);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.IOS);

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        settingsPage.clickOnLanguage();

        assertTrue(settingsPage.verifyLanguagesInLanguageFilter(), "Verify if all languages are shown in language filter");
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
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.IOS);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.IOS);

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
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.IOS);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.IOS);

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        UnlockApplicationPage unlockApplicationPage = settingsPage.clickOnLanguage().clickOnArabicLanguageButton();

        assertTrue(unlockApplicationPage.isUnlockApplicationPageLoadedInArabic(), "Verify if language is changed to arabic");
        unlockApplicationPage.clickOnUnlockApplicationButton();
        setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.IOS);
        HistoryPage historyPage = homePage.clickOnHistoryButton();
        
        assertTrue(historyPage.noHistoryAvailable(),"verify no history available in arabic");
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
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.IOS);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.IOS);

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        settingsPage.clickOnLanguage().clickOnFilipinoLanguage();

        assertTrue(settingsPage.verifyFilipinoLanguage(), "Verify if language is changed to filipino");
        settingsPage.clickOnBackArrow();

        assertTrue(homePage.verifyLanguageForNoVCDownloadedPageLoaded("Filipino"),"Verify if bring your digital id text is visible in filipino");
        AddNewCardPage addNewCardPage = homePage.downloadCard();

        assertTrue(addNewCardPage.verifyLanguageForAddNewCardGuideMessage("Filipino"),"verify if add new card guide message displayed in filipino");
        assertTrue(addNewCardPage.isIssuerSearchBarDisplayedInFilipino(),"verify if search bar is displayed in filipino");
        addNewCardPage.sendTextInIssuerSearchBar("uin");

        assertTrue(addNewCardPage.isDownloadViaUinDisplayed(),"verify if download via uin vid aid");
        addNewCardPage.clickOnBack();

        homePage.downloadCard();
        addNewCardPage.sendTextInIssuerSearchBar("e-signet");
        assertTrue(addNewCardPage.isDownloadViaEsignetDisplayed(),"verify if download via e-signet is displayed");
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
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.IOS);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.IOS);

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        settingsPage.clickOnLanguage().clickOnFilipinoLanguage();

        assertTrue(settingsPage.verifyFilipinoLanguage(), "Verify if language is changed to filipino");
        settingsPage.clickOnBackArrow();
        
        assertTrue(homePage.verifyLanguageForNoVCDownloadedPageLoaded("Filipino"),"Verify if bring your digital id text is visible in filipino");
        AddNewCardPage addNewCardPage = homePage.downloadCard();
        
        assertTrue(addNewCardPage.isAddNewCardGuideMessageDisplayedInFillopin(),"verify if add new card guide message displayed in filipino");
        assertTrue(addNewCardPage.isIssuerSearchBarDisplayedInFilipino(),"verify if search bar is displayed in filipino");
        addNewCardPage.sendTextInIssuerSearchBar("ui");
        
        assertTrue(addNewCardPage.isDownloadViaUinDisplayed(),"verify if download via uin vid aid");
        addNewCardPage.clickOnBack();
        
        homePage.downloadCard();
        addNewCardPage.sendTextInIssuerSearchBar("e-si");
        assertTrue(addNewCardPage.isDownloadViaEsignetDisplayed(),"verify if download via e-signet is displayed");
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
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.IOS);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.IOS);

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        settingsPage.clickOnLanguage().clickOnHindiLanguage();

        assertTrue(settingsPage.verifyHindiLanguage(), "Verify if language is changed to hindi");
        settingsPage.clickOnBackArrow();
        
        assertTrue(homePage.verifyLanguageForNoVCDownloadedPageLoaded("Hindi"),"Verify if bring your digital id text is visible in hindi");
        AddNewCardPage addNewCardPage = homePage.downloadCard();
        
        assertTrue(addNewCardPage.verifyLanguageForAddNewCardGuideMessage("Hindi"),"verify if add new card guide message displayed in hindi");
        assertTrue(addNewCardPage.isIssuerSearchBarDisplayedInHindi(),"verify if search bar is displayed in hindi");
        addNewCardPage.sendTextInIssuerSearchBar("uin");
        
        assertTrue(addNewCardPage.isDownloadViaUinDisplayedInHindi(),"verify if download via uin vid aid displayed in hindi");
        addNewCardPage.clickOnBack();
        
        homePage.downloadCard();
        
        addNewCardPage.sendTextInIssuerSearchBar("ई-हस्ताक्षर");
        assertTrue(addNewCardPage.isDownloadViaEsignetDisplayedInHindi(),"verify if download via e-signet is displayed");
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
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.IOS);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.IOS);

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        settingsPage.clickOnLanguage().clickOnFilipinoLanguage();

        assertTrue(settingsPage.verifyFilipinoLanguage(), "Verify if language is changed to filipino");
        
        settingsPage.clickOnInjiTourGuide();

        assertTrue(welcomePage.verifyLanguageforWelcomePageLoaded("Filipino"), "Verify if welcome page is loaded");
        assertEquals(welcomePage.getWelcomeDescription(), "Ibahagi at tumanggap ng card nang mabilis gamit ang camera ng iyong telepono upang mag-scan ng mga QR code");
        welcomePage.clickOnNextButton();

        TrustedDigitalWalletPage trustedDigitalWalletPage = new TrustedDigitalWalletPage(driver);
        assertTrue(trustedDigitalWalletPage.verifyLanguageforTrustedDigitalWalletPageLoaded("Filipino"), "Verify if trusted digital wallet page is loaded");
        assertEquals(trustedDigitalWalletPage.getTrustedDigitalWalletDescription(), "Panatilihin ang iyong digital na kredensyal sa iyo sa lahat ng oras");
        trustedDigitalWalletPage.clickOnNextButton();

        SecureSharingPage secureSharingPage = new SecureSharingPage(driver);
        assertTrue(secureSharingPage.verifyLanguageforSecureSharingPageLoaded("Filipino"), "Verify if secure sharing page is loaded");
        assertEquals(secureSharingPage.getSecureSharingDescription(), "Kapag nabuo na, ang card ay ligtas na iniimbak sa iyong mobile.");
        secureSharingPage.clickOnNextButton();

        HassleFreeAuthenticationPage hassleFreeAuthenticationPage = new HassleFreeAuthenticationPage(driver);
        assertTrue(hassleFreeAuthenticationPage.verifyLanguageforHassleFreeAuthenticationPageLoaded("Filipino"), "Verify if hassle free authentication page is loaded");
        assertEquals(hassleFreeAuthenticationPage.getHassleFreeAuthenticationDescription(), "I-authenticate ang iyong sarili nang madali gamit ang nakaimbak na digital na kredensyal.");
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
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.IOS);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.IOS);

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        settingsPage.clickOnLanguage().clickOnHindiLanguage();

        assertTrue(settingsPage.verifyHindiLanguage(), "Verify if language is changed to hindi");
        
        settingsPage.clickOnInjiTourGuide();

        assertTrue(welcomePage.verifyLanguageforWelcomePageLoaded("Hindi"), "Verify if welcome page is loaded");
        assertEquals(welcomePage.getWelcomeDescription(), "अपना डिजिटल क्रेडेंशियल हर समय अपने पास रखें। इंजी आपको उन्हें प्रभावी ढंग से प्रबंधित करने और उपयोग करने में मदद करता है। आरंभ करने के लिए, अपनी प्रोफ़ाइल में कार्ड जोड़ें।");
        welcomePage.clickOnNextButton();

        TrustedDigitalWalletPage trustedDigitalWalletPage = new TrustedDigitalWalletPage(driver);
        assertTrue(trustedDigitalWalletPage.verifyLanguageforTrustedDigitalWalletPageLoaded("Hindi"), "Verify if trusted digital wallet page is loaded");
        assertEquals(trustedDigitalWalletPage.getTrustedDigitalWalletDescription(), "अपने सभी महत्वपूर्ण कार्डों को एक ही विश्वसनीय वॉलेट में रखें और रखें।");
        trustedDigitalWalletPage.clickOnNextButton();

        SecureSharingPage secureSharingPage = new SecureSharingPage(driver);
        assertTrue(secureSharingPage.verifyLanguageforSecureSharingPageLoaded("Hindi"), "Verify if secure sharing page is loaded");
        assertEquals(secureSharingPage.getSecureSharingDescription(), "परेशानी मुक्त तरीके से अपने कार्ड सुरक्षित रूप से साझा करें और विभिन्न सेवाओं का लाभ उठाएं।");
        secureSharingPage.clickOnNextButton();

        HassleFreeAuthenticationPage hassleFreeAuthenticationPage = new HassleFreeAuthenticationPage(driver);
        assertTrue(hassleFreeAuthenticationPage.verifyLanguageforHassleFreeAuthenticationPageLoaded("Hindi"), "Verify if hassle free authentication page is loaded");
        assertEquals(hassleFreeAuthenticationPage.getHassleFreeAuthenticationDescription(), "संग्रहीत डिजिटल क्रेडेंशियल का उपयोग करके आसानी से स्वयं को प्रमाणित करें।");
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
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.IOS);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.IOS);

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        settingsPage.clickOnLanguage().clickOnTamilLanguage();

        assertTrue(settingsPage.verifyTamilLanguage(), "Verify if language is changed to tamil");
        
        settingsPage.clickOnInjiTourGuide();

        assertTrue(welcomePage.verifyLanguageforWelcomePageLoaded("Tamil"), "Verify if welcome page is loaded");
        assertEquals(welcomePage.getWelcomeDescription(), "உங்கள் டிஜிட்டல் நற்சான்றிதழை எப்போதும் உங்களுடன் வைத்திருக்கவும். அவற்றை திறம்பட நிர்வகிக்கவும் பயன்படுத்தவும் இன்ஜி உதவுகிறது. தொடங்குவதற்கு, உங்கள் சுயவிவரத்தில் கார்டுகளைச் சேர்க்கவும்.");
        welcomePage.clickOnNextButton();

        TrustedDigitalWalletPage trustedDigitalWalletPage = new TrustedDigitalWalletPage(driver);
        assertTrue(trustedDigitalWalletPage.verifyLanguageforTrustedDigitalWalletPageLoaded("Tamil"), "Verify if trusted digital wallet page is loaded");
        assertEquals(trustedDigitalWalletPage.getTrustedDigitalWalletDescription(), "உங்கள் முக்கியமான கார்டுகளை ஒரே நம்பகமான பணப்பையில் சேமித்து எடுத்துச் செல்லுங்கள்.");
        trustedDigitalWalletPage.clickOnNextButton();

        SecureSharingPage secureSharingPage = new SecureSharingPage(driver);
        assertTrue(secureSharingPage.verifyLanguageforSecureSharingPageLoaded("Tamil"), "Verify if secure sharing page is loaded");
        assertEquals(secureSharingPage.getSecureSharingDescription(), "தொந்தரவு இல்லாத வகையில் உங்கள் கார்டுகளைப் பாதுகாப்பாகப் பகிர்ந்து, பல்வேறு சேவைகளைப் பெறுங்கள்.");
        secureSharingPage.clickOnNextButton();

        HassleFreeAuthenticationPage hassleFreeAuthenticationPage = new HassleFreeAuthenticationPage(driver);
        assertTrue(hassleFreeAuthenticationPage.verifyLanguageforHassleFreeAuthenticationPageLoaded("Tamil"), "Verify if hassle free authentication page is loaded");
        assertEquals(hassleFreeAuthenticationPage.getHassleFreeAuthenticationDescription(), "சேமிக்கப்பட்ட டிஜிட்டல் நற்சான்றிதழைப் பயன்படுத்தி உங்களை எளிதாக அங்கீகரிக்கவும்.");
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
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.IOS);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.IOS);

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        settingsPage.clickOnLanguage().clickOnKannadaLanguage();

        assertTrue(settingsPage.verifyKannadaLanguage(), "Verify if language is changed to kannada");
        
        settingsPage.clickOnInjiTourGuide();

        assertTrue(welcomePage.verifyLanguageforWelcomePageLoaded("Kannada"), "Verify if welcome page is loaded");
        assertEquals(welcomePage.getWelcomeDescription(), "ನಿಮ್ಮ ಡಿಜಿಟಲ್ ರುಜುವಾತುಗಳನ್ನು ಯಾವಾಗಲೂ ನಿಮ್ಮೊಂದಿಗೆ ಇರಿಸಿಕೊಳ್ಳಿ. ಅವುಗಳನ್ನು ಪರಿಣಾಮಕಾರಿಯಾಗಿ ನಿರ್ವಹಿಸಲು ಮತ್ತು ಬಳಸಲು ಇಂಜಿ ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ. ಪ್ರಾರಂಭಿಸಲು, ನಿಮ್ಮ ಪ್ರೊಫೈಲ್‌ಗೆ ಕಾರ್ಡ್‌ಗಳನ್ನು ಸೇರಿಸಿ.");
        welcomePage.clickOnNextButton();

        TrustedDigitalWalletPage trustedDigitalWalletPage = new TrustedDigitalWalletPage(driver);
        assertTrue(trustedDigitalWalletPage.verifyLanguageforTrustedDigitalWalletPageLoaded("Kannada"), "Verify if trusted digital wallet page is loaded");
        assertEquals(trustedDigitalWalletPage.getTrustedDigitalWalletDescription(), "ನಿಮ್ಮ ಎಲ್ಲಾ ಪ್ರಮುಖ ಕಾರ್ಡ್‌ಗಳನ್ನು ಒಂದೇ ವಿಶ್ವಾಸಾರ್ಹ ವ್ಯಾಲೆಟ್‌ನಲ್ಲಿ ಸಂಗ್ರಹಿಸಿ ಮತ್ತು ಒಯ್ಯಿರಿ.");
        trustedDigitalWalletPage.clickOnNextButton();

        SecureSharingPage secureSharingPage = new SecureSharingPage(driver);
        assertTrue(secureSharingPage.verifyLanguageforSecureSharingPageLoaded("Kannada"), "Verify if secure sharing page is loaded");
        assertEquals(secureSharingPage.getSecureSharingDescription(), "ನಿಮ್ಮ ಕಾರ್ಡ್‌ಗಳನ್ನು ಜಗಳ ಮುಕ್ತ ರೀತಿಯಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿ ಹಂಚಿಕೊಳ್ಳಿ ಮತ್ತು ವಿವಿಧ ಸೇವೆಗಳನ್ನು ಪಡೆದುಕೊಳ್ಳಿ.");
        secureSharingPage.clickOnNextButton();

        HassleFreeAuthenticationPage hassleFreeAuthenticationPage = new HassleFreeAuthenticationPage(driver);
        assertTrue(hassleFreeAuthenticationPage.verifyLanguageforHassleFreeAuthenticationPageLoaded("Kannada"), "Verify if hassle free authentication page is loaded");
        assertEquals(hassleFreeAuthenticationPage.getHassleFreeAuthenticationDescription(), "ಸಂಗ್ರಹಿಸಿದ ಡಿಜಿಟಲ್ ರುಜುವಾತುಗಳನ್ನು ಬಳಸಿಕೊಂಡು ಸುಲಭವಾಗಿ ನಿಮ್ಮನ್ನು ದೃಢೀಕರಿಸಿ.");
    }

    
}
