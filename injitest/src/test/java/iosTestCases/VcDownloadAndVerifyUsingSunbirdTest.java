package iosTestCases;

import BaseTest.AndroidBaseTest;
import BaseTest.IosBaseTest;
import inji.constants.Target;
import inji.pages.*;
import inji.utils.IosUtil;
import inji.utils.TestDataReader;
import org.testng.annotations.Test;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertTrue;

public class VcDownloadAndVerifyUsingSunbirdTest extends IosBaseTest {
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
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.IOS);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.enterPasscodeInConfirmPasscodePage(TestDataReader.readData("passcode"), Target.IOS);

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        AddNewCardPage addNewCardPage = homePage.downloadCard();


        assertTrue(addNewCardPage.isDownloadViaSunbirdDisplayed(), "Verify if download sunbird displayed");
        SunbirdLoginPage sunbirdLoginPage =  addNewCardPage.clickOnDownloadViaSunbird();
        addNewCardPage.clickOnInsuranceCredential();
        addNewCardPage.clickOnContinueButtonInSigninPopupIos();
        sunbirdLoginPage.enterPolicyNumberTextBox(TestDataReader.readData("policyNumberSunbird"));
        sunbirdLoginPage.enterFullNameTextBox(TestDataReader.readData("fullNameSunbird"));
        sunbirdLoginPage.enterDateOfBirthTextBox();
        IosUtil.scrollToElement(driver,100,800,100,200);
        sunbirdLoginPage.clickOnloginButton();

        assertTrue(sunbirdLoginPage.isSunbirdCardIsActive(), "Verify if download sunbird displayed active");
        assertTrue(sunbirdLoginPage.isSunbirdCardLogoIsDisplayed(), "Verify if download sunbird logo displayed");
        assertEquals(sunbirdLoginPage.getFullNameForSunbirdCard(),TestDataReader.readData("fullNameSunbird"));
        sunbirdLoginPage.openDetailedSunbirdVcView();

        assertEquals(sunbirdLoginPage.getFullNameForSunbirdCard(),TestDataReader.readData("fullNameSunbird"));
        assertEquals(sunbirdLoginPage.getPolicyNameForSunbirdCard(),TestDataReader.readData("policyNameSunbird"));
        assertEquals(sunbirdLoginPage.getPhoneNumberForSunbirdCard(),TestDataReader.readData("phoneNumberSunbird"));
        assertEquals(sunbirdLoginPage.getDateofBirthValueForSunbirdCard(),TestDataReader.readData("dateOfBirthSunbird"));
        assertEquals(sunbirdLoginPage.getGenderValueForSunbirdCard(),TestDataReader.readData("genderValueSunbird"));
        assertEquals(sunbirdLoginPage.getEmailIdValueForSunbirdCard(),TestDataReader.readData("emailIdValueSunbird"));
        assertEquals(sunbirdLoginPage.getStatusValueForSunbirdCard(),TestDataReader.readData("status"));
        assertTrue(sunbirdLoginPage.isPolicyExpiresOnValueDisplayed(), "Verify if policy expireson value displayed");
        assertTrue(sunbirdLoginPage.isbenefitsValueDisplayed(), "Verify if policy expireson value displayed");
        assertEquals(sunbirdLoginPage.getIdTypeValueForSunbirdCard(),TestDataReader.readData("idTypeSunbird"));
    }
    
   }
