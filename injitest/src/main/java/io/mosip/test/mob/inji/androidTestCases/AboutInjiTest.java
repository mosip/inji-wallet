package io.mosip.test.mob.inji.androidTestCases;

import io.mosip.test.mob.inji.BaseTest.AndroidBaseTest;
import io.mosip.test.mob.inji.BaseTest.BaseTest;
import io.mosip.test.mob.inji.BaseTest.IosBaseTest;
import io.mosip.test.mob.inji.constants.Target;
import io.mosip.test.mob.inji.pages.*;
import io.mosip.test.mob.inji.utils.TestDataReader;
import org.testng.annotations.Test;

import static org.testng.Assert.*;

public class AboutInjiTest extends AndroidBaseTest {
    @Test
    public void copyAppId() {
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
        HomePage homePage = confirmPasscode.confirmPasscode(TestDataReader.readData("passcode"), Target.ANDROID);

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();
        
        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        AboutInjiPage aboutInjiPage = settingsPage.clickOnAbouInji();
        
        assertTrue(aboutInjiPage.isaboutInjiHeaderDisplayed(),"Verify id about inji page displayed");
        
        aboutInjiPage.clickOnCopy();
        assertTrue(aboutInjiPage.isAppidIsCopied(),"verify if app id is copied");
        
        aboutInjiPage.clickOnBack();
        assertTrue(aboutInjiPage.isCopyTextDisplayed(),"verify if copy text displayed");
    }
}