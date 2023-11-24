package io.mosip.test.mob.inji.androidTestCases;

import io.mosip.test.mob.inji.BaseTest.AndroidBaseTest;
import io.mosip.test.mob.inji.BaseTest.BaseTest;
import io.mosip.test.mob.inji.constants.Target;
import org.testng.annotations.Test;
import io.mosip.test.mob.inji.pages.*;
import io.mosip.test.mob.inji.utils.TestDataReader;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertTrue;

public class VerifyHelpPageTest extends AndroidBaseTest {

    @Test
    public void verifyHelpPage() {

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
        HelpPage helpPage = homePage.clickOnHelpIcon();
        
        assertEquals(helpPage.ishelpPageContentEmpty(),false,"verifying text is not empty");
        helpPage.scrollPerformInHelpPage();

        assertTrue(helpPage.isHelpPageLoaded(), "Verify if help page is displayed");
        helpPage.exitHelpPage();

        
        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
    }

}
