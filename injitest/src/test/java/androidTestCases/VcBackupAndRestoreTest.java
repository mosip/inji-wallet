package androidTestCases;

import BaseTest.AndroidBaseTest;
import inji.api.BaseTestCase;
import inji.constants.Target;
import inji.pages.*;
import inji.utils.IosUtil;
import inji.utils.TestDataReader;
import org.testng.annotations.Test;

import static org.testng.Assert.*;

public class VcBackupAndRestoreTest extends AndroidBaseTest {
    @Test
    public void VcBackupAndRestoreTest() throws InterruptedException {
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

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        AddNewCardPage addNewCardPage = homePage.downloadCard();
        RetrieveIdPage retrieveIdPage = addNewCardPage.clickOnDownloadViaUin();
        String uin=TestDataReader.readData("uin");
        OtpVerificationPage otpVerification = retrieveIdPage.setEnterIdTextBox(uin).clickOnGenerateCardButton();

        otpVerification.enterOtp(BaseTestCase.getOtp(), Target.ANDROID);
        
        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isdataBackupAndRestoreDisplayed(), "Verify if backup & restore displayed");
        assertTrue(settingsPage.isNewlableDisplayed(), "Verify if backup & restore new tag displayed");
        BackupAndRestorePage backupAndRestorePage = settingsPage.clickOnDataBackupAndRestoreButton();

        assertTrue(backupAndRestorePage.isBackupProcessInfoDisplayed(), "Verify if backup information displayed");
        assertTrue(backupAndRestorePage.isCloudInfoDisplayed(), "Verify if cloud information displayed");
        backupAndRestorePage.clickOnProceedButton();

       //backupAndRestorePage.clickOnAddAnotherAccount();
        String email = TestDataReader.readData("emailsForBackupAndRestore");
        backupAndRestorePage.enterEmailTextBox(email);
        backupAndRestorePage.clickOnNextButton();
        backupAndRestorePage.enterPasswordTextBox(TestDataReader.readData("emailPassword"));
        backupAndRestorePage.clickOnNextButton();
        backupAndRestorePage.clickOnAgreeButton();

        assertTrue(backupAndRestorePage.isLastBackupSectionHeaderDisplayed(), "Verify if last backup section displayed");
        backupAndRestorePage.clickOnBackUpButton();

        assertTrue(backupAndRestorePage.isAccountSectionHeaderDisplayed(), "Verify if account section header displayed");
        assertTrue(backupAndRestorePage.isStorageInfoDisplayed(), "Verify if account storage info displayed");
        assertTrue(backupAndRestorePage.isAssociatedAccountDisplayed(), "Verify if associated account displayed");
        assertTrue(backupAndRestorePage.islastBackupTimeDisplayed(), "Verify if last backup time displayed");
//        assertTrue(backupAndRestorePage.isDataBackupSuccessPopupDisplayed(), "Verify if backup successful popup displayed");
        backupAndRestorePage.clickOnCloseButton();

        backupAndRestorePage.clickOnArrowLeftButton();
        assertFalse(settingsPage.isNewlableDisplayed(), "Verify if new tag is removed");
        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        backupAndRestorePage.clickOnArrowLeftButton();


        MoreOptionsPage moreOptionsPage = homePage.clickOnMoreOptionsButton();
        assertTrue(moreOptionsPage.isMoreOptionsPageLoaded(), "Verify if more options page is displayed");

        PleaseConfirmPopupPage pleaseConfirmPopupPage = moreOptionsPage.clickOnRemoveFromWallet();
        assertTrue(pleaseConfirmPopupPage.isPleaseConfirmPopupPageLoaded(), "Verify if pop up page is displayed");

        pleaseConfirmPopupPage.clickOnConfirmButton();
        assertEquals(homePage.verifyLanguageForNoVCDownloadedPageLoaded(), "Bring your digital identity");

        homePage.clickOnSettingIcon();
        settingsPage.clickOnDataBackupAndRestoreButton();
        backupAndRestorePage.clickOnRestoreButton();

