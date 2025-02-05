package androidTestCases;

import BaseTest.AndroidBaseTest;
import inji.api.BaseTestCase;
import inji.constants.Target;
import inji.pages.*;
import inji.utils.IosUtil;
import inji.utils.TestDataReader;
import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertTrue;

public class keyManagement extends AndroidBaseTest {
    @Test
    public void downloadAndVerifyVcUsingUinViaSunbird() throws InterruptedException {
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
        settingsPage.clickOnKeyManagement();
        Thread.sleep(3000);
        KeyManagementPage keyManagementPage = new KeyManagementPage(driver);
        keyManagementPage.clickOnDoneButton();
        Thread.sleep(3000);

        IosUtil.dragAndDrop(driver, keyManagementPage.getTheCoordinatesForRSA(), keyManagementPage.getTheCoordinatesED25519Text());
        keyManagementPage.clickOnSaveKeyOrderingPreferenceButton();

        assertTrue(keyManagementPage.iskeyOrderingSuccessTextMessageDisplayed(), "Verify if confirm passcode page is displayed");
        keyManagementPage.clickOnArrowleftButton();

        homePage.clickOnHomeButton();
        AddNewCardPage addNewCardPage = homePage.downloadCard();

        SunbirdLoginPage sunbirdLoginPage = addNewCardPage.clickOnDownloadViaSunbird();
        addNewCardPage.clickOnCredentialTypeHeadingInsuranceCredential();

        sunbirdLoginPage.enterPolicyNumberTextBox(TestDataReader.readData("policyNumberSunbird"));
        sunbirdLoginPage.enterFullNameTextBox(TestDataReader.readData("fullNameSunbird"));
        sunbirdLoginPage.enterDateOfBirthTextBox();
        sunbirdLoginPage.clickOnloginButton();

        assertTrue(sunbirdLoginPage.isSunbirdCardIsActive(), "Verify if download sunbird displayed active");
        assertTrue(sunbirdLoginPage.isSunbirdCardLogoIsDisplayed(), "Verify if download sunbird logo displayed");
        assertEquals(sunbirdLoginPage.getFullNameForSunbirdCard(), TestDataReader.readData("fullNameSunbird"));
        sunbirdLoginPage.openDetailedSunbirdVcView();
        assertEquals(sunbirdLoginPage.getFullNameForSunbirdCard(), TestDataReader.readData("fullNameSunbird"));
        assertTrue(keyManagementPage.compareListOfKeys());

    }

    @Test
    public void downloadAndVerifyVcUsingMockIdentity() throws InterruptedException {
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
        settingsPage.clickOnKeyManagement();
        Thread.sleep(3000);
        KeyManagementPage keyManagementPage = new KeyManagementPage(driver);
        keyManagementPage.clickOnDoneButton();
        Thread.sleep(3000);

        IosUtil.dragAndDrop(driver, keyManagementPage.getTheCoordinatesECCR1TextText(), keyManagementPage.getTheCoordinatesED25519Text());
        keyManagementPage.clickOnSaveKeyOrderingPreferenceButton();

        assertTrue(keyManagementPage.iskeyOrderingSuccessTextMessageDisplayed(), "Verify if confirm passcode page is displayed");
        keyManagementPage.clickOnArrowleftButton();

        homePage.clickOnHomeButton();
        AddNewCardPage addNewCardPage = homePage.downloadCard();

        MockCertifyLoginPage mockCertifyLoginPage = addNewCardPage.clickOnDownloadViaMockCertify();

//        mockCertifyLoginPage.clickOnEsignetLoginWithOtpButton();

        assertTrue(mockCertifyLoginPage.isEnterYourVidTextDisplayed(), "Verify if enter your vid text is displayed");

        OtpVerificationPage otpVerification = mockCertifyLoginPage.setEnterIdTextBox(TestDataReader.readData("MockVc"));

        mockCertifyLoginPage.clickOnGetOtpButton();
        assertTrue(mockCertifyLoginPage.isOtpHasSendMessageDisplayed(), "verify if otp page is displayed");

        otpVerification.enterOtpForEsignet(BaseTestCase.getOtp(), Target.ANDROID);
        mockCertifyLoginPage.clickOnVerifyButton();

        assertTrue(homePage.isCredentialTypeValueDisplayed(), "Verify if credential type value is displayed");
        DetailedVcViewPage detailedVcViewPage = homePage.openDetailedVcView();

        detailedVcViewPage.clickOnQrCodeButton();
        SoftAssert softAssert = new SoftAssert();
        softAssert.assertTrue(detailedVcViewPage.isQrCodeDisplayed(), "Verify if QR Code header is displayed");

        detailedVcViewPage.clickOnQrCrossIcon();
        assertTrue(detailedVcViewPage.isEsignetLogoDisplayed(), "Verify if detailed Vc esignet logo is displayed");
        assertTrue(detailedVcViewPage.isDetailedVcViewPageLoaded(), "Verify if detailed Vc view page is displayed");
        assertEquals(detailedVcViewPage.getIdTypeValueInDetailedVcView(), TestDataReader.readData("idTypeForMobileDrivingLicense"), "Verify if id type is displayed");
        assertEquals(detailedVcViewPage.getStatusInDetailedVcView(), TestDataReader.readData("status"), "Verify if status is displayed");
//        assertTrue(detailedVcViewPage.isKeyTypeVcDetailViewValueDisplayed(), "Verify if key type detailed Vc value displayed");
        assertTrue(keyManagementPage.compareListOfKeys());

    }

