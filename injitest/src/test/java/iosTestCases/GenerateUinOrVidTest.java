package iosTestCases;

import BaseTest.IosBaseTest;
import inji.api.BaseTestCase;
import inji.constants.Target;
import inji.pages.*;
import inji.utils.TestDataReader;
import org.testng.annotations.Test;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertTrue;

public class GenerateUinOrVidTest extends IosBaseTest {

    @Test
    public void generateUinOrVidUsingAid() {
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

        homePage.clickOnNextButtonForInjiTour();
        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        AddNewCardPage addNewCardPage = homePage.downloadCard();

        assertTrue(addNewCardPage.isAddNewCardPageLoaded(), "Verify if add new card page is displayed");
        RetrieveIdPage retrieveIdPage = addNewCardPage.clickOnDownloadViaUin();

        assertTrue(retrieveIdPage.isRetrieveIdPageLoaded(), "Verify if retrieve id page is displayed");
        assertEquals(retrieveIdPage.verifyGetItTextDisplayed(),"Get it now using your AID.");
        GenerateUinOrVidPage generateUinOrVidPage = retrieveIdPage.clickOnGetItNowText();

        assertTrue(generateUinOrVidPage.isGenerateUinOrVidPageLoaded(), "Verify if generate uin or vid page page is displayed");
        assertEquals(generateUinOrVidPage.getRetrieveUinVidText(), "Get your UIN/VID");

        String aid = TestDataReader.readData("aid");
        OtpVerificationPage otpVerification = generateUinOrVidPage.enterApplicationID(aid).clickOnGetUinOrVidButton();

        assertTrue(otpVerification.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
        otpVerification.enterOtp(BaseTestCase.getOtp(), Target.IOS);

        assertTrue(retrieveIdPage.isRetrieveIdPageLoaded(), "Verify if retrieve id page is displayed");
        retrieveIdPage.clickOnGenerateCardButton();

        assertTrue(otpVerification.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
        otpVerification.enterOtp(BaseTestCase.getOtp(), Target.IOS);

        addNewCardPage.clickOnDoneButton();
        assertTrue(homePage.isCredentialTypeValueDisplayed(), "Verify if credential type value is displayed");

    }

    @Test
    public void goBackToGenerateUinOrVidUsingAidFromOtpVerificationPage() {
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

        homePage.clickOnNextButtonForInjiTour();
        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        AddNewCardPage addNewCardPage = homePage.downloadCard();

        assertTrue(addNewCardPage.isAddNewCardPageLoaded(), "Verify if add new card page is displayed");
        RetrieveIdPage retrieveIdPage = addNewCardPage.clickOnDownloadViaUin();

        assertTrue(retrieveIdPage.isRetrieveIdPageLoaded(), "Verify if retrieve id page is displayed");
        GenerateUinOrVidPage generateUinOrVidPage = retrieveIdPage.clickOnGetItNowText();

        assertTrue(generateUinOrVidPage.isGenerateUinOrVidPageLoaded(), "Verify if generate uin or vid page page is displayed");
        String aid= TestDataReader.readData("aid");
        OtpVerificationPage otpVerification = generateUinOrVidPage.enterApplicationID(aid).clickOnGetUinOrVidButton();

        assertTrue(otpVerification.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
        otpVerification.clickOnCrossIcon();
        assertTrue(generateUinOrVidPage.isGenerateUinOrVidPageLoaded(), "Verify if generate uin or vid page page is displayed");

    }

    @Test
    public void generateUinUsingAidAndWaitForOtpTimeOut() {
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

        homePage.clickOnNextButtonForInjiTour();
        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        AddNewCardPage addNewCardPage = homePage.downloadCard();

        assertTrue(addNewCardPage.isAddNewCardPageLoaded(), "Verify if add new card page is displayed");
        RetrieveIdPage retrieveIdPage = addNewCardPage.clickOnDownloadViaUin();

        assertTrue(retrieveIdPage.isRetrieveIdPageLoaded(), "Verify if retrieve id page is displayed");
        assertEquals(retrieveIdPage.verifyGetItTextDisplayed(),"Get it now using your AID.");
        GenerateUinOrVidPage generateUinOrVidPage = retrieveIdPage.clickOnGetItNowText();

        assertTrue(generateUinOrVidPage.isGenerateUinOrVidPageLoaded(), "Verify if generate uin or vid page page is displayed");
        String aid = TestDataReader.readData("aid");
        OtpVerificationPage otpVerification = generateUinOrVidPage.enterApplicationID(aid).clickOnGetUinOrVidButton();

        assertTrue(otpVerification.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
        assertTrue(otpVerification.verifyotpVerificationDescriptionDisplayed(), "Verify if otp verification description displayed");

        otpVerification.WatingTimeForVerificationTimerComplete();
        assertTrue(otpVerification.verifyResendCodeButtonDisplayedEnabled(), "Verify if resend code is enabled");
        otpVerification.clickOnResendButton();
        assertTrue(otpVerification.verifyOtpVerificationTimerDisplayedAfterClickOnResend(), "verify is You can resend the code displayed again after click on resend button ");
    }

    @Test
    public void generateUinOrVidUsingInvalidAid() {
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

        homePage.clickOnNextButtonForInjiTour();
        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        AddNewCardPage addNewCardPage = homePage.downloadCard();

        assertTrue(addNewCardPage.isAddNewCardPageLoaded(), "Verify if add new card page is displayed");
        RetrieveIdPage retrieveIdPage = addNewCardPage.clickOnDownloadViaUin();

        assertTrue(retrieveIdPage.isRetrieveIdPageLoaded(), "Verify if retrieve id page is displayed");
        assertEquals(retrieveIdPage.verifyGetItTextDisplayed(),"Get it now using your AID.");
        GenerateUinOrVidPage generateUinOrVidPage = retrieveIdPage.clickOnGetItNowText();

        assertTrue(generateUinOrVidPage.isGenerateUinOrVidPageLoaded(), "Verify if generate uin or vid page page is displayed");
        assertEquals(generateUinOrVidPage.getGenerateUinOrVidPageTextloaded(), "Get your UIN/VID");

        OtpVerificationPage otpVerification = generateUinOrVidPage.enterApplicationID(TestDataReader.readData("invalidaid")).clickOnGetUinOrVidButton();

        assertTrue(retrieveIdPage.isIncorrectInputFormatErrorAidMessageDisplayed(),"Verify if correct error message displayed");

    }
}