        assertTrue(backupAndRestorePage.isRestoreSectionHeaderDisplayed(), " Verify is restore backup successful popup displayed");
//         assertTrue(backupAndRestorePage.isRestoreBackupSuccessPopUpDisplayed(), " Verify is restore backup successful popup displayed");
        backupAndRestorePage.clickOnCloseButton();
        backupAndRestorePage.clickOnArrowLeftButton();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        backupAndRestorePage.clickOnArrowLeftButton();

        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");
        assertEquals(homePage.GetActivationPendingText(), "Activation pending for online login");
    }

    @Test
    public void DenyPermissionForInji() throws InterruptedException {
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

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        AddNewCardPage addNewCardPage = homePage.downloadCard();
        RetrieveIdPage retrieveIdPage = addNewCardPage.clickOnDownloadViaUin();
        String uin=TestDataReader.readData("uin");
        OtpVerificationPage otpVerification = retrieveIdPage.setEnterIdTextBox(uin).clickOnGenerateCardButton();

        otpVerification.enterOtp(BaseTestCase.getOtp(), Target.ANDROID);

        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isdataBackupAndRestoreDisplayed(), "Verify if backup & restore displayed");
        assertTrue(settingsPage.isNewlableDisplayed(), "Verify if backup & restore new tag displayed");
        BackupAndRestorePage backupAndRestorePage = settingsPage.clickOnDataBackupAndRestoreButton();

        assertTrue(backupAndRestorePage.isBackupProcessInfoDisplayed(), "Verify if backup information displayed");
        assertTrue(backupAndRestorePage.isCloudInfoDisplayed(), "Verify if cloud information displayed");
        backupAndRestorePage.clickOnGoBackButton();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page displayed");
        settingsPage.clickOnDataBackupAndRestoreButton();
        backupAndRestorePage.clickOnProceedButton();

     //   backupAndRestorePage.clickOnAddAnotherAccount();
        String denyMail= TestDataReader.readData("denyEmailId");
        backupAndRestorePage.enterEmailTextBox(denyMail);
        backupAndRestorePage.clickOnNextButton();
        backupAndRestorePage.enterPasswordTextBox(TestDataReader.readData("denyEmailPassword"));
        backupAndRestorePage.clickOnNextButton();

        backupAndRestorePage.clickOnAgreeButton();
        Thread.sleep(3000);
        backupAndRestorePage.clickOnCancelButton();

        assertTrue(backupAndRestorePage.isPermissionDeniedHeaderDisplayed(), "Verify if permission Denied displayed");
        assertTrue(backupAndRestorePage.isErrorMessageDescriptionDisplayed(), "Verify if permission Denied description displayed");

        backupAndRestorePage.clickOnAllowAccessButton();
        assertTrue(backupAndRestorePage.isChooseAccountHeaderDisplayed(), "Verify if redirect to google account page");

    }

    @Test
    public void RestoreVcTwoTimes() throws InterruptedException {
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

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        AddNewCardPage addNewCardPage = homePage.downloadCard();
        RetrieveIdPage retrieveIdPage = addNewCardPage.clickOnDownloadViaUin();
        String uin=TestDataReader.readData("uin");
        OtpVerificationPage otpVerification = retrieveIdPage.setEnterIdTextBox(uin).clickOnGenerateCardButton();

        otpVerification.enterOtp(BaseTestCase.getOtp(), Target.ANDROID);

        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isdataBackupAndRestoreDisplayed(), "Verify if backup & restore displayed");
        assertTrue(settingsPage.isNewlableDisplayed(), "Verify if backup & restore new tag displayed");
        BackupAndRestorePage backupAndRestorePage = settingsPage.clickOnDataBackupAndRestoreButton();

        assertTrue(backupAndRestorePage.isBackupProcessInfoDisplayed(), "Verify if backup information displayed");
        assertTrue(backupAndRestorePage.isCloudInfoDisplayed(), "Verify if cloud information displayed");
        backupAndRestorePage.clickOnProceedButton();

//        backupAndRestorePage.clickOnAddAnotherAccount();
        String email = TestDataReader.readData("emailsForBackupAndRestore");
        backupAndRestorePage.enterEmailTextBox(email);
        backupAndRestorePage.clickOnNextButton();
        backupAndRestorePage.enterPasswordTextBox(TestDataReader.readData("emailPassword"));
        backupAndRestorePage.clickOnNextButton();
        backupAndRestorePage.clickOnAgreeButton();

        assertTrue(backupAndRestorePage.isLastBackupSectionHeaderDisplayed(), "Verify if last backup section displayed");
        assertTrue(backupAndRestorePage.isRestoreSectionHeaderDisplayed(), " Verify is restore backup successful popup displayed");
//        assertTrue(backupAndRestorePage.isRestoreBackupSuccessPopUpDisplayed(), " Verify is restore backup successful popup displayed");
//        backupAndRestorePage.clickOnCloseButton();
        Thread.sleep(5000);
        backupAndRestorePage.clickOnRestoreButton();
        assertTrue(backupAndRestorePage.isRestoreBackupSuccessPopUpDisplayed(), " Verify is restore backup successful popup displayed");
        backupAndRestorePage.clickOnCloseButton();

        backupAndRestorePage.clickOnRestoreButton();
        backupAndRestorePage.clickOnCloseButton();

        backupAndRestorePage.clickOnArrowLeftButton();
        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        backupAndRestorePage.clickOnArrowLeftButton();


        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");
        assertTrue(homePage.isSecondNameDisplayed(TestDataReader.readData("fullName")), "Verify if second vc full name is displayed");
        assertEquals(homePage.GetActivationPendingText(), "Activation pending for online login");
    }

    @Test
    public void VcRestoreWithoutBackup() throws InterruptedException {
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

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isdataBackupAndRestoreDisplayed(), "Verify if backup & restore displayed");
        assertTrue(settingsPage.isNewlableDisplayed(), "Verify if backup & restore new tag displayed");
        BackupAndRestorePage backupAndRestorePage = settingsPage.clickOnDataBackupAndRestoreButton();

        assertTrue(backupAndRestorePage.isBackupProcessInfoDisplayed(), "Verify if backup information displayed");
        assertTrue(backupAndRestorePage.isCloudInfoDisplayed(), "Verify if cloud information displayed");
        backupAndRestorePage.clickOnProceedButton();

//        backupAndRestorePage.clickOnAddAnotherAccount();
        String mailWithNoBackup= TestDataReader.readData("noBackupMail");
        backupAndRestorePage.enterEmailTextBox(mailWithNoBackup);
        backupAndRestorePage.clickOnNextButton();
        backupAndRestorePage.enterPasswordTextBox(TestDataReader.readData("emailPassword"));
        backupAndRestorePage.clickOnNextButton();
        backupAndRestorePage.clickOnAgreeButton();

        backupAndRestorePage.clickOnRestoreButton();

        assertTrue(backupAndRestorePage.isRestoreFailurePopupHeaderDisplayed(), " Verify is restore failure popup displayed");
    }

    @Test
    public void VerifyBackUpAndRestorePageInMultipleLanguge() throws InterruptedException {
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

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        AddNewCardPage addNewCardPage = homePage.downloadCard();
        RetrieveIdPage retrieveIdPage = addNewCardPage.clickOnDownloadViaUin();
        String uin=TestDataReader.readData("uin");
        OtpVerificationPage otpVerification = retrieveIdPage.setEnterIdTextBox(uin).clickOnGenerateCardButton();

        otpVerification.enterOtp(BaseTestCase.getOtp(), Target.ANDROID);

        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isdataBackupAndRestoreDisplayed(), "Verify if backup & restore displayed");
        assertTrue(settingsPage.isNewlableDisplayed(), "Verify if backup & restore new tag displayed");
        BackupAndRestorePage backupAndRestorePage = settingsPage.clickOnDataBackupAndRestoreButton();

        assertTrue(backupAndRestorePage.isBackupProcessInfoDisplayed(), "Verify if backup information displayed");
        assertTrue(backupAndRestorePage.isCloudInfoDisplayed(), "Verify if cloud information displayed");
        backupAndRestorePage.clickOnProceedButton();

