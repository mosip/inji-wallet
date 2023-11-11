package io.mosip.test.mob.inji.testcases;

import org.testng.annotations.Test;

import io.mosip.test.mob.inji.api.BaseTestCase;
import io.mosip.test.mob.inji.pages.*;
import io.mosip.test.mob.inji.utils.TestDataReader;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertTrue;

public class VcDownloadAndVerifyUsingUinTest extends BaseTest {
    @Test
    public void downloadAndVerifyVcUsingUin() {
        ChooseLanguagePage chooseLanguagePage = new ChooseLanguagePage(driver);

        assertTrue(chooseLanguagePage.isChooseLanguagePageLoaded(), "Verify if choose language page is displayed");
        WelcomePage welcomePage = chooseLanguagePage.clickOnSavePreference();

        assertTrue(welcomePage.isWelcomePageLoaded(), "Verify if welcome page is loaded");
        AppUnlockMethodPage appUnlockMethodPage = welcomePage.clickOnSkipButton();

        assertTrue(appUnlockMethodPage.isAppUnlockMethodPageLoaded(), "Verify if app unlocked page is displayed");
        SetPasscode setPasscode = appUnlockMethodPage.clickOnUsePasscode();

        assertTrue(setPasscode.isSetPassCodePageLoaded(), "Verify if set passcode page is displayed");
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), target);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.confirmPasscode(TestDataReader.readData("passcode"), target);

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        AddNewCardPage addNewCardPage = homePage.downloadCard();

        assertTrue(addNewCardPage.isAddNewCardPageLoaded(), "Verify if add new card page is displayed");
        RetrieveIdPage retrieveIdPage = addNewCardPage.clickOnDownloadViaUin();

        assertTrue(retrieveIdPage.isRetrieveIdPageLoaded(), "Verify if retrieve id page is displayed");
        OtpVerificationPage otpVerification = retrieveIdPage.setEnterIdTextBox(TestDataReader.readData("uin")).clickOnGenerateCardButton();

        assertTrue(otpVerification.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
        otpVerification.enterOtp(BaseTestCase.GetOtp(), target);

        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");
        assertTrue(homePage.isIdTypeDisplayed(), "Verify if id type is displayed");

        DetailedVcViewPage detailedVcViewPage = homePage.openDetailedVcView(TestDataReader.readData("fullName"));

        assertTrue(detailedVcViewPage.isDetailedVcViewPageLoaded(), "Verify if detailed Vc view page is displayed");
        assertEquals(detailedVcViewPage.getNameInDetailedVcView(), TestDataReader.readData("fullName"), "Verify if full name is displayed");
        assertEquals(detailedVcViewPage.getDateOfBirthInDetailedVcView(), TestDataReader.readData("dateOfBirth"), "Verify if date of birth is displayed");
        assertEquals(detailedVcViewPage.getGenderInDetailedVcView(), TestDataReader.readData("gender"), "Verify if gender is displayed");
        assertEquals(detailedVcViewPage.getIdTypeValueInDetailedVcView(), TestDataReader.readData("idType"), "Verify if id type is displayed");
        assertEquals(detailedVcViewPage.getStatusInDetailedVcView(), TestDataReader.readData("status"), "Verify if status is displayed");
        assertEquals(detailedVcViewPage.getUinInDetailedVcView(), TestDataReader.readData("uin"), "Verify if uin is displayed");
        assertEquals(detailedVcViewPage.getPhoneInDetailedVcView(), TestDataReader.readData("phoneNumber"), "Verify if phone number is displayed");
        assertEquals(detailedVcViewPage.getEmailInDetailedVcView(), TestDataReader.readData("externalemail"), "Verify if email is displayed");
        assertTrue(detailedVcViewPage.isActivateButtonDisplayed(), "Verify if activate vc button displayed");
    }

    @Test
    public void downloadMultipleVcUsingDifferentUin() {
        ChooseLanguagePage chooseLanguagePage = new ChooseLanguagePage(driver);

        assertTrue(chooseLanguagePage.isChooseLanguagePageLoaded(), "Verify if choose language page is displayed");
        WelcomePage welcomePage = chooseLanguagePage.clickOnSavePreference();

        assertTrue(welcomePage.isWelcomePageLoaded(), "Verify if welcome page is loaded");
        AppUnlockMethodPage appUnlockMethodPage = welcomePage.clickOnSkipButton();

        assertTrue(appUnlockMethodPage.isAppUnlockMethodPageLoaded(), "Verify if app unlocked page is displayed");
        SetPasscode setPasscode = appUnlockMethodPage.clickOnUsePasscode();

        assertTrue(setPasscode.isSetPassCodePageLoaded(), "Verify if set passcode page is displayed");
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), target);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.confirmPasscode(TestDataReader.readData("passcode"), target);

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        AddNewCardPage addNewCardPage = homePage.downloadCard();

        assertTrue(addNewCardPage.isAddNewCardPageLoaded(), "Verify if add new card page is displayed");
        RetrieveIdPage retrieveIdPage = addNewCardPage.clickOnDownloadViaUin();

        assertTrue(retrieveIdPage.isRetrieveIdPageLoaded(), "Verify if retrieve id page is displayed");
        OtpVerificationPage otpVerification = retrieveIdPage.setEnterIdTextBox(BaseTestCase.uin).clickOnGenerateCardButton();

        assertTrue(otpVerification.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
        otpVerification.enterOtp(BaseTestCase.GetOtp(), target);

        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");

        homePage.downloadCard();

        assertTrue(addNewCardPage.isAddNewCardPageLoaded(), "Verify if add new card page is displayed");
        addNewCardPage.clickOnDownloadViaUin();

        assertTrue(retrieveIdPage.isRetrieveIdPageLoaded(), "Verify if retrieve id page is displayed");
        retrieveIdPage.setEnterIdTextBox(TestDataReader.readData("uin2")).clickOnGenerateCardButton();

        assertTrue(otpVerification.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
        otpVerification.enterOtp(BaseTestCase.GetOtp(), target);

        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("uin2FullName")), "Verify if second VC is  displayed");
        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verifying again if first VC is still exists.");

    }

    @Test
    public void downloadWithEmptyUin() {
        ChooseLanguagePage chooseLanguagePage = new ChooseLanguagePage(driver);

        assertTrue(chooseLanguagePage.isChooseLanguagePageLoaded(), "Verify if choose language page is displayed");
        WelcomePage welcomePage = chooseLanguagePage.clickOnSavePreference();

        assertTrue(welcomePage.isWelcomePageLoaded(), "Verify if welcome page is loaded");
        AppUnlockMethodPage appUnlockMethodPage = welcomePage.clickOnSkipButton();

        assertTrue(appUnlockMethodPage.isAppUnlockMethodPageLoaded(), "Verify if app unlocked page is displayed");
        SetPasscode setPasscode = appUnlockMethodPage.clickOnUsePasscode();

        assertTrue(setPasscode.isSetPassCodePageLoaded(), "Verify if set passcode page is displayed");
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), target);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.confirmPasscode(TestDataReader.readData("passcode"), target);

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        AddNewCardPage addNewCardPage = homePage.downloadCard();

        assertTrue(addNewCardPage.isAddNewCardPageLoaded(), "Verify if add new card page is displayed");
        RetrieveIdPage retrieveIdPage = addNewCardPage.clickOnDownloadViaUin();

        assertTrue(retrieveIdPage.isRetrieveIdPageLoaded(), "Verify if retrieve id page is displayed");
        OtpVerificationPage otpVerification = retrieveIdPage.setEnterIdTextBox("").clickOnGenerateCardButton();
        assertTrue(retrieveIdPage.isRetrieveIdPageLoaded(), "Verify if retrieve id page is displayed");

    }

    @Test
    public void generateMultipleVcWithSameUin() throws InterruptedException {
    	ChooseLanguagePage chooseLanguagePage = new ChooseLanguagePage(driver);

        assertTrue(chooseLanguagePage.isChooseLanguagePageLoaded(), "Verify if choose language page is displayed");
        WelcomePage welcomePage = chooseLanguagePage.clickOnSavePreference();

        assertTrue(welcomePage.isWelcomePageLoaded(), "Verify if welcome page is loaded");
        AppUnlockMethodPage appUnlockMethodPage = welcomePage.clickOnSkipButton();

        assertTrue(appUnlockMethodPage.isAppUnlockMethodPageLoaded(), "Verify if app unlocked page is displayed");
        SetPasscode setPasscode = appUnlockMethodPage.clickOnUsePasscode();

        assertTrue(setPasscode.isSetPassCodePageLoaded(), "Verify if set passcode page is displayed");
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), target);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.confirmPasscode(TestDataReader.readData("passcode"), target);

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        AddNewCardPage addNewCardPage = homePage.downloadCard();

        assertTrue(addNewCardPage.isAddNewCardPageLoaded(), "Verify if add new card page is displayed");
        RetrieveIdPage retrieveIdPage = addNewCardPage.clickOnDownloadViaUin();

        assertTrue(retrieveIdPage.isRetrieveIdPageLoaded(), "Verify if retrieve id page is displayed");
        OtpVerificationPage otpVerification = retrieveIdPage.setEnterIdTextBox(BaseTestCase.uin).clickOnGenerateCardButton();

        assertTrue(otpVerification.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
        otpVerification.enterOtp(BaseTestCase.GetOtp(), target);

        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");

        homePage.downloadCard();

        assertTrue(addNewCardPage.isAddNewCardPageLoaded(), "Verify if add new card page is displayed");
         addNewCardPage.clickOnDownloadViaUin();

        assertTrue(retrieveIdPage.isRetrieveIdPageLoaded(), "Verify if retrieve id page is displayed");
         retrieveIdPage.setEnterIdTextBox(BaseTestCase.uin).clickOnGenerateCardButton();

        assertTrue(otpVerification.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
        otpVerification.enterOtp(BaseTestCase.GetOtp(), target);

        assertTrue(homePage.isSecondNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");
        HistoryPage historyPage = homePage.clickOnHistoryButton();

        assertTrue(historyPage.isHistoryPageLoaded(), "Verify if history page is displayed");
        assertTrue(historyPage.verifyHistory(BaseTestCase.uin, target));

        historyPage.getNumberOfRecordsInHistory(BaseTestCase.uin, target,"Verify two download records inhistory page");
        assertEquals(historyPage.getNumberOfRecordsInHistory(BaseTestCase.uin, target,""),2);

    }

    @Test
    public void verifyInvalidUinErrorMessage() {
        ChooseLanguagePage chooseLanguagePage = new ChooseLanguagePage(driver);

        assertTrue(chooseLanguagePage.isChooseLanguagePageLoaded(), "Verify if choose language page is displayed");
        WelcomePage welcomePage = chooseLanguagePage.clickOnSavePreference();

        assertTrue(welcomePage.isWelcomePageLoaded(), "Verify if welcome page is loaded");
        AppUnlockMethodPage appUnlockMethodPage = welcomePage.clickOnSkipButton();

        assertTrue(appUnlockMethodPage.isAppUnlockMethodPageLoaded(), "Verify if app unlocked page is displayed");
        SetPasscode setPasscode = appUnlockMethodPage.clickOnUsePasscode();

        assertTrue(setPasscode.isSetPassCodePageLoaded(), "Verify if set passcode page is displayed");
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), target);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.confirmPasscode(TestDataReader.readData("passcode"), target);

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");

        AddNewCardPage addNewCardPage = homePage.downloadCard();

        assertTrue(addNewCardPage.isAddNewCardPageLoaded(), "Verify if add new card page is displayed");
        RetrieveIdPage retrieveIdPage = addNewCardPage.clickOnDownloadViaUin();

        assertTrue(retrieveIdPage.isRetrieveIdPageLoaded(), "Verify if retrieve id page is displayed");
        retrieveIdPage.setEnterIdTextBox("00").clickOnGenerateCardButton();

        assertTrue(retrieveIdPage.isIncorrectInputFormatErrorMessageDisplayed());
    }
}