    @Test
    public void downloadAndVerifyVcUsingEsignet() throws InterruptedException {
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
        settingsPage.clickOnKeyManagement();
        Thread.sleep(3000);
        KeyManagementPage keyManagementPage = new KeyManagementPage(driver);
        keyManagementPage.clickOnDoneButton();
        Thread.sleep(3000);

        IosUtil.dragAndDrop(driver, keyManagementPage.getTheCoordinatesForRSA(), keyManagementPage.getTheCoordinatesED25519Text());
        keyManagementPage.clickOnSaveKeyOrderingPreferenceButton();

        assertTrue(keyManagementPage.iskeyOrderingSuccessTextMessageDisplayed(), "Verify if confirm passcode page is displayed");
        keyManagementPage.clickOnArrowleftButton();

        homePage.clickOnHomeButton();
        AddNewCardPage addNewCardPage = homePage.downloadCard();

        EsignetLoginPage esignetLoginPage = addNewCardPage.clickOnDownloadViaEsignet();

        esignetLoginPage.clickOnEsignetLoginWithOtpButton();

        assertTrue(esignetLoginPage.isEnterYourVidTextDisplayed(), "Verify if enter your vid text is displayed");
        String uin = TestDataReader.readData("uin");
        OtpVerificationPage otpVerification = esignetLoginPage.setEnterIdTextBox(uin);

        esignetLoginPage.clickOnGetOtpButton();
        assertTrue(esignetLoginPage.isOtpHasSendMessageDisplayed(), "verify if otp page is displayed");

        otpVerification.enterOtpForEsignet(BaseTestCase.getOtp(), Target.ANDROID);
        esignetLoginPage.clickOnVerifyButton();

        assertTrue(homePage.isCredentialTypeValueDisplayed(), "Verify if credential type value is displayed");
        DetailedVcViewPage detailedVcViewPage = homePage.openDetailedVcView();

        detailedVcViewPage.clickOnQrCodeButton();
        SoftAssert softAssert = new SoftAssert();
        softAssert.assertTrue(detailedVcViewPage.isQrCodeDisplayed(), "Verify if QR Code header is displayed");

//        detailedVcViewPage.clickOnQrCrossIcon();
//        assertTrue(detailedVcViewPage.isEsignetLogoDisplayed(), "Verify if detailed Vc esignet logo is displayed");
        assertTrue(detailedVcViewPage.isDetailedVcViewPageLoaded(), "Verify if detailed Vc view page is displayed");
        assertTrue(keyManagementPage.compareListOfKeys());
    }

}