//        backupAndRestorePage.clickOnAddAnotherAccount();
        String email = TestDataReader.readData("emailsForBackupAndRestore");
        backupAndRestorePage.enterEmailTextBox(email);
        backupAndRestorePage.clickOnNextButton();
        backupAndRestorePage.enterPasswordTextBox(TestDataReader.readData("emailPassword"));
        backupAndRestorePage.clickOnNextButton();
        backupAndRestorePage.clickOnAgreeButton();
        Thread.sleep(3000);

        assertTrue(backupAndRestorePage.isLastBackupSectionHeaderDisplayed(), "Verify if last backup section displayed");
        backupAndRestorePage.clickOnBackUpButton();

        assertTrue(backupAndRestorePage.isAccountSectionHeaderDisplayed(), "Verify if account section header displayed");
        assertTrue(backupAndRestorePage.isStorageInfoDisplayed(), "Verify if account storage info displayed");
        assertTrue(backupAndRestorePage.isAssociatedAccountDisplayed(), "Verify if associated account displayed");
        assertTrue(backupAndRestorePage.islastBackupTimeDisplayed(), "Verify if last backup time displayed");
//        assertTrue(backupAndRestorePage.isDataBackupSuccessPopupDisplayed(), "Verify if backup successful popup displayed");
        backupAndRestorePage.clickOnCloseButton();


        assertTrue(backupAndRestorePage.isRestoreSectionHeaderDisplayed(), " Verify is restore backup successful popup displayed");
        backupAndRestorePage.clickOnArrowLeftButton();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");

        settingsPage.clickOnLanguage().clickOnFilipinoLanguage();
        assertTrue(settingsPage.verifyFilipinoLanguage(), "Verify if language is changed to filipino");
        settingsPage.clickOnDataBackupAndRestoreButton();

        assertEquals(backupAndRestorePage.getLastBackupSectionHeaderText(), "Mga Detalye ng Huling Backup");
        assertEquals(backupAndRestorePage.getAccountSectionHeaderText(), "Mga Setting ng Google Drive");
        assertEquals(backupAndRestorePage.getStorageInfoText(), "Ang backup ay maiimbak sa Google Drive na nauugnay sa iyong napiling gmail account.");

        backupAndRestorePage.clickOnRestoreButton();
//         assertTrue(backupAndRestorePage.isRestoreBackupSuccessPopUpDisplayed(), " Verify is restore backup successful popup displayed");
        backupAndRestorePage.clickOnCloseButton();

        backupAndRestorePage.clickOnArrowLeftButton();
        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");

        UnlockApplicationPage unlockApplicationPage =  settingsPage.clickOnLanguage().clickOnArabicLanguageButton();

        assertTrue(unlockApplicationPage.isUnlockApplicationPageLoadedInArabic(), "Verify if language is changed to arabic");
        unlockApplicationPage.clickOnUnlockApplicationButton();
        setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.ANDROID);

        //arabic
        homePage.clickOnSettingIcon();
//        assertEquals(settingsPage.getDataBackupAndRestoreText(), "اسنرجاع البيانات");
        settingsPage.clickOnDataBackupAndRestoreButton();

        assertEquals(backupAndRestorePage.getLastBackupSectionHeaderText(), "تفاصيل النسخ الاحتياطي الأخير");
        assertEquals(backupAndRestorePage.getAccountSectionHeaderText(), "إعدادات جوجل درايف");
        assertEquals(backupAndRestorePage.getStorageInfoText(), "سيتم تخزين النسخة الاحتياطية في Google Drive المرتبط بحساب Gmail الذي اخترته.");

        backupAndRestorePage.clickOnBackUpButton();
//         assertTrue(backupAndRestorePage.isDataBackupSuccessPopupDisplayed(), "Verify if backup successful popup displayed");
        backupAndRestorePage.clickOnCloseButton();

        backupAndRestorePage.clickOnRestoreButton();
//         assertTrue(backupAndRestorePage.isRestoreBackupSuccessPopUpDisplayed(), " Verify is restore backup successful popup displayed");
        backupAndRestorePage.clickOnCloseButton();

        backupAndRestorePage.clickOnArrowLeftButton();
        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");

        settingsPage.clickOnLanguage().clickOnHindiLanguage();

        assertTrue(unlockApplicationPage.isUnlockApplicationPageLoadedInArabic(), "Verify if language is changed to arabic");
        unlockApplicationPage.clickOnUnlockApplicationButton();
        setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.ANDROID);

        homePage.clickOnSettingIcon();


        //hindi
        assertEquals(settingsPage.getDataBackupAndRestoreText(), "बैकअप बहाल");
        settingsPage.clickOnDataBackupAndRestoreButton();
        assertEquals(backupAndRestorePage.getBackupAndRestoreHeaderText(), "बैकअप और पुनर्स्थापना");
        assertEquals(backupAndRestorePage.getLastBackupSectionHeaderText(), "अंतिम बैकअप विवरण");
        assertEquals(backupAndRestorePage.getAccountSectionHeaderText(), "Google ड्राइव सेटिंग्स");
        assertEquals(backupAndRestorePage.getStorageInfoText(), "बैकअप आपके चुने हुए जीमेल खाते से जुड़े Google ड्राइव में संग्रहीत किया जाएगा।");

        backupAndRestorePage.clickOnBackUpButton();
