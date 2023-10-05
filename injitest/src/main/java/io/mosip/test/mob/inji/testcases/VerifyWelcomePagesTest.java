package io.mosip.test.mob.inji.testcases;

import org.testng.annotations.Test;
import io.mosip.test.mob.inji.pages.*;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertTrue;

public class VerifyWelcomePagesTest extends BaseTest {

	@Test(groups = "VWPT")
    public void verifyWelcomePagesContent() {

        ChooseLanguagePage chooseLanguagePage = new ChooseLanguagePage(driver);
        assertTrue(chooseLanguagePage.isChooseLanguagePageLoaded(), "Verify if choose language page is displayed");
        WelcomePage welcomePage = chooseLanguagePage.clickOnSavePreference();

        assertTrue(welcomePage.isWelcomePageLoaded(), "Verify if welcome page is loaded");
        assertEquals(welcomePage.getWelcomeDescription(), "Keep your digital credential with you at all times. Inji helps you manage and use them effectively. To get started, add cards to your profile.");
        welcomePage.clickOnNextButton();

        TrustedDigitalWalletPage trustedDigitalWalletPage = new TrustedDigitalWalletPage(driver);
        assertTrue(trustedDigitalWalletPage.isTrustedDigitalWalletPageLoaded(), "Verify if trusted digital wallet page is loaded");
        assertEquals(trustedDigitalWalletPage.getTrustedDigitalWalletDescription(), "Store and carry all your important cards in a single trusted wallet.");
        trustedDigitalWalletPage.clickOnNextButton();

        SecureSharingPage secureSharingPage = new SecureSharingPage(driver);
        assertTrue(secureSharingPage.isSecureSharingPageLoaded(), "Verify if secure sharing page is loaded");
        assertEquals(secureSharingPage.getSecureSharingDescription(), "Share your cards securely in a hassle free way and avail various services.");
        secureSharingPage.clickOnNextButton();

        HassleFreeAuthenticationPage hassleFreeAuthenticationPage = new HassleFreeAuthenticationPage(driver);
        assertTrue(hassleFreeAuthenticationPage.isHassleFreeAuthenticationPageLoaded(), "Verify if hassle free authentication page is loaded");
        assertEquals(hassleFreeAuthenticationPage.getHassleFreeAuthenticationDescription(), "Authenticate yourself with ease using the stored digital credential.");
    }
}
