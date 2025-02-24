package androidTestCases;

import BaseTest.AndroidBaseTest;
import inji.constants.Target;
import inji.pages.*;
import inji.utils.TestDataReader;
import org.testng.annotations.Test;

import static org.testng.Assert.*;

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
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.ANDROID);

        homePage.clickOnNextButtonForInjiTour();
        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        HelpPage helpPage = homePage.clickOnHelpIcon();

        assertFalse(helpPage.isHelpPageContentEmpty(), "verifying text is not empty");
        helpPage.clickOnBackButton();

        assertEquals(homePage.verifyLanguageForNoVCDownloadedPageLoaded(), "Bring your digital identity");
        homePage.clickOnHelpIcon();

        assertTrue(helpPage.isHelpPageLoaded(), "Verify if help page is displayed");
        assertTrue(helpPage.isWhatIsShareWithSelfieTextdHeader(),"verify if share with selfie text displayed");
        helpPage.exitHelpPage();

        homePage.clickOnNextButtonForInjiTour();
        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
    }

}