//         assertTrue(backupAndRestorePage.isDataBackupSuccessPopupDisplayed(), "Verify if backup successful popup displayed");
        backupAndRestorePage.clickOnCloseButton();

        backupAndRestorePage.clickOnRestoreButton();
//         assertTrue(backupAndRestorePage.isRestoreBackupSuccessPopUpDisplayed(), " Verify is restore backup successful popup displayed");
        backupAndRestorePage.clickOnCloseButton();

        backupAndRestorePage.clickOnArrowLeftButton();
        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");


        //kannada
        settingsPage.clickOnLanguage().clickOnKannadaLanguage();

        assertEquals(settingsPage.getDataBackupAndRestoreText(), "ಬ್ಯಾಕಪ್ ಮತ್ತು ಮರುಸ್ಥಾಪಿಸಿ");
        settingsPage.clickOnDataBackupAndRestoreButton();
        assertEquals(backupAndRestorePage.getBackupAndRestoreHeaderText(), "ಬ್ಯಾಕಪ್ ಮತ್ತು ಮರುಸ್ಥಾಪನೆ");
        assertEquals(backupAndRestorePage.getLastBackupSectionHeaderText(), "ಕೊನೆಯ ಬ್ಯಾಕಪ್ ವಿವರಗಳು");
        assertEquals(backupAndRestorePage.getAccountSectionHeaderText(), "Google Drive Settings");
        assertEquals(backupAndRestorePage.getStorageInfoText(), "ನಿಮ್ಮ ಆಯ್ಕೆಮಾಡಿದ gmail ಖಾತೆಗೆ ಸಂಯೋಜಿತವಾಗಿರುವ Google ಡ್ರೈವ್‌ನಲ್ಲಿ ಬ್ಯಾಕಪ್ ಅನ್ನು ಸಂಗ್ರಹಿಸಲಾಗುತ್ತದೆ.");

        backupAndRestorePage.clickOnBackUpButton();
//         assertTrue(backupAndRestorePage.isDataBackupSuccessPopupDisplayed(), "Verify if backup successful popup displayed");
        backupAndRestorePage.clickOnCloseButton();

        backupAndRestorePage.clickOnRestoreButton();
//         assertTrue(backupAndRestorePage.isRestoreBackupSuccessPopUpDisplayed(), " Verify is restore backup successful popup displayed");
        backupAndRestorePage.clickOnCloseButton();

        backupAndRestorePage.clickOnArrowLeftButton();
        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");

//
        settingsPage.clickOnLanguage().clickOnTamilLanguage();

        assertEquals(settingsPage.getDataBackupAndRestoreText(), "காப்புப்பிரதி & மீட்டமை");
        settingsPage.clickOnDataBackupAndRestoreButton();
        assertEquals(backupAndRestorePage.getBackupAndRestoreHeaderText(), "காப்புப்பிரதி & மீட்டமை");
        assertEquals(backupAndRestorePage.getLastBackupSectionHeaderText(), "கடைசி காப்பு விவரங்கள்");
        assertEquals(backupAndRestorePage.getAccountSectionHeaderText(), "Google இயக்கக அமைப்புகள்");
        assertEquals(backupAndRestorePage.getStorageInfoText(), "நீங்கள் தேர்ந்தெடுத்த ஜிமெயில் கணக்குடன் தொடர்புடைய Google இயக்ககத்தில் காப்புப்பிரதி சேமிக்கப்படும்.");

        backupAndRestorePage.clickOnBackUpButton();
         assertTrue(backupAndRestorePage.isDataBackupSuccessPopupDisplayed(), "Verify if backup successful popup displayed");
        backupAndRestorePage.clickOnCloseButton();

        backupAndRestorePage.clickOnRestoreButton();
         assertTrue(backupAndRestorePage.isRestoreBackupSuccessPopUpDisplayed(), " Verify is restore backup successful popup displayed");
        backupAndRestorePage.clickOnCloseButton();

        backupAndRestorePage.clickOnArrowLeftButton();
        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");

    }
    @Test
    public void ActiveVcAfterBackup() throws InterruptedException {
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

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        AddNewCardPage addNewCardPage = homePage.downloadCard();
        RetrieveIdPage retrieveIdPage = addNewCardPage.clickOnDownloadViaUin();
        String uin=TestDataReader.readData("uin");
        OtpVerificationPage otpVerification = retrieveIdPage.setEnterIdTextBox(uin).clickOnGenerateCardButton();

        otpVerification.enterOtp(BaseTestCase.getOtp(), Target.ANDROID);

        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isdataBackupAndRestoreDisplayed(), "Verify if backup & restore displayed");
        assertTrue(settingsPage.isNewlableDisplayed(), "Verify if backup & restore new tag displayed");
        BackupAndRestorePage backupAndRestorePage = settingsPage.clickOnDataBackupAndRestoreButton();

        assertTrue(backupAndRestorePage.isBackupProcessInfoDisplayed(), "Verify if backup information displayed");
        assertTrue(backupAndRestorePage.isCloudInfoDisplayed(), "Verify if cloud information displayed");
        backupAndRestorePage.clickOnProceedButton();

