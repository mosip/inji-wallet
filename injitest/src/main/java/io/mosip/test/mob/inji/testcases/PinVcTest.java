package io.mosip.test.mob.inji.testcases;

import org.testng.annotations.Test;

import io.mosip.test.mob.inji.api.BaseTestCase;
import io.mosip.test.mob.inji.pages.*;
import io.mosip.test.mob.inji.utils.TestDataReader;

import static org.testng.Assert.assertTrue;

public class PinVcTest extends BaseTest {

    @Test
    public void pinVc() throws InterruptedException  {

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
        otpVerification.enterOtp(BaseTestCase.getOtp(), target);

        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");
        MoreOptionsPage moreOptionsPage = homePage.clickOnMoreOptionsButton();

        assertTrue(moreOptionsPage.isMoreOptionsPageLoaded(), "Verify if more options page is displayed");
        moreOptionsPage.clickOnPinOrUnPinCard();

        assertTrue(homePage.isPinIconDisplayed(), "Verify if pin icon on vc is displayed");
    }
    
    @Test
    public void VerifyCameraOpenAfterPinVc() throws InterruptedException {
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
        otpVerification.enterOtp(BaseTestCase.getOtp(), target);

        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");
        MoreOptionsPage moreOptionsPage = homePage.clickOnMoreOptionsButton();

        assertTrue(moreOptionsPage.isMoreOptionsPageLoaded(), "Verify if more options page is displayed");
        moreOptionsPage.clickOnPinOrUnPinCard();

        assertTrue(homePage.isPinIconDisplayed(), "Verify if pin icon on vc is displayed");
        ScanPage scanPage=homePage.clickOnScanButton();
        
        assertTrue(scanPage.isCameraPageLoaded(), "Verify if pin icon on vc is displayed");
        assertTrue(scanPage.isFlipCameraClickable(),"Verify if flip camera is enabled");
    }
    
    @Test
    public void downloadVcViaEsignetAndPinUnpin() throws InterruptedException {
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
        EsignetLoginPage esignetLoginPage =  addNewCardPage.clickOnDownloadViaEsignet();

        assertTrue(esignetLoginPage.isEsignetLoginPageDisplayed(), "Verify if esignet login page displayed");
        esignetLoginPage.clickOnEsignetLoginWithOtpButton();
        
        assertTrue(esignetLoginPage.isEnterYourVidTextDisplayed(), "Verify if enter your vid text is displayed");
        OtpVerificationPage otpVerification= esignetLoginPage.setEnterIdTextBox(TestDataReader.readData("uin"));
        
        esignetLoginPage.clickOnGetOtpButton();
        assertTrue(esignetLoginPage.isOtpHasSendMessageDisplayed(),"verify if otp page is displayed");
        
        otpVerification.enterOtpForEsignet(TestDataReader.readData("otp"), target);
        esignetLoginPage.clickOnVerifyButton();
        
        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");
        
        MoreOptionsPage moreOptionsPage = homePage.clickOnMoreOptionsButton();

        assertTrue(moreOptionsPage.isMoreOptionsPageLoaded(), "Verify if more options page is displayed");
        moreOptionsPage.clickOnPinOrUnPinCard();
        
        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
         homePage.downloadCard();

        assertTrue(addNewCardPage.isAddNewCardPageLoaded(), "Verify if add new card page is displayed");
         addNewCardPage.clickOnDownloadViaEsignet();

        assertTrue(esignetLoginPage.isEsignetLoginPageDisplayed(), "Verify if esignet login page displayed");
        esignetLoginPage.clickOnEsignetLoginWithOtpButton();
        
        assertTrue(esignetLoginPage.isEnterYourVidTextDisplayed(), "Verify if enter your vid text is displayed");
        esignetLoginPage.setEnterIdTextBox(TestDataReader.readData("uin"));
        
        esignetLoginPage.clickOnGetOtpButton();
        assertTrue(esignetLoginPage.isOtpHasSendMessageDisplayed(),"verify if otp page is displayed");
        
        otpVerification.enterOtpForEsignet(TestDataReader.readData("otp"), target);
        esignetLoginPage.clickOnVerifyButton();

        assertTrue(homePage.isPinIconDisplayed(), "Verify if pin icon on vc is displayed");
        assertTrue(homePage.isSecondNameDisplayed(TestDataReader.readData("fullName")), "Verify if second card name is displayed");
         homePage.clickOnMoreOptionsButton();

        assertTrue(moreOptionsPage.isMoreOptionsPageLoaded(), "Verify if more options page is displayed");
        moreOptionsPage.clickOnPinOrUnPinCard();
        
    }
    
}
