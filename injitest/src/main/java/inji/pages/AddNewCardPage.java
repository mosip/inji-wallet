package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class AddNewCardPage extends BasePage{

    @AndroidFindBy(accessibility = "title")
    @iOSXCUITFindBy(accessibility = "title")
    private WebElement addNewCardHeader;

    @AndroidFindBy(accessibility = "issuerHeading-MosipOtp")
    @iOSXCUITFindBy(accessibility = "issuerHeading-MosipOtp")
    private WebElement downloadViaUin;

    @AndroidFindBy(accessibility = "goBack")
    @iOSXCUITFindBy(accessibility = "goBack")
    private WebElement backButton;

    @AndroidFindBy(accessibility = "issuerHeading-Mosip")
    @iOSXCUITFindBy(accessibility = "issuerHeading-Mosip")
    private WebElement downloadViaEsignet;

    @AndroidFindBy(accessibility = "issuerHeading-MockCertify")
    @iOSXCUITFindBy(accessibility = "issuerHeading-MockCertify")
    private WebElement downloadViaMockCertify;
    @iOSXCUITFindBy(accessibility = "Continue")
    private WebElement continueButton;

    @iOSXCUITFindBy(accessibility = "Cancel")
    private WebElement cancelButton;

    @AndroidFindBy(accessibility = "issuersScreenDescription")
    @iOSXCUITFindBy(accessibility = "issuersScreenDescription")
    private WebElement addNewCardGuideMessage;

    @AndroidFindBy(accessibility = "issuerDescription-MosipOtp")
    @iOSXCUITFindBy(accessibility = "issuerDescription-MosipOtp")
    private WebElement issuerDescriptionMosip;

    @AndroidFindBy(accessibility = "issuerDescription-Mosip")
    @iOSXCUITFindBy(accessibility = "issuerDescription-Mosip")
    private WebElement issuerDescriptionEsignet;

    @AndroidFindBy(className = "android.widget.EditText")
    @iOSXCUITFindBy(accessibility = "issuerSearchBar")
    private WebElement issuerSearchBar;

    @AndroidFindBy(accessibility = "issuerHeading-StayProtected")
    @iOSXCUITFindBy(accessibility = "issuerHeading-StayProtected")
    private WebElement downloadViaSunbird;

    @AndroidFindBy(accessibility = "credentialTypeHeading-InsuranceCredential")
    @iOSXCUITFindBy(accessibility = "credentialTypeHeading-InsuranceCredential")
    private WebElement credentialTypeHeadingInsuranceCredential;

    @AndroidFindBy(accessibility = "credentialTypeHeading-MosipVerifiableCredential")
    @iOSXCUITFindBy(accessibility = "credentialTypeHeading-MosipVerifiableCredential")
    private WebElement credentialTypeHeadingMOSIPVerifiableCredential;

    @AndroidFindBy(accessibility = "credentialTypeHeading-MockVerifiableCredential_mdoc")
    @iOSXCUITFindBy(accessibility = "credentialTypeHeading-MockVerifiableCredential_mdoc")
    private WebElement credentialTypeHeadingMockVerifiableCredential_mdoc;

    public AddNewCardPage(AppiumDriver driver) {
        super(driver);
    }

    public String  verifyLanguageForAddNewCardGuideMessage(){
        return getTextFromLocator(addNewCardGuideMessage);
    }

    public boolean isAddNewCardPageGuideMessageForEsignetDisplayed() {
        return this.isElementDisplayed(addNewCardGuideMessage);
    }

    public boolean isAddNewCardPageLoaded() {
        return this.isElementDisplayed(addNewCardHeader);
    }

    public RetrieveIdPage clickOnDownloadViaUin(){
        clickOnElement(downloadViaUin);
        if(isElementDisplayed(credentialTypeHeadingMOSIPVerifiableCredential)){
            clickOnElement(credentialTypeHeadingMOSIPVerifiableCredential);
        }
        return new RetrieveIdPage(driver);
    }

    public void clickOnBack() {
        clickOnElement(backButton);
    }

    public boolean isAddNewCardGuideMessageDisplayed() {
        return this.isElementDisplayed(addNewCardGuideMessage);
    }

    public boolean isDownloadViaUinDisplayed() {
        return this.isElementDisplayed(downloadViaUin);
    }

    public boolean isDownloadViaUinDisplayedInHindi() {
        return this.isElementDisplayed(downloadViaUin);
    }

    public boolean isDownloadViaEsignetDisplayed() {
        return this.isElementDisplayed(downloadViaEsignet);
    }

    public boolean isDownloadViaMockCertifyDisplayed() {
        return this.isElementDisplayed(downloadViaMockCertify);
    }

    public boolean isDownloadViaEsignetDisplayedInHindi() {
        return this.isElementDisplayed(downloadViaEsignet);
    }

    public boolean isDownloadViaEsignetDisplayedinFillpino() {
        return this.isElementDisplayed(downloadViaEsignet);
    }

    public EsignetLoginPage clickOnDownloadViaEsignet(){
        clickOnElement(downloadViaEsignet);

        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        if(isElementDisplayed(credentialTypeHeadingMOSIPVerifiableCredential)) {
            clickOnElement(credentialTypeHeadingMOSIPVerifiableCredential);
        }
        return new EsignetLoginPage(driver);
    }

    public MockCertifyLoginPage clickOnDownloadViaMockCertify(){
        clickOnElement(downloadViaMockCertify);

        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        if(isElementDisplayed(credentialTypeHeadingMockVerifiableCredential_mdoc)) {
            clickOnElement(credentialTypeHeadingMockVerifiableCredential_mdoc);
        }
        return new MockCertifyLoginPage(driver);
    }

    public void clickOnContinueButtonInSigninPopupIos(){
        if(isElementDisplayed(continueButton))
        clickOnElement(continueButton);
    }

    public void clickOnCancelButtonInSigninPopupIos(){
        clickOnElement(cancelButton);
    }

    public void isBackButtonDisplayed() {
        backButton.isDisplayed();
    }

    public boolean isAddNewCardGuideMessageDisplayedInFillopin() {
        return this.isElementDisplayed(addNewCardGuideMessage);
    }

    public boolean isAddNewCardGuideMessageDisplayedInHindi() {
        return this.isElementDisplayed(addNewCardGuideMessage);
    }
    public boolean isIssuerDescriptionMosipDisplayed() {
        return this.isElementDisplayed(issuerDescriptionMosip);
    }

    public boolean isIssuerDescriptionEsignetDisplayed() {
        return this.isElementDisplayed(issuerDescriptionEsignet);
    }

    public boolean isIssuerSearchBarDisplayed() {
        return this.isElementDisplayed(issuerSearchBar);
    }

    public boolean isIssuerSearchBarDisplayedInFilipino() {
        return this.isElementDisplayed(issuerSearchBar);
    }

    public boolean isIssuerSearchBarDisplayedInHindi() {
        return this.isElementDisplayed(issuerSearchBar);
    }

    public void sendTextInIssuerSearchBar(String text) {
        clearTextBoxAndSendKeys(issuerSearchBar, text);
    }

    public boolean isDownloadViaSunbirdDisplayed() {
        return this.isElementDisplayed(downloadViaSunbird);
    }
    public SunbirdLoginPage clickOnDownloadViaSunbird(){
        clickOnElement(downloadViaSunbird);
        return new SunbirdLoginPage(driver);
    }
    public void clickOnCredentialTypeHeadingInsuranceCredential(){
        if(isElementDisplayed(credentialTypeHeadingInsuranceCredential)) {
            clickOnElement(credentialTypeHeadingInsuranceCredential);
        }
    }
}