//        backupAndRestorePage.clickOnAddAnotherAccount();
        String email = TestDataReader.readData("emailsForBackupAndRestore");
        backupAndRestorePage.enterEmailTextBox(email);
        backupAndRestorePage.clickOnNextButton();
        backupAndRestorePage.enterPasswordTextBox(TestDataReader.readData("emailPassword"));
        backupAndRestorePage.clickOnNextButton();
        backupAndRestorePage.clickOnAgreeButton();


        assertTrue(backupAndRestorePage.isLastBackupSectionHeaderDisplayed(), "Verify if last backup section displayed");
//        assertTrue(backupAndRestorePage.isDataBackupSuccessPopupDisplayed(), "Verify if backup successful popup displayed");
        backupAndRestorePage.clickOnBackUpButton();
        assertTrue(backupAndRestorePage.isAccountSectionHeaderDisplayed(), "Verify if account section header displayed");
        assertTrue(backupAndRestorePage.isStorageInfoDisplayed(), "Verify if account storage info displayed");
        assertTrue(backupAndRestorePage.isAssociatedAccountDisplayed(), "Verify if associated account displayed");
        assertTrue(backupAndRestorePage.islastBackupTimeDisplayed(), "Verify if last backup time displayed");
        assertTrue(backupAndRestorePage.isDataBackupSuccessPopupDisplayed(), "Verify if backup successful popup displayed");
        backupAndRestorePage.clickOnCloseButton();

        backupAndRestorePage.clickOnArrowLeftButton();
        backupAndRestorePage.clickOnArrowLeftButton();

        MoreOptionsPage moreOptionsPage = homePage.clickOnMoreOptionsButton();
        assertTrue(moreOptionsPage.isMoreOptionsPageLoaded(), "Verify if more options page is displayed");
        PleaseConfirmPopupPage pleaseConfirmPopupPage = moreOptionsPage.clickOnActivationPending();

        assertTrue(pleaseConfirmPopupPage.isPleaseConfirmPopupPageLoaded(), "Verify if pop up page is displayed");
        OtpVerificationPage otpVerificationPage = pleaseConfirmPopupPage.clickOnConfirmButton();

        assertTrue(otpVerificationPage.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
        otpVerificationPage.enterOtp(TestDataReader.readData("passcode"), Target.ANDROID);

        assertTrue(moreOptionsPage.isVcActivatedForOnlineLogin(), "Verify if VC is activated");
    }

    @Test
    public void VerifyHelpInBackupAndRestore() throws InterruptedException {
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

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isdataBackupAndRestoreDisplayed(), "Verify if backup & restore displayed");
        assertTrue(settingsPage.isNewlableDisplayed(), "Verify if backup & restore new tag displayed");
        BackupAndRestorePage backupAndRestorePage = settingsPage.clickOnDataBackupAndRestoreButton();

        assertTrue(backupAndRestorePage.isBackupProcessInfoDisplayed(), "Verify if backup information displayed");
        assertTrue(backupAndRestorePage.isCloudInfoDisplayed(), "Verify if cloud information displayed");
        backupAndRestorePage.clickOnProceedButton();

//        backupAndRestorePage.clickOnAddAnotherAccount();
        String email = TestDataReader.readData("emailsForBackupAndRestore");
        backupAndRestorePage.enterEmailTextBox(email);
        backupAndRestorePage.clickOnNextButton();
        backupAndRestorePage.enterPasswordTextBox(TestDataReader.readData("emailPassword"));
        backupAndRestorePage.clickOnNextButton();
        backupAndRestorePage.clickOnAgreeButton();

        assertFalse(backupAndRestorePage.islastBackupTimeDisplayed(), "Verify if help page is displayed");
        assertTrue(backupAndRestorePage.isHelpButtonDisplayed(), "Verify if help page is displayed");
        Thread.sleep(4000);
        backupAndRestorePage.clickOnHelpButton();
        Thread.sleep(4000);
        assertTrue(backupAndRestorePage.isBackupFQADisplayed(), "Verify if help frequntly asked quations is displayed");

    }
    @Test
    public void VerifyDeletingDownloadedvc() throws InterruptedException {
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

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        AddNewCardPage addNewCardPage = homePage.downloadCard();
        RetrieveIdPage retrieveIdPage = addNewCardPage.clickOnDownloadViaUin();
        String uin=TestDataReader.readData("uin");
        OtpVerificationPage otpVerification = retrieveIdPage.setEnterIdTextBox(uin).clickOnGenerateCardButton();

        otpVerification.enterOtp(BaseTestCase.getOtp(), Target.ANDROID);

        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isdataBackupAndRestoreDisplayed(), "Verify if backup & restore displayed");
        assertTrue(settingsPage.isNewlableDisplayed(), "Verify if backup & restore new tag displayed");
        BackupAndRestorePage backupAndRestorePage = settingsPage.clickOnDataBackupAndRestoreButton();

        assertTrue(backupAndRestorePage.isBackupProcessInfoDisplayed(), "Verify if backup information displayed");
        assertTrue(backupAndRestorePage.isCloudInfoDisplayed(), "Verify if cloud information displayed");
        backupAndRestorePage.clickOnProceedButton();

