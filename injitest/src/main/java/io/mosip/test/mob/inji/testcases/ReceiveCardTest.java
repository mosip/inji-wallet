package io.mosip.test.mob.inji.testcases;

import static org.testng.Assert.assertTrue;

import org.testng.annotations.Test;

import io.mosip.test.mob.inji.pages.AppUnlockMethodPage;
import io.mosip.test.mob.inji.pages.ChooseLanguagePage;
import io.mosip.test.mob.inji.pages.ConfirmPasscode;
import io.mosip.test.mob.inji.pages.HomePage;
import io.mosip.test.mob.inji.pages.ReceiveCardPage;
import io.mosip.test.mob.inji.pages.SetPasscode;
import io.mosip.test.mob.inji.pages.SettingsPage;
import io.mosip.test.mob.inji.pages.WelcomePage;
import io.mosip.test.mob.inji.utils.TestDataReader;

public class ReceiveCardTest extends BaseTest {
	
	 @Test
	    public void verifyRecivedCard() {
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
	        
	        ReceiveCardPage receiveCardPage = settingsPage.clickOnReceiveCard();
	        assertTrue(receiveCardPage.isReceiveCardHederDisplayed(), "Verify if QR code  header is displayed");
	        assertTrue(receiveCardPage.isWaitingForConnectionDisplayed(), "Verify if waiting for connection displayed");
	 }
	 
	 @Test
	    public void verifyRecivedCardInFilipinoLanguage() {
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
	        settingsPage.clickOnLanguage().clickOnFilipinoLanguage();

	        assertTrue(settingsPage.verifyFilipinoLanguage(), "Verify if language is changed to filipino");
	        ReceiveCardPage receiveCardPage =settingsPage.clickOnReceiveCardFilipinoLanguage();
	        
	        assertTrue(receiveCardPage.isReceiveCardHederInFilipinoLanguageDisplayed(), "Verify if QR code  header is displayed filipino");
	 }
}
