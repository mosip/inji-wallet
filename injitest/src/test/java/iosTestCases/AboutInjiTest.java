package iosTestCases;

import BaseTest.IosBaseTest;
import inji.constants.Target;
import inji.pages.*;
import inji.utils.TestDataReader;
import org.testng.annotations.Test;

import static org.testng.Assert.assertTrue;

public class AboutInjiTest extends IosBaseTest {
    @Test
    public void copyAppId() throws InterruptedException {
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
        AboutInjiPage aboutInjiPage = settingsPage.clickOnAbouInji();
        
        assertTrue(aboutInjiPage.isAboutInjiHeaderDisplayed(),"Verify id about inji page displayed");
        
        aboutInjiPage.clickOnCopyText();
        assertTrue(aboutInjiPage.isAppIdCopiedTextDisplayed(),"verify if app id is copied");
        
        aboutInjiPage.clickOnBackButton();
        assertTrue(aboutInjiPage.isCopyTextDisplayed(),"verify if copy text displayed");
        
        aboutInjiPage.clickOnClickHereButton();
        assertTrue(aboutInjiPage.isMosipUrlIsDisplayedInChrome(),"verify if mosip url is displayed in chrome");
    }
}