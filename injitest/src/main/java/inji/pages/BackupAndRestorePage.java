package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class BackupAndRestorePage extends BasePage {

    @AndroidFindBy(accessibility = "backupAndRestore")
    private WebElement backupAndRestoreHeader;

    @AndroidFindBy(accessibility = "backupProcessInfo")
    private WebElement backupProcessInfo;

    @AndroidFindBy(accessibility = "cloudInfo")
    private WebElement cloudInfo;

    @AndroidFindBy(accessibility = "googleDriveTitle")
    private WebElement googleDriveTitle;

    @AndroidFindBy(accessibility = "googleDriveIcon")
    private WebElement googleDriveIcon;

    @AndroidFindBy(accessibility = "goBack")
    private WebElement goBackButton;

    @AndroidFindBy(className = "android.view.View")
    private WebElement proceedButton;

    @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Add another account\")")
    public WebElement addAnotherAccount;

    @AndroidFindBy(xpath = "//android.widget.TextView[@resource-id=\"com.google.android.gms:id/main_title\"]")
    private WebElement chooseAccountHeader;

    @AndroidFindBy(xpath = "//android.widget.EditText")
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
    private WebElement BackupButton;

    @AndroidFindBy(accessibility = "restore")
    private WebElement restoreButton;

    @AndroidFindBy(accessibility = "lastBackupTime")
    private WebElement lastBackupTime;

    @AndroidFindBy(accessibility = "dataBackupSuccessPopupText")
    private WebElement dataBackupSuccessPopup;

    @AndroidFindBy(accessibility = "close")
    private WebElement closeButton;

    @AndroidFindBy(accessibility = "dataBackupInProgressText")
    private WebElement dataBackupInProgressText;

    @AndroidFindBy(accessibility = "arrow-left")
    private WebElement arrowLeftButton;

    @AndroidFindBy(accessibility = "associatedAccountEmail")
    private WebElement associatedAccountEmail;

    @AndroidFindBy(accessibility = "restoreBackupSuccessPopupText")
    private WebElement restoreBackupSuccessPopUp;


    @AndroidFindBy(accessibility = "CloudBackupConsentDeniedTitle")
    private WebElement permissionDeniedHeader;

    @AndroidFindBy(accessibility = "CloudBackupConsentDeniedMessage")
    private WebElement errorMessageDescription;

    @AndroidFindBy(accessibility = "errorHelpText")
    private WebElement errorHelpText;


    @AndroidFindBy(accessibility = "allowAccess")
    private WebElement allowAccessButton;

    @AndroidFindBy(accessibility = "LastBackupSectionHeader")
    private WebElement lastBackupSectionHeader;

    @AndroidFindBy(accessibility = "AccountSectionHeader")
    private WebElement AccountSectionHeader;

    @AndroidFindBy(accessibility = "storageInfo")
    private WebElement storageInfo;

    @AndroidFindBy(accessibility = "associatedAccountEmail")
    private WebElement associatedAccount;

    @AndroidFindBy(accessibility = "restoreSectionHeader")
    private WebElement restoreSectionHeader;

    @AndroidFindBy(accessibility = "restoreFailure-noBackupFilePopup")
    private WebElement restoreFailurePopup;

    @AndroidFindBy(accessibility = "restoreInfo")
    private WebElement restoreInfo;

    @AndroidFindBy(accessibility = "help")
    private WebElement helpButton;

    @AndroidFindBy(xpath = "//*[@resource-id=\"com.google.android.gms:id/account_display_name\"]")
    private WebElement selectAccount;

    @AndroidFindBy(accessibility = "restoreBackupSuccessPopupText")
    private WebElement restoreBackupSuccessPopupText;


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
        return this.isElementDisplayed(lastBackupTime,40);
    }

    public boolean isDataBackupSuccessPopupDisplayed() {
        return this.retrieIsElementVisible(dataBackupSuccessPopup);
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
        return this.retrieIsElementVisible(restoreBackupSuccessPopUp);
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

    public void clickOnEmailHeader() {
        if(isElementDisplayed(selectAccount)) {
            clickOnElement(selectAccount);
        }
    }

    public boolean  isBackupFQADisplayed() throws InterruptedException {
        Thread.sleep(5000);
        String context= driver.getPageSource();
        return context.contains("Why should I take a backup?") && context.contains("What is data backup? ") && context.contains("How to backup to your google account?");
    }

    public boolean isDataBackupInProgressTextDisplayed() {
        return this.isElementDisplayed(dataBackupInProgressText,30);
    }

    public boolean isDataBackupInProgressTextDisappear() {
        return this.isElementDisplayed(dataBackupInProgressText, 10);
    }

}
