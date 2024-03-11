package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class BackupAndRestorePage extends BasePage {

    @AndroidFindBy(accessibility = "backupAndRestore")
    @iOSXCUITFindBy(accessibility = "backupAndRestore")
    private WebElement backupAndRestoreHeader;

    @AndroidFindBy(accessibility = "backupProcessInfo")
    @iOSXCUITFindBy(accessibility = "backupProcessInfo")
    private WebElement backupProcessInfo;

    @AndroidFindBy(accessibility = "cloudInfo")
    @iOSXCUITFindBy(accessibility = "cloudInfo")
    private WebElement cloudInfo;

    @AndroidFindBy(accessibility = "googleDriveTitle")
    @iOSXCUITFindBy(accessibility = "googleDriveTitle")
    private WebElement googleDriveTitle;

    @AndroidFindBy(accessibility = "googleDriveIcon")
    @iOSXCUITFindBy(accessibility = "googleDriveIcon")
    private WebElement googleDriveIcon;

    @AndroidFindBy(accessibility = "goBack")
    @iOSXCUITFindBy(accessibility = "goBack")
    private WebElement goBackButton;

    @AndroidFindBy(className = "android.view.View")
    @iOSXCUITFindBy(className = "android.view.View")
    private WebElement proceedButton;

    @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Add another account\")")
    public WebElement addAnotherAccount;

    @AndroidFindBy(xpath = "//android.widget.TextView[@resource-id=\"com.google.android.gms:id/main_title\"]")
    private WebElement chooseAccountHeader;

    @AndroidFindBy(xpath = "//android.widget.EditText[@resource-id=\"identifierId\"]")
    private WebElement enterEmail;

    @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Next\")")
    public WebElement nextButton;

    @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Cancel\")")
    public WebElement cancelButton;

    @AndroidFindBy(className = "android.widget.EditText")
    private WebElement enterPassword;

    @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Turn on backup\")")
    public WebElement turnOnBackupButton;

    @AndroidFindBy(xpath = "//android.widget.Button[@text=\"I agree\"]")
    public WebElement agreeButton;

    @AndroidFindBy(accessibility = "backup")
    @iOSXCUITFindBy(accessibility = "backup")
    private WebElement BackupButton;

    @AndroidFindBy(accessibility = "restore")
    @iOSXCUITFindBy(accessibility = "restore")
    private WebElement restoreButton;

    @AndroidFindBy(accessibility = "lastBackupTime")
    @iOSXCUITFindBy(accessibility = "lastBackupTime")
    private WebElement lastBackupTime;

    @AndroidFindBy(accessibility = "dataBackupSuccessPopup")
    @iOSXCUITFindBy(accessibility = "dataBackupSuccessPopup")
    private WebElement dataBackupSuccessPopup;

    @AndroidFindBy(accessibility = "close")
    @iOSXCUITFindBy(accessibility = "close")
    private WebElement closeButton;

    @AndroidFindBy(accessibility = "arrowLeft")
    @iOSXCUITFindBy(accessibility = "arrowLeft")
    private WebElement arrowLeftButton;

    @AndroidFindBy(accessibility = "associatedAccountEmail")
    @iOSXCUITFindBy(accessibility = "associatedAccountEmail")
    private WebElement associatedAccountEmail;

    @AndroidFindBy(accessibility = "restoreBackupSuccessPopup")
    @iOSXCUITFindBy(accessibility = "restoreBackupSuccessPopup")
    private WebElement restoreBackupSuccessPopUp;


    @AndroidFindBy(accessibility = "CloudBackupConsentDeniedTitle")
    @iOSXCUITFindBy(accessibility = "CloudBackupConsentDeniedTitle")
    private WebElement permissionDeniedHeader;

    @AndroidFindBy(accessibility = "CloudBackupConsentDeniedMessage")
    @iOSXCUITFindBy(accessibility = "CloudBackupConsentDeniedMessage")
    private WebElement errorMessageDescription;

    @AndroidFindBy(accessibility = "errorHelpText")
    @iOSXCUITFindBy(accessibility = "errorHelpText")
    private WebElement errorHelpText;


    @AndroidFindBy(accessibility = "allowAccess")
    @iOSXCUITFindBy(accessibility = "allowAccess")
    private WebElement allowAccessButton;

    @AndroidFindBy(accessibility = "LastBackupSectionHeader")
    @iOSXCUITFindBy(accessibility = "LastBackupSectionHeader")
    private WebElement lastBackupSectionHeader;

    @AndroidFindBy(accessibility = "AccountSectionHeader")
    @iOSXCUITFindBy(accessibility = "AccountSectionHeader")
    private WebElement AccountSectionHeader;

    @AndroidFindBy(accessibility = "storageInfo")
    @iOSXCUITFindBy(accessibility = "storageInfo")
    private WebElement storageInfo;

    @AndroidFindBy(accessibility = "associatedAccount")
    @iOSXCUITFindBy(accessibility = "associatedAccount")
    private WebElement associatedAccount;

    @AndroidFindBy(accessibility = "restoreSectionHeader")
    @iOSXCUITFindBy(accessibility = "restoreSectionHeader")
    private WebElement restoreSectionHeader;

    @AndroidFindBy(accessibility = "restoreFailure-noBackupFilePopup")
    @iOSXCUITFindBy(accessibility = "restoreFailure-noBackupFilePopup")
    private WebElement restoreFailurePopup;

    @AndroidFindBy(accessibility = "restoreInfo")
    private WebElement restoreInfo;

    @AndroidFindBy(accessibility = "help")
    private WebElement helpButton;


    public BackupAndRestorePage(AppiumDriver driver) {
        super(driver);
    }
    BasePage basePage = new BasePage(driver);

    public void clickOnProceedButton() {
        clickOnElement(proceedButton);
    }

    public boolean isBackupProcessInfoDisplayed() {
        return this.isElementDisplayed(backupProcessInfo);
    }

    public boolean isCloudInfoDisplayed() {
        return this.isElementDisplayed(cloudInfo);
    }

    public void clickOnAddAnotherAccount() {
        clickOnElement(addAnotherAccount);
    }

    public void enterEmailTextBox(String fullname) {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        sendKeysToTextBox(enterEmail, fullname);
    }

    public void enterPasswordTextBox(String fullname) {
        try {
            basePage.retrieToGetElement(enterPassword);
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        basePage.retrieToGetElement(enterPassword);
        sendKeysToTextBox(enterPassword, fullname);
    }

    public void clickOnAgreeButton() {
        clickOnElement(agreeButton);
    }

    public void clickOnRestoreButton() {
        clickOnElement(restoreButton);
    }

    public void clickOnBackUpButton() {
        clickOnElement(BackupButton);
    }

    public boolean islastBackupTimeDisplayed() {
        return this.isElementDisplayed(lastBackupTime,30);
    }

    public boolean isDataBackupSuccessPopupDisplayed() {
        return this.isElementDisplayed(dataBackupSuccessPopup,30);
    }

    public void clickOnCloseButton() {
        clickOnElement(closeButton);
    }

    public void clickOnArrowLeftButton() {
        basePage.retrieToGetElement(arrowLeftButton);
        clickOnElement(arrowLeftButton);
    }

    public void clickOnNextButton() {
        clickOnElement(nextButton);
    }

    public void clickOnCancelButton() {
        clickOnElement(cancelButton);
    }

    public boolean isAssociatedAccountEmailDisplayed() {
        return this.isElementDisplayed(associatedAccountEmail);
    }

    public boolean isRestoreBackupSuccessPopUpDisplayed() {
        return this.isElementDisplayed(restoreBackupSuccessPopUp,30);
    }

    public boolean isPermissionDeniedHeaderDisplayed() {
        return this.isElementDisplayed(permissionDeniedHeader);
    }


    public boolean isErrorMessageDescriptionDisplayed() {
        return this.isElementDisplayed(errorMessageDescription);
    }

    public boolean isErrorHelpTextDisplayed() {
        return this.isElementDisplayed(errorHelpText);
    }

    public void clickOnAllowAccessButton() {
        clickOnElement(allowAccessButton);
    }

    public void clickOnGoBackButton() {
        clickOnElement(goBackButton);
    }

    public boolean isChooseAccountHeaderDisplayed() {
        return this.isElementDisplayed(chooseAccountHeader);
    }

    public boolean isLastBackupSectionHeaderDisplayed() {
        return this.isElementDisplayed(lastBackupSectionHeader , 50);
    }

    public boolean isAccountSectionHeaderDisplayed() {
        return this.isElementDisplayed(AccountSectionHeader);
    }

    public boolean isStorageInfoDisplayed() {
        return this.isElementDisplayed(storageInfo);
    }

    public boolean isAssociatedAccountDisplayed() {
        return this.isElementDisplayed(associatedAccount);
    }

    public boolean isRestoreSectionHeaderDisplayed() {
        return this.isElementDisplayed(restoreSectionHeader);
    }

    public boolean isRestoreFailurePopupHeaderDisplayed() {
        return this.isElementDisplayed(restoreFailurePopup);
    }

    public String  getLastBackupSectionHeaderText(){
        return getTextFromLocator(lastBackupSectionHeader);
    }

    public String  getAccountSectionHeaderText(){
        return getTextFromLocator(AccountSectionHeader);
    }

    public String  getStorageInfoText(){
        return getTextFromLocator(storageInfo);
    }

    public String  getRestoreInfoText(){
        return getTextFromLocator(restoreInfo);
    }

    public String  getBackupAndRestoreHeaderText(){
        return getTextFromLocator(backupAndRestoreHeader);
    }
    public boolean isHelpButtonDisplayed() {
        return this.isElementDisplayed(helpButton,30);
    }

    public void clickOnHelpButton() {
        clickOnElement(helpButton);
    }

    public boolean  isBackupFQADisplayed() throws InterruptedException {
        Thread.sleep(5000);
        String context= driver.getPageSource();
        return context.contains("Why should I take a backup?") && context.contains("What is data backup? ") && context.contains("How to backup to your google account?");

    }

}
