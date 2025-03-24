package androidTestCases;

import BaseTest.AndroidBaseTest;
import inji.constants.Target;
import inji.pages.*;
import inji.utils.TestDataReader;
import org.testng.annotations.Test;

import static inji.api.AdminTestUtil.fullName;
import static inji.api.AdminTestUtil.policyNumber;
import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertTrue;

public class VcDownloadAndVerifyUsingSunbirdTest extends AndroidBaseTest {
    @Test
    public void downloadAndVerifyVcUsingUinViaSunbird() throws InterruptedException {
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
        AddNewCardPage addNewCardPage = homePage.downloadCard();

        assertTrue(addNewCardPage.isAddNewCardPageLoaded(), "Verify if add new card page is displayed");
        assertTrue(addNewCardPage.isIssuerDescriptionEsignetDisplayed(), "Verify if issuer description  esignet displayed");
        assertTrue(addNewCardPage.isIssuerSearchBarDisplayed(), "Verify if issuer search bar displayed");
        assertTrue(addNewCardPage.isAddNewCardPageLoaded(), "Verify if add new card page is displayed");
        assertTrue(addNewCardPage.isAddNewCardPageGuideMessageForEsignetDisplayed(), "Verify if add new card guide message displayed");
        assertTrue(addNewCardPage.isDownloadViaSunbirdDisplayed(), "Verify if download sunbird displayed");
        SunbirdLoginPage sunbirdLoginPage =  addNewCardPage.clickOnDownloadViaSunbird();
        addNewCardPage.clickOnCredentialTypeHeadingInsuranceCredential();

        sunbirdLoginPage.enterPolicyNumberTextBox(policyNumber);
        sunbirdLoginPage.enterFullNameTextBox(fullName);
        sunbirdLoginPage.enterDateOfBirthTextBox();
        sunbirdLoginPage.clickOnloginButton();

        assertTrue(sunbirdLoginPage.isSunbirdCardIsActive(), "Verify if download sunbird displayed active");
        assertTrue(sunbirdLoginPage.isSunbirdCardLogoIsDisplayed(), "Verify if download sunbird logo displayed");
//        assertEquals(sunbirdLoginPage.getFullNameForSunbirdCard(),TestDataReader.readData("fullNameSunbird"));

        sunbirdLoginPage.openDetailedSunbirdVcView();

        assertEquals(sunbirdLoginPage.getFullNameForSunbirdCard(),TestDataReader.readData("fullNameSunbird"));
        assertEquals(sunbirdLoginPage.getPolicyNameForSunbirdCard(),TestDataReader.readData("policyNameSunbird"));
        assertEquals(sunbirdLoginPage.getPhoneNumberForSunbirdCard(),TestDataReader.readData("phoneNumberSunbird"));
        assertTrue(sunbirdLoginPage.isDateofBirthValueForSunbirdCardDisplayed());
        assertEquals(sunbirdLoginPage.getGenderValueForSunbirdCard(),TestDataReader.readData("genderValueSunbird"));
        assertEquals(sunbirdLoginPage.getEmailIdValueForSunbirdCard(),TestDataReader.readData("emailIdValueSunbird"));
        assertEquals(sunbirdLoginPage.getStatusValueForSunbirdCard(),TestDataReader.readData("statusValueSunbird"));
        assertEquals(sunbirdLoginPage.getIdTypeValueForSunbirdCard(),TestDataReader.readData("idTypeSunbird"));
        assertEquals(sunbirdLoginPage.getStatusValueForSunbirdCard(),TestDataReader.readData("statusValueSunbirdForVaild"));
    }
}