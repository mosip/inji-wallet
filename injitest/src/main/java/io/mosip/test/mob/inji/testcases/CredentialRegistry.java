package io.mosip.test.mob.inji.testcases;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertTrue;

import org.testng.annotations.Test;

import io.mosip.test.mob.inji.api.BaseTestCase;
import io.mosip.test.mob.inji.pages.AddNewCardPage;
import io.mosip.test.mob.inji.pages.AppUnlockMethodPage;
import io.mosip.test.mob.inji.pages.ChooseLanguagePage;
import io.mosip.test.mob.inji.pages.ConfirmPasscode;
import io.mosip.test.mob.inji.pages.CredentialRegistryPage;
import io.mosip.test.mob.inji.pages.GenerateUinOrVidPage;
import io.mosip.test.mob.inji.pages.HomePage;
import io.mosip.test.mob.inji.pages.MoreOptionsPage;
import io.mosip.test.mob.inji.pages.OtpVerificationPage;
import io.mosip.test.mob.inji.pages.PleaseConfirmPopupPage;
import io.mosip.test.mob.inji.pages.RetrieveIdPage;
import io.mosip.test.mob.inji.pages.SetPasscode;
import io.mosip.test.mob.inji.pages.SettingsPage;
import io.mosip.test.mob.inji.pages.WelcomePage;
import io.mosip.test.mob.inji.utils.TestDataReader;

public class CredentialRegistry extends BaseTest {

	@Test
	public void downloadAndVerifyVcInNewEnv() throws InterruptedException {
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
        SettingsPage settingsPage = homePage.clickOnSettingIcon();
        
        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        CredentialRegistryPage credentialRegistryPage =settingsPage.clickOnCredentialRegistry();
        
        assertTrue(credentialRegistryPage.isCredentialRegistryTextBoxHeaderDisplayed(), "Verify if CredentialRegistry page is displayed");
        credentialRegistryPage.setEnterIdTextBox(TestDataReader.readData("newEnv")).clickOnSaveButton();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        credentialRegistryPage.clickOnBackArrow();
        AddNewCardPage addNewCardPage = homePage.downloadCard();

        assertTrue(addNewCardPage.isAddNewCardPageLoaded(), "Verify if add new card page is displayed");
        RetrieveIdPage retrieveIdPage = addNewCardPage.clickOnDownloadViaUin();

        assertTrue(retrieveIdPage.isRetrieveIdPageLoaded(), "Verify if retrieve id page is displayed");
        OtpVerificationPage otpVerification = retrieveIdPage.setEnterIdTextBox(TestDataReader.readData("newuin")).clickOnGenerateCardButton();

        assertTrue(otpVerification.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
        otpVerification.enterOtp(TestDataReader.readData("otp"), target);
        
        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");
        MoreOptionsPage moreOptionsPage = homePage.clickOnMoreOptionsButton();

        assertTrue(moreOptionsPage.isMoreOptionsPageLoaded(), "Verify if more options page is displayed");
        PleaseConfirmPopupPage pleaseConfirmPopupPage = moreOptionsPage.clickOnActivationPending();

        assertTrue(pleaseConfirmPopupPage.isPleaseConfirmPopupPageLoaded(), "Verify if pop up page is displayed");
        OtpVerificationPage otpVerificationPage = pleaseConfirmPopupPage.clickOnConfirmButton();
        
        assertTrue(otpVerificationPage.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
        otpVerificationPage.enterOtp(TestDataReader.readData("otp"), target);

        assertTrue(moreOptionsPage.isVcActivatedForOnlineLogin(), "Verify if VC is activated");
	}
	
	@Test
    public void cancelChangeEnvAndVerify() throws InterruptedException {
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
        SettingsPage settingsPage = homePage.clickOnSettingIcon();
        
        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        CredentialRegistryPage credentialRegistryPage =settingsPage.clickOnCredentialRegistry();
        
        assertTrue(credentialRegistryPage.isCredentialRegistryTextBoxHeaderDisplayed(), "Verify if CredentialRegistry page is displayed");
        credentialRegistryPage.setEnterIdTextBox(TestDataReader.readData("newEnv")).clickOnCancelButton();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        credentialRegistryPage.clickOnBackArrow();
        
        homePage.clickOnSettingIcon();
        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");

        settingsPage.clickOnCredentialRegistry();
        assertEquals(credentialRegistryPage.CheckEnvNotChanged(),"https://api.qa-inji.mosip.net");
	}
	
	@Test
	public void downloadAndVerifyVcInInvalidEnv() throws InterruptedException {
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
        SettingsPage settingsPage = homePage.clickOnSettingIcon();
        
        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        CredentialRegistryPage credentialRegistryPage =settingsPage.clickOnCredentialRegistry();
        
        assertTrue(credentialRegistryPage.isCredentialRegistryTextBoxHeaderDisplayed(), "Verify if CredentialRegistry page is displayed");
        credentialRegistryPage.setEnterIdTextBox(TestDataReader.readData("invalidenv")).clickOnSaveButton();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        credentialRegistryPage.clickOnBackArrow();
        
        AddNewCardPage addNewCardPage = homePage.downloadCard();
        assertTrue(homePage.isNoInternetConnectionDisplayed(), "Verify if no internet connection is displayed");
	}
	
	@Test
	public void GenerateUinOrVidInNewEnv() throws InterruptedException {
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
        SettingsPage settingsPage = homePage.clickOnSettingIcon();
        
        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        CredentialRegistryPage credentialRegistryPage =settingsPage.clickOnCredentialRegistry();
        
        assertTrue(credentialRegistryPage.isCredentialRegistryTextBoxHeaderDisplayed(), "Verify if CredentialRegistry page is displayed");
        credentialRegistryPage.setEnterIdTextBox(TestDataReader.readData("newEnv")).clickOnSaveButton();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        credentialRegistryPage.clickOnBackArrow();
        
        AddNewCardPage addNewCardPage = homePage.downloadCard();
        assertTrue(addNewCardPage.isAddNewCardPageLoaded(), "Verify if add new card page is displayed");
        RetrieveIdPage retrieveIdPage = addNewCardPage.clickOnDownloadViaUin();
        
        assertTrue(retrieveIdPage.isRetrieveIdPageLoaded(), "Verify if retrieve id page is displayed");
        GenerateUinOrVidPage generateUinOrVidPage = retrieveIdPage.clickOnGetItNowText();

        assertTrue(generateUinOrVidPage.isGenerateUinOrVidPageLoaded(), "Verify if generate uin or vid page page is displayed");
        OtpVerificationPage otpVerification = generateUinOrVidPage.enterApplicationID(TestDataReader.readData("newaid")).clickOnGetUinOrVidButton();

        assertTrue(otpVerification.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
        otpVerification.enterOtp(TestDataReader.readData("otp"), target);

        assertTrue(retrieveIdPage.isRetrieveIdPageLoaded(), "Verify if retrieve id page is displayed");
        retrieveIdPage.clickOnGenerateCardButton();

        assertTrue(otpVerification.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
        otpVerification.enterOtp(TestDataReader.readData("otp"), target);

        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");
	}
	
	@Test
	public void retrivingUinInOtherEnv() throws InterruptedException {
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
        SettingsPage settingsPage = homePage.clickOnSettingIcon();
        
        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        CredentialRegistryPage credentialRegistryPage =settingsPage.clickOnCredentialRegistry();
        
        assertTrue(credentialRegistryPage.isCredentialRegistryTextBoxHeaderDisplayed(), "Verify if CredentialRegistry page is displayed");
        credentialRegistryPage.setEnterIdTextBox(TestDataReader.readData("newEnv")).clickOnSaveButton();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        credentialRegistryPage.clickOnBackArrow();
        
        AddNewCardPage addNewCardPage = homePage.downloadCard();
        assertTrue(addNewCardPage.isAddNewCardPageLoaded(), "Verify if add new card page is displayed");
        RetrieveIdPage retrieveIdPage = addNewCardPage.clickOnDownloadViaUin();
        
        assertTrue(retrieveIdPage.isRetrieveIdPageLoaded(), "Verify if retrieve id page is displayed");
        GenerateUinOrVidPage generateUinOrVidPage = retrieveIdPage.clickOnGetItNowText();

        assertTrue(generateUinOrVidPage.isGenerateUinOrVidPageLoaded(), "Verify if generate uin or vid page page is displayed");
        OtpVerificationPage otpVerification = generateUinOrVidPage.enterApplicationID(TestDataReader.readData("aid")).clickOnGetUinOrVidButton();

        assertTrue(retrieveIdPage.isAidIsNotReadyYetErrorDisplayed(), "Verify if aid is not ready displayed");
	}
	
	@Test
	public void downloadAndVerifyVcInTwoEnv() throws InterruptedException {
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
        SettingsPage settingsPage = homePage.clickOnSettingIcon();
        
        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        CredentialRegistryPage credentialRegistryPage =settingsPage.clickOnCredentialRegistry();
        
        assertTrue(credentialRegistryPage.isCredentialRegistryTextBoxHeaderDisplayed(), "Verify if CredentialRegistry page is displayed");
        credentialRegistryPage.setEnterIdTextBox(TestDataReader.readData("newEnv")).clickOnSaveButton();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        credentialRegistryPage.clickOnBackArrow();
        
        AddNewCardPage addNewCardPage = homePage.downloadCard();
        assertTrue(addNewCardPage.isAddNewCardPageLoaded(), "Verify if add new card page is displayed");
        RetrieveIdPage retrieveIdPage = addNewCardPage.clickOnDownloadViaUin();

        assertTrue(retrieveIdPage.isRetrieveIdPageLoaded(), "Verify if retrieve id page is displayed");
        OtpVerificationPage otpVerification = retrieveIdPage.setEnterIdTextBox(TestDataReader.readData("newuin")).clickOnGenerateCardButton();

        assertTrue(otpVerification.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
        otpVerification.enterOtp(TestDataReader.readData("otp"), target);
        
        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");
        homePage.clickOnSettingIcon();
        
        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        settingsPage.clickOnCredentialRegistry();
        
        assertTrue(credentialRegistryPage.isCredentialRegistryTextBoxHeaderDisplayed(), "Verify if CredentialRegistry page is displayed");
        credentialRegistryPage.setEnterIdTextBox(TestDataReader.readData("injiEnv")).clickOnSaveButton();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        credentialRegistryPage.clickOnBackArrow();
        
         homePage.downloadCard();
        assertTrue(addNewCardPage.isAddNewCardPageLoaded(), "Verify if add new card page is displayed");
         addNewCardPage.clickOnDownloadViaUin();

        assertTrue(retrieveIdPage.isRetrieveIdPageLoaded(), "Verify if retrieve id page is displayed");
         retrieveIdPage.setEnterIdTextBox(TestDataReader.readData("uin")).clickOnGenerateCardButton();

        assertTrue(otpVerification.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
        otpVerification.enterOtp(BaseTestCase.getOtp(), target);
        
        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");
        assertTrue(homePage.isSecondNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");
	}
	
	@Test
	public void downloadVcAndActivateItInOtherEnv() throws InterruptedException {
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
        SettingsPage settingsPage = homePage.clickOnSettingIcon();
        
        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        CredentialRegistryPage credentialRegistryPage =settingsPage.clickOnCredentialRegistry();
        
        assertTrue(credentialRegistryPage.isCredentialRegistryTextBoxHeaderDisplayed(), "Verify if CredentialRegistry page is displayed");
        credentialRegistryPage.setEnterIdTextBox(TestDataReader.readData("newEnv")).clickOnSaveButton();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        credentialRegistryPage.clickOnBackArrow();
        
        AddNewCardPage addNewCardPage = homePage.downloadCard();
        assertTrue(addNewCardPage.isAddNewCardPageLoaded(), "Verify if add new card page is displayed");
        RetrieveIdPage retrieveIdPage = addNewCardPage.clickOnDownloadViaUin();

        assertTrue(retrieveIdPage.isRetrieveIdPageLoaded(), "Verify if retrieve id page is displayed");
        OtpVerificationPage otpVerification = retrieveIdPage.setEnterIdTextBox(TestDataReader.readData("newuin")).clickOnGenerateCardButton();

        assertTrue(otpVerification.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
        otpVerification.enterOtp(TestDataReader.readData("otp"), target);
        
        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");
        homePage.clickOnSettingIcon();
        
        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        settingsPage.clickOnCredentialRegistry();
        
        assertTrue(credentialRegistryPage.isCredentialRegistryTextBoxHeaderDisplayed(), "Verify if CredentialRegistry page is displayed");
        credentialRegistryPage.setEnterIdTextBox(TestDataReader.readData("injiEnv")).clickOnSaveButton();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        credentialRegistryPage.clickOnBackArrow();
        
        MoreOptionsPage moreOptionsPage = homePage.clickOnMoreOptionsButton();

        assertTrue(moreOptionsPage.isMoreOptionsPageLoaded(), "Verify if more options page is displayed");
        PleaseConfirmPopupPage pleaseConfirmPopupPage = moreOptionsPage.clickOnActivationPending();

        assertTrue(pleaseConfirmPopupPage.isPleaseConfirmPopupPageLoaded(), "Verify if pop up page is displayed");
        OtpVerificationPage otpVerificationPage = pleaseConfirmPopupPage.clickOnConfirmButton();
        
        assertTrue(moreOptionsPage.isSomthingIsWrongPopupVisible(), "Verify if somthing went wrong please try again popup displayed");
	}
}