//        backupAndRestorePage.clickOnAddAnotherAccount();
        String email = TestDataReader.readData("emailsForBackupAndRestore");
        backupAndRestorePage.enterEmailTextBox(email);
        backupAndRestorePage.clickOnNextButton();
        backupAndRestorePage.enterPasswordTextBox(TestDataReader.readData("emailPassword"));
        backupAndRestorePage.clickOnNextButton();
        backupAndRestorePage.clickOnAgreeButton();

        assertTrue(backupAndRestorePage.isLastBackupSectionHeaderDisplayed(), "Verify if last backup section displayed");
        assertTrue(backupAndRestorePage.islastBackupTimeDisplayed(), "Verify if last backup time displayed");
        backupAndRestorePage.clickOnBackUpButton();

        assertTrue(backupAndRestorePage.isAccountSectionHeaderDisplayed(), "Verify if account section header displayed");
        assertTrue(backupAndRestorePage.isStorageInfoDisplayed(), "Verify if account storage info displayed");
        assertTrue(backupAndRestorePage.isAssociatedAccountDisplayed(), "Verify if associated account displayed");
        assertTrue(backupAndRestorePage.islastBackupTimeDisplayed(), "Verify if last backup time displayed");
//        assertTrue(backupAndRestorePage.isDataBackupSuccessPopupDisplayed(), "Verify if backup successful popup displayed");
        backupAndRestorePage.clickOnCloseButton();

        backupAndRestorePage.clickOnRestoreButton();

        assertTrue(backupAndRestorePage.isRestoreSectionHeaderDisplayed(), " Verify is restore backup successful popup displayed");
//        assertTrue(backupAndRestorePage.isRestoreBackupSuccessPopUpDisplayed(), " Verify is restore backup successful popup displayed");
        backupAndRestorePage.clickOnCloseButton();
        backupAndRestorePage.clickOnArrowLeftButton();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        backupAndRestorePage.clickOnArrowLeftButton();

        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");
        homePage.clickOnFirstVcsEllipsisButton();
        MoreOptionsPage moreOptionsPage = new MoreOptionsPage(driver);
        assertTrue(moreOptionsPage.isMoreOptionsPageLoaded(), "Verify if more options page is displayed");

        PleaseConfirmPopupPage pleaseConfirmPopupPage = moreOptionsPage.clickOnActivationPending();

        assertTrue(pleaseConfirmPopupPage.isPleaseConfirmPopupPageLoaded(), "Verify if pop up page is displayed");
        OtpVerificationPage otpVerificationPage = pleaseConfirmPopupPage.clickOnConfirmButton();

        assertTrue(otpVerificationPage.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
        otpVerificationPage.enterOtp(TestDataReader.readData("passcode"), Target.ANDROID);

        assertTrue(moreOptionsPage.isVcActivatedForOnlineLogin(), "Verify if VC is activated");
        moreOptionsPage.clickOnCloseButton();

        assertTrue(homePage.isActivatedVcPopupTextDisplayed(), "Verify if VC is activated popup displayed");
        homePage.clickPopupCloseButtonButton();

        homePage.clickOnSecondVcsEllipsisButton();

        assertTrue(moreOptionsPage.isMoreOptionsPageLoaded(), "Verify if more options page is displayed");

        moreOptionsPage.clickOnRemoveFromWallet();
        assertTrue(pleaseConfirmPopupPage.isPleaseConfirmPopupPageLoaded(), "Verify if pop up page is displayed");

        pleaseConfirmPopupPage.clickOnConfirmButton();
        assertTrue(moreOptionsPage.isVcActivatedDisplayed(), "Verify if VC is activated");

    }

    @Test
    public void VerifyDeletingRestoredvc() throws InterruptedException {
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

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        AddNewCardPage addNewCardPage = homePage.downloadCard();
        RetrieveIdPage retrieveIdPage = addNewCardPage.clickOnDownloadViaUin();
        String uin=TestDataReader.readData("uin");
        OtpVerificationPage otpVerification = retrieveIdPage.setEnterIdTextBox(uin).clickOnGenerateCardButton();

        otpVerification.enterOtp(BaseTestCase.getOtp(), Target.ANDROID);

        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isdataBackupAndRestoreDisplayed(), "Verify if backup & restore displayed");
        assertTrue(settingsPage.isNewlableDisplayed(), "Verify if backup & restore new tag displayed");
        BackupAndRestorePage backupAndRestorePage = settingsPage.clickOnDataBackupAndRestoreButton();

        assertTrue(backupAndRestorePage.isBackupProcessInfoDisplayed(), "Verify if backup information displayed");
        assertTrue(backupAndRestorePage.isCloudInfoDisplayed(), "Verify if cloud information displayed");
        backupAndRestorePage.clickOnProceedButton();

