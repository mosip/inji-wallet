package iosTestCases;

import BaseTest.IosBaseTest;
import inji.api.BaseTestCase;
import inji.constants.Target;
import inji.pages.*;
import inji.utils.TestDataReader;
import org.testng.annotations.Test;

import static org.testng.Assert.*;

public class DeletingVcTest extends IosBaseTest {
    @Test
    public void deleteVcAndVerifyInHistory() throws InterruptedException {
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
        AddNewCardPage addNewCardPage = homePage.downloadCard();

        assertTrue(addNewCardPage.isAddNewCardPageLoaded(), "Verify if add new card page is displayed");
        RetrieveIdPage retrieveIdPage = addNewCardPage.clickOnDownloadViaUin();

        assertTrue(retrieveIdPage.isRetrieveIdPageLoaded(), "Verify if retrieve id page is displayed");
        String uin = TestDataReader.readData("uin");
        OtpVerificationPage otpVerification = retrieveIdPage.setEnterIdTextBox(uin).clickOnGenerateCardButton();

        assertTrue(otpVerification.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
        otpVerification.enterOtp(BaseTestCase.getOtp(), Target.IOS);

        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");

        MoreOptionsPage moreOptionsPage = homePage.clickOnMoreOptionsButton();
        assertTrue(moreOptionsPage.isMoreOptionsPageLoaded(), "Verify if more options page is displayed");

        PleaseConfirmPopupPage pleaseConfirmPopupPage = moreOptionsPage.clickOnRemoveFromWallet();
        assertTrue(pleaseConfirmPopupPage.isPleaseConfirmPopupPageLoaded(), "Verify if pop up page is displayed");

        pleaseConfirmPopupPage.clickOnConfirmButton();
        assertEquals(homePage.verifyLanguageForNoVCDownloadedPageLoaded(), "Bring your digital identity");

        HistoryPage historyPage = homePage.clickOnHistoryButton();
        assertTrue(historyPage.isHistoryPageLoaded(), "Verify if history page is displayed");
        historyPage.verifyHistory(uin + " Removed from wallet", Target.IOS);
        assertTrue(historyPage.verifyDeleteHistory(uin, Target.IOS), "Verify if deleted history is displayed");

    }

    @Test
    public void cancelDeleteVc() throws InterruptedException {
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
        AddNewCardPage addNewCardPage = homePage.downloadCard();

        assertTrue(addNewCardPage.isAddNewCardPageLoaded(), "Verify if add new card page is displayed");
        RetrieveIdPage retrieveIdPage = addNewCardPage.clickOnDownloadViaUin();

        assertTrue(retrieveIdPage.isRetrieveIdPageLoaded(), "Verify if retrieve id page is displayed");
        String uin = TestDataReader.readData("uin");
        OtpVerificationPage otpVerification = retrieveIdPage.setEnterIdTextBox(uin).clickOnGenerateCardButton();

        assertTrue(otpVerification.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
        otpVerification.enterOtp(BaseTestCase.getOtp(), Target.IOS);

        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");

        MoreOptionsPage moreOptionsPage = homePage.clickOnMoreOptionsButton();
        assertTrue(moreOptionsPage.isMoreOptionsPageLoaded(), "Verify if more options page is displayed");

        PleaseConfirmPopupPage pleaseConfirmPopupPage = moreOptionsPage.clickOnRemoveFromWallet();
        assertTrue(pleaseConfirmPopupPage.isPleaseConfirmPopupPageLoaded(), "Verify if pop up page is displayed");

        pleaseConfirmPopupPage.clickOnNoButton();
//        assertTrue(moreOptionsPage.isMoreOptionsPageLoaded(), "Verify if more options page is displayed");
//
//        moreOptionsPage.clickOnCloseButton();
        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");
    }

    @Test
    public void DownloadingDeletedVc() throws InterruptedException {
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
        AddNewCardPage addNewCardPage = homePage.downloadCard();

        assertTrue(addNewCardPage.isAddNewCardPageLoaded(), "Verify if add new card page is displayed");
        RetrieveIdPage retrieveIdPage = addNewCardPage.clickOnDownloadViaUin();

        assertTrue(retrieveIdPage.isRetrieveIdPageLoaded(), "Verify if retrieve id page is displayed");
        String uin = TestDataReader.readData("uin");
        OtpVerificationPage otpVerification = retrieveIdPage.setEnterIdTextBox(uin).clickOnGenerateCardButton();

        assertTrue(otpVerification.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
        otpVerification.enterOtp(BaseTestCase.getOtp(), Target.IOS);

        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");

        MoreOptionsPage moreOptionsPage = homePage.clickOnMoreOptionsButton();
        assertTrue(moreOptionsPage.isMoreOptionsPageLoaded(), "Verify if more options page is displayed");

        PleaseConfirmPopupPage pleaseConfirmPopupPage = moreOptionsPage.clickOnRemoveFromWallet();
        assertTrue(pleaseConfirmPopupPage.isPleaseConfirmPopupPageLoaded(), "Verify if pop up page is displayed");

        pleaseConfirmPopupPage.clickOnConfirmButton();
        assertFalse(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if VC is removed");

        homePage.downloadCard();

        assertTrue(addNewCardPage.isAddNewCardPageLoaded(), "Verify if add new card page is displayed");
        addNewCardPage.clickOnDownloadViaUin();

        assertTrue(retrieveIdPage.isRetrieveIdPageLoaded(), "Verify if retrieve id page is displayed");
        retrieveIdPage.setEnterIdTextBox(uin).clickOnGenerateCardButton();

        assertTrue(otpVerification.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
        otpVerification.enterOtp(BaseTestCase.getOtp(), Target.IOS);

        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");

        HistoryPage historyPage = homePage.clickOnHistoryButton();
        assertTrue(historyPage.isHistoryPageLoaded(), "Verify if history page is displayed");

        assertTrue(historyPage.verifyHistory(uin, Target.IOS));

        assertEquals(historyPage.getNumberOfRecordsInHistory(uin, Target.IOS), 2,"Verify two download records in history page");
        assertTrue(historyPage.verifyDeleteHistory(uin, Target.IOS), "Verify if deleted history is displayed");
    }

    @Test
    public void deleteVcAndVerifyInHistoryForEsignet() throws InterruptedException {
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
        AddNewCardPage addNewCardPage = homePage.downloadCard();

        EsignetLoginPage esignetLoginPage =  addNewCardPage.clickOnDownloadViaEsignet();
        addNewCardPage.clickOnContinueButtonInSigninPopupIos();

        esignetLoginPage.clickOnEsignetLoginWithOtpButton();
        Thread.sleep(9000);
        String uin = TestDataReader.readData("uin");
        OtpVerificationPage otpVerification= esignetLoginPage.setEnterIdTextBox(uin);


        esignetLoginPage.clickOnGetOtpButton();

        otpVerification.enterOtpForEsignet(TestDataReader.readData("otp"), Target.IOS);
        esignetLoginPage.clickOnVerifyButtonIos();

        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");

        MoreOptionsPage moreOptionsPage = homePage.clickOnMoreOptionsButton();
        assertTrue(moreOptionsPage.isMoreOptionsPageLoaded(), "Verify if more options page is displayed");

        PleaseConfirmPopupPage pleaseConfirmPopupPage = moreOptionsPage.clickOnRemoveFromWallet();
        assertTrue(pleaseConfirmPopupPage.isPleaseConfirmPopupPageLoaded(), "Verify if pop up page is displayed");

        pleaseConfirmPopupPage.clickOnConfirmButton();
        assertEquals(homePage.verifyLanguageForNoVCDownloadedPageLoaded(), "Bring your digital identity");

        HistoryPage historyPage = homePage.clickOnHistoryButton();
        assertTrue(historyPage.isHistoryPageLoaded(), "Verify if history page is displayed");

        assertTrue(historyPage.verifyDeleteHistory(uin, Target.IOS), "Verify if deleted history is displayed");

        SharePage scanPage = homePage.clickOnShareButton();
        scanPage.acceptPermissionPopupBluetoothIos();
        scanPage.acceptPermissionPopupCameraIos();

        assertTrue(scanPage.isNoShareableCardsMessageDisplayed(), "Verify if no shareable cards are available message is displayed");
    }

    @Test
    public void deleteVcAndVerifyInHistoryForSunbird() throws InterruptedException {
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
        AddNewCardPage addNewCardPage = homePage.downloadCard();

        assertTrue(addNewCardPage.isAddNewCardPageLoaded(), "Verify if add new card page is displayed");
        SunbirdLoginPage sunbirdLoginPage =  addNewCardPage.clickOnDownloadViaSunbird();

        addNewCardPage.clickOnInsuranceCredential();
        addNewCardPage.clickOnContinueButtonInSigninPopupIos();

        sunbirdLoginPage.enterPolicyNumberTextBox(TestDataReader.readData("policyNumberSunbird"));
        sunbirdLoginPage.enterFullNameTextBox(TestDataReader.readData("fullNameSunbird"));
        sunbirdLoginPage.enterDateOfBirthTextBox();
        sunbirdLoginPage.clickOnloginButton();

        assertTrue(sunbirdLoginPage.isSunbirdCardIsActive(), "Verify if download sunbird displayed active");
        assertTrue(sunbirdLoginPage.isSunbirdCardLogoIsDisplayed(), "Verify if download sunbird logo displayed");
        assertEquals(sunbirdLoginPage.getFullNameForSunbirdCard(),TestDataReader.readData("fullNameSunbird"));

        MoreOptionsPage moreOptionsPage = homePage.clickOnMoreOptionsButton();
        assertTrue(moreOptionsPage.isMoreOptionsPageLoaded(), "Verify if more options page is displayed");

        PleaseConfirmPopupPage pleaseConfirmPopupPage = moreOptionsPage.clickOnRemoveFromWallet();
        assertTrue(pleaseConfirmPopupPage.isPleaseConfirmPopupPageLoaded(), "Verify if pop up page is displayed");

        pleaseConfirmPopupPage.clickOnConfirmButton();
        assertEquals(homePage.verifyLanguageForNoVCDownloadedPageLoaded(), "Bring your digital identity");
        HistoryPage historyPage = homePage.clickOnHistoryButton();

        assertTrue(historyPage.isHistoryPageLoaded(), "Verify if history page is displayed");
        assertTrue(historyPage.verifyDeleteHistoryInsuranceCard(TestDataReader.readData("policyNumberSunbird"), Target.IOS));
    }
}