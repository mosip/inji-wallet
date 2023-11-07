package io.mosip.test.mob.inji.testcases;

import org.testng.annotations.Test;

import io.mosip.test.mob.inji.api.BaseTestCase;
import io.mosip.test.mob.inji.pages.*;
import io.mosip.test.mob.inji.utils.TestDataReader;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertFalse;
import static org.testng.Assert.assertTrue;

public class DeletingVcTest extends BaseTest {
    @Test
    public void deleteVcAndVerifyInHistory() throws InterruptedException {
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

        assertTrue(otpVerification.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
        otpVerification.enterOtp(GetOtp(), target);

        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");

        MoreOptionsPage moreOptionsPage = homePage.clickOnMoreOptionsButton();
        assertTrue(moreOptionsPage.isMoreOptionsPageLoaded(), "Verify if more options page is displayed");

        PleaseConfirmPopupPage pleaseConfirmPopupPage = moreOptionsPage.clickOnRemoveFromWallet();
        assertTrue(pleaseConfirmPopupPage.isPleaseConfirmPopupPageLoaded(), "Verify if pop up page is displayed");

        pleaseConfirmPopupPage.clickOnConfirmButton();
        assertFalse(homePage.isNoVCDownloaded(), "Verify if VC is removed");

        HistoryPage historyPage = homePage.clickOnHistoryButton();
        assertTrue(historyPage.isHistoryPageLoaded(), "Verify if history page is displayed");
        historyPage.verifyHistory(BaseTestCase.uin + " Removed from wallet", target);

    }
    
    @Test
    public void cancelDeleteVc() throws InterruptedException {
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

        assertTrue(otpVerification.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
        otpVerification.enterOtp(GetOtp(), target);

        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");

        MoreOptionsPage moreOptionsPage = homePage.clickOnMoreOptionsButton();
        assertTrue(moreOptionsPage.isMoreOptionsPageLoaded(), "Verify if more options page is displayed");

        PleaseConfirmPopupPage pleaseConfirmPopupPage = moreOptionsPage.clickOnRemoveFromWallet();
        assertTrue(pleaseConfirmPopupPage.isPleaseConfirmPopupPageLoaded(), "Verify if pop up page is displayed");

        pleaseConfirmPopupPage.clickOnNoButton();
        assertTrue(moreOptionsPage.isMoreOptionsPageLoaded(), "Verify if more options page is displayed");
        
        moreOptionsPage.ClickOnCloseButton();
        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");
        
    }
    
    
    @Test
    public void closingEllipsis() throws InterruptedException {
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

        assertTrue(otpVerification.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
        otpVerification.enterOtp(GetOtp(), target);

        assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");

         homePage.clickOnMoreOptionsButton().ClickOnCloseButton();
         assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");
    }
    
   
    
  @Test
  public void DownloadingDeletedVc() throws InterruptedException {
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

      assertTrue(otpVerification.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
      otpVerification.enterOtp(GetOtp(), target);

      assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");

      MoreOptionsPage moreOptionsPage = homePage.clickOnMoreOptionsButton();
      assertTrue(moreOptionsPage.isMoreOptionsPageLoaded(), "Verify if more options page is displayed");

      PleaseConfirmPopupPage pleaseConfirmPopupPage = moreOptionsPage.clickOnRemoveFromWallet();
      assertTrue(pleaseConfirmPopupPage.isPleaseConfirmPopupPageLoaded(), "Verify if pop up page is displayed");

      pleaseConfirmPopupPage.clickOnConfirmButton();
      assertFalse(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if VC is removed");

        homePage.downloadCard();

      assertTrue(addNewCardPage.isAddNewCardPageLoaded(), "Verify if add new card page is displayed");
       addNewCardPage.clickOnDownloadViaUin();

      assertTrue(retrieveIdPage.isRetrieveIdPageLoaded(), "Verify if retrieve id page is displayed");
       retrieveIdPage.setEnterIdTextBox(BaseTestCase.uin).clickOnGenerateCardButton();

      assertTrue(otpVerification.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
      otpVerification.enterOtp(GetOtp(), target);

      assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");
      
      HistoryPage historyPage = homePage.clickOnHistoryButton();

      assertTrue(historyPage.isHistoryPageLoaded(), "Verify if history page is displayed");
      assertTrue(historyPage.verifyHistory(BaseTestCase.uin, target));
      
      historyPage.getNumberOfRecordsInHistory(BaseTestCase.uin, target);
      assertEquals(historyPage.getNumberOfRecordsInHistory(BaseTestCase.uin, target),2);

  }
  
  @Test
  public void closingEllipsisByBackKey() throws InterruptedException {
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

      assertTrue(otpVerification.isOtpVerificationPageLoaded(), "Verify if otp verification page is displayed");
      otpVerification.enterOtp(GetOtp(), target);

      assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");

       homePage.clickOnMoreOptionsButton();
       
       assertTrue(homePage.isNameDisplayed(TestDataReader.readData("fullName")), "Verify if full name is displayed");
  }
  
    
}
