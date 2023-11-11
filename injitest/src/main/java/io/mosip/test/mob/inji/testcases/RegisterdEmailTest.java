package io.mosip.test.mob.inji.testcases;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertTrue;

import org.testng.annotations.Test;

import io.mosip.test.mob.inji.api.BaseTestCase;
import io.mosip.test.mob.inji.pages.AddNewCardPage;
import io.mosip.test.mob.inji.pages.AppUnlockMethodPage;
import io.mosip.test.mob.inji.pages.ChooseLanguagePage;
import io.mosip.test.mob.inji.pages.ConfirmPasscode;
import io.mosip.test.mob.inji.pages.HomePage;
import io.mosip.test.mob.inji.pages.OtpVerificationPage;
import io.mosip.test.mob.inji.pages.RetrieveIdPage;
import io.mosip.test.mob.inji.pages.SetPasscode;
import io.mosip.test.mob.inji.pages.WelcomePage;
import io.mosip.test.mob.inji.utils.TestDataReader;

public class RegisterdEmailTest extends BaseTest{
	
	 @Test
	    public void VerifyOtpSendToRegisterdEmail() throws InterruptedException {
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
//	        assertEquals(false, BaseTestCase.GetMessege(),"verifying that message is not empty");
	        
	        assertTrue(otpVerification.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
	        otpVerification.enterOtp(BaseTestCase.GetOtp(), target);

}
}