//        backupAndRestorePage.clickOnAddAnotherAccount();
        String email = TestDataReader.readData("emailsForBackupAndRestore");
        backupAndRestorePage.enterEmailTextBox(email);
        backupAndRestorePage.clickOnNextButton();
        backupAndRestorePage.enterPasswordTextBox(TestDataReader.readData("emailPassword"));
        backupAndRestorePage.clickOnNextButton();
        backupAndRestorePage.clickOnAgreeButton();

        assertTrue(backupAndRestorePage.isLastBackupSectionHeaderDisplayed(), "Verify if last backup section displayed");
        assertTrue(backupAndRestorePage.islastBackupTimeDisplayed(), "Verify if last backup time displayed");
        backupAndRestorePage.clickOnBackUpButton();

        assertTrue(backupAndRestorePage.isAccountSectionHeaderDisplayed(), "Verify if account section header displayed");
        assertTrue(backupAndRestorePage.isStorageInfoDisplayed(), "Verify if account storage info displayed");
        assertTrue(backupAndRestorePage.isAssociatedAccountDisplayed(), "Verify if associated account displayed");
        assertTrue(backupAndRestorePage.islastBackupTimeDisplayed(), "Verify if last backup time displayed");
        assertTrue(backupAndRestorePage.isDataBackupSuccessPopupDisplayed(), "Verify if backup successful popup displayed");
        backupAndRestorePage.clickOnCloseButton();

        backupAndRestorePage.clickOnRestoreButton();

        assertTrue(backupAndRestorePage.isRestoreSectionHeaderDisplayed(), " Verify is restore backup successful popup displayed");
        assertTrue(backupAndRestorePage.isRestoreBackupSuccessPopUpDisplayed(), " Verify is restore backup successful popup displayed");
        backupAndRestorePage.clickOnCloseButton();
        backupAndRestorePage.clickOnArrowLeftButton();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        backupAndRestorePage.clickOnArrowLeftButton();

        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");
        homePage.clickOnSecondVcsEllipsisButton();
        MoreOptionsPage moreOptionsPage = new MoreOptionsPage(driver);
        assertTrue(moreOptionsPage.isMoreOptionsPageLoaded(), "Verify if more options page is displayed");

        PleaseConfirmPopupPage pleaseConfirmPopupPage = moreOptionsPage.clickOnActivationPending();

        assertTrue(pleaseConfirmPopupPage.isPleaseConfirmPopupPageLoaded(), "Verify if pop up page is displayed");
        OtpVerificationPage otpVerificationPage = pleaseConfirmPopupPage.clickOnConfirmButton();

        assertTrue(otpVerificationPage.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
        otpVerificationPage.enterOtp(TestDataReader.readData("passcode"), Target.ANDROID);

        assertTrue(moreOptionsPage.isVcActivatedForOnlineLogin(), "Verify if VC is activated");
        moreOptionsPage.clickOnCloseButton();

        assertTrue(homePage.isActivatedVcPopupTextDisplayed(), "Verify if VC is activated popup displayed");
        homePage.clickPopupCloseButtonButton();

        homePage.clickOnFirstVcsEllipsisButton();

        assertTrue(moreOptionsPage.isMoreOptionsPageLoaded(), "Verify if more options page is displayed");

        moreOptionsPage.clickOnRemoveFromWallet();
        assertTrue(pleaseConfirmPopupPage.isPleaseConfirmPopupPageLoaded(), "Verify if pop up page is displayed");

        pleaseConfirmPopupPage.clickOnConfirmButton();
        assertTrue(moreOptionsPage.isVcActivatedDisplayed(), "Verify if VC is activated");

    }

    @Test
    public void VerifyPiningDownloadedVc() throws InterruptedException {
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

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        AddNewCardPage addNewCardPage = homePage.downloadCard();
        RetrieveIdPage retrieveIdPage = addNewCardPage.clickOnDownloadViaUin();
        String uin=TestDataReader.readData("uin");
        OtpVerificationPage otpVerification = retrieveIdPage.setEnterIdTextBox(uin).clickOnGenerateCardButton();

        otpVerification.enterOtp(BaseTestCase.getOtp(), Target.ANDROID);

        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isdataBackupAndRestoreDisplayed(), "Verify if backup & restore displayed");
        assertTrue(settingsPage.isNewlableDisplayed(), "Verify if backup & restore new tag displayed");
        BackupAndRestorePage backupAndRestorePage = settingsPage.clickOnDataBackupAndRestoreButton();

        assertTrue(backupAndRestorePage.isBackupProcessInfoDisplayed(), "Verify if backup information displayed");
        assertTrue(backupAndRestorePage.isCloudInfoDisplayed(), "Verify if cloud information displayed");
        backupAndRestorePage.clickOnProceedButton();

//        backupAndRestorePage.clickOnAddAnotherAccount();
        String email = TestDataReader.readData("emailsForBackupAndRestore");
        backupAndRestorePage.enterEmailTextBox(email);
        backupAndRestorePage.clickOnNextButton();
        backupAndRestorePage.enterPasswordTextBox(TestDataReader.readData("emailPassword"));
        backupAndRestorePage.clickOnNextButton();
        backupAndRestorePage.clickOnAgreeButton();

        assertTrue(backupAndRestorePage.isLastBackupSectionHeaderDisplayed(), "Verify if last backup section displayed");
        assertTrue(backupAndRestorePage.islastBackupTimeDisplayed(), "Verify if last backup time displayed");
        backupAndRestorePage.clickOnBackUpButton();

        assertTrue(backupAndRestorePage.isAccountSectionHeaderDisplayed(), "Verify if account section header displayed");
        assertTrue(backupAndRestorePage.isStorageInfoDisplayed(), "Verify if account storage info displayed");
        assertTrue(backupAndRestorePage.isAssociatedAccountDisplayed(), "Verify if associated account displayed");
        assertTrue(backupAndRestorePage.islastBackupTimeDisplayed(), "Verify if last backup time displayed");
        assertTrue(backupAndRestorePage.isDataBackupSuccessPopupDisplayed(), "Verify if backup successful popup displayed");
        backupAndRestorePage.clickOnCloseButton();

        backupAndRestorePage.clickOnRestoreButton();

        assertTrue(backupAndRestorePage.isRestoreSectionHeaderDisplayed(), " Verify is restore backup successful popup displayed");
        assertTrue(backupAndRestorePage.isRestoreBackupSuccessPopUpDisplayed(), " Verify is restore backup successful popup displayed");
        backupAndRestorePage.clickOnCloseButton();
        backupAndRestorePage.clickOnArrowLeftButton();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        backupAndRestorePage.clickOnArrowLeftButton();

        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");
        homePage.clickOnSecondVcsEllipsisButton();
        MoreOptionsPage moreOptionsPage = new MoreOptionsPage(driver);
        assertTrue(moreOptionsPage.isMoreOptionsPageLoaded(), "Verify if more options page is displayed");

        PleaseConfirmPopupPage pleaseConfirmPopupPage = moreOptionsPage.clickOnActivationPending();

        assertTrue(pleaseConfirmPopupPage.isPleaseConfirmPopupPageLoaded(), "Verify if pop up page is displayed");
        OtpVerificationPage otpVerificationPage = pleaseConfirmPopupPage.clickOnConfirmButton();

        assertTrue(otpVerificationPage.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
        otpVerificationPage.enterOtp(TestDataReader.readData("passcode"), Target.ANDROID);

        assertTrue(moreOptionsPage.isVcActivatedForOnlineLogin(), "Verify if VC is activated");
        moreOptionsPage.clickOnPinOrUnPinCard();
        moreOptionsPage.clickOnCloseButton();

        assertTrue(homePage.isActivatedVcPopupTextDisplayed(), "Verify if VC is activated popup displayed");
        homePage.clickPopupCloseButtonButton();

        assertTrue(homePage.isPinIconDisplayed(), "Verify if VC is pined icon displayed");
        homePage.clickOnFirstVcsEllipsisButton();

        assertTrue(moreOptionsPage.isVcActivatedForOnlineLogin(), "Verify if VC is activaed for login use displayed");
    }

    @Test
    public void VerifyPiningRestoredVc() throws InterruptedException {
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

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        AddNewCardPage addNewCardPage = homePage.downloadCard();
        RetrieveIdPage retrieveIdPage = addNewCardPage.clickOnDownloadViaUin();
        String uin=TestDataReader.readData("uin");
        OtpVerificationPage otpVerification = retrieveIdPage.setEnterIdTextBox(uin).clickOnGenerateCardButton();

        otpVerification.enterOtp(BaseTestCase.getOtp(), Target.ANDROID);

        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isdataBackupAndRestoreDisplayed(), "Verify if backup & restore displayed");
        assertTrue(settingsPage.isNewlableDisplayed(), "Verify if backup & restore new tag displayed");
        BackupAndRestorePage backupAndRestorePage = settingsPage.clickOnDataBackupAndRestoreButton();

        assertTrue(backupAndRestorePage.isBackupProcessInfoDisplayed(), "Verify if backup information displayed");
        assertTrue(backupAndRestorePage.isCloudInfoDisplayed(), "Verify if cloud information displayed");
        backupAndRestorePage.clickOnProceedButton();

//        backupAndRestorePage.clickOnAddAnotherAccount();
        String email = TestDataReader.readData("emailsForBackupAndRestore");
        backupAndRestorePage.enterEmailTextBox(email);
        backupAndRestorePage.clickOnNextButton();
        backupAndRestorePage.enterPasswordTextBox(TestDataReader.readData("emailPassword"));
        backupAndRestorePage.clickOnNextButton();
        backupAndRestorePage.clickOnAgreeButton();

        assertTrue(backupAndRestorePage.isLastBackupSectionHeaderDisplayed(), "Verify if last backup section displayed");
        assertTrue(backupAndRestorePage.islastBackupTimeDisplayed(), "Verify if last backup time displayed");
        backupAndRestorePage.clickOnBackUpButton();

        assertTrue(backupAndRestorePage.isAccountSectionHeaderDisplayed(), "Verify if account section header displayed");
        assertTrue(backupAndRestorePage.isStorageInfoDisplayed(), "Verify if account storage info displayed");
        assertTrue(backupAndRestorePage.isAssociatedAccountDisplayed(), "Verify if associated account displayed");
        assertTrue(backupAndRestorePage.islastBackupTimeDisplayed(), "Verify if last backup time displayed");
        assertTrue(backupAndRestorePage.isDataBackupSuccessPopupDisplayed(), "Verify if backup successful popup displayed");
        backupAndRestorePage.clickOnCloseButton();

        backupAndRestorePage.clickOnRestoreButton();

        assertTrue(backupAndRestorePage.isRestoreSectionHeaderDisplayed(), " Verify is restore backup successful popup displayed");
        assertTrue(backupAndRestorePage.isRestoreBackupSuccessPopUpDisplayed(), " Verify is restore backup successful popup displayed");
        backupAndRestorePage.clickOnCloseButton();
        backupAndRestorePage.clickOnArrowLeftButton();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        backupAndRestorePage.clickOnArrowLeftButton();

        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");
        homePage.clickOnFirstVcsEllipsisButton();
        MoreOptionsPage moreOptionsPage = new MoreOptionsPage(driver);
        assertTrue(moreOptionsPage.isMoreOptionsPageLoaded(), "Verify if more options page is displayed");

        PleaseConfirmPopupPage pleaseConfirmPopupPage = moreOptionsPage.clickOnActivationPending();

        assertTrue(pleaseConfirmPopupPage.isPleaseConfirmPopupPageLoaded(), "Verify if pop up page is displayed");
        OtpVerificationPage otpVerificationPage = pleaseConfirmPopupPage.clickOnConfirmButton();

        assertTrue(otpVerificationPage.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
        otpVerificationPage.enterOtp(TestDataReader.readData("passcode"), Target.ANDROID);

        assertTrue(moreOptionsPage.isVcActivatedForOnlineLogin(), "Verify if VC is activated");
        moreOptionsPage.clickOnPinOrUnPinCard();
        moreOptionsPage.clickOnCloseButton();

        assertTrue(homePage.isActivatedVcPopupTextDisplayed(), "Verify if VC is activated popup displayed");
        homePage.clickPopupCloseButtonButton();

        assertTrue(homePage.isPinIconDisplayed(), "Verify if VC is pined icon displayed");
        homePage.clickOnFirstVcsEllipsisButton();

        assertTrue(moreOptionsPage.isVcActivatedForOnlineLogin(), "Verify if VC is activaed for login use displayed");
    }

}
