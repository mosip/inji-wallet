package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class CredentialRegistryPage extends BasePage {

    @AndroidFindBy(accessibility = "credentialRegistryLabel")
    @iOSXCUITFindBy(accessibility = "credentialRegistryLabel")
    public WebElement credentialRegistryTextBoxHeader;

    @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Palitan ang Credential Registry\")")
    public WebElement credentialRegistryTextBoxHeaderInFilipino;

    @AndroidFindBy(accessibility = "esignetHostLabel")
    @iOSXCUITFindBy(accessibility = "esignetHostLabel")
    public WebElement credentialRegistryEsignetTextBoxHeader;

    @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Palitan ang esignethosturl\")")
    public WebElement credentialRegistryEsignetTextBoxHeaderInFilipino;

    @AndroidFindBy(accessibility = "credentialRegistryInputField")
    @iOSXCUITFindBy(accessibility = "credentialRegistryInputField")
    public WebElement credentialRegistryTextBox;

    @AndroidFindBy(accessibility = "esignetHostInputField")
    @iOSXCUITFindBy(accessibility = "esignetHostInputField")
    public WebElement credentialRegistryEsignetTextBox;

    @AndroidFindBy(accessibility = "save")
    @iOSXCUITFindBy(accessibility = "save")
    public WebElement saveButton;

    @AndroidFindBy(accessibility = "cancel")
    @iOSXCUITFindBy(accessibility = "cancel")
    public WebElement cancelButton;

    @AndroidFindBy(accessibility = "arrowLeft")
    @iOSXCUITFindBy(accessibility = "arrowLeft")
    public WebElement backArrow;
    
    @AndroidFindBy(accessibility = "credentialRegistryErrorMessage")
    @iOSXCUITFindBy(accessibility = "credentialRegistryErrorMessage")
    public WebElement credentialRegistryErrorMessage;
    

    public CredentialRegistryPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isCredentialRegistryTextBoxHeaderDisplayed() {
        return this.isElementDisplayed(credentialRegistryTextBoxHeader);
    }
    
    public boolean isCredentialRegistryErrorMessageDisplayed() {
        return this.isElementDisplayed(credentialRegistryErrorMessage);
    }

    public boolean isCredentialRegistryTextBoxHeaderInFilipinoDisplayed() {
        return this.isElementDisplayed(credentialRegistryTextBoxHeaderInFilipino);
    }

    public boolean isCredentialRegistryTextBoxHeaderForEsignetInFilipinoDisplayed() {
        return this.isElementDisplayed(credentialRegistryEsignetTextBoxHeader);
    }

    public CredentialRegistryPage setEnterIdTextBox(String text) {
        clearTextBoxAndSendKeys(credentialRegistryTextBox, text);
        return this;
    }

    public CredentialRegistryPage enterUrlToEsignetHostTextBox(String text) {
        clearTextBoxAndSendKeys(credentialRegistryEsignetTextBox, text);
        return this;
    }

    public CredentialRegistryPage clickOnSaveButton() {
        clickOnElement(saveButton);
        return this;
    }

    public CredentialRegistryPage clickOnCancelButton() {
        clickOnElement(cancelButton);
        return this;
    }

    public void clickOnBackArrow() {
        clickOnElement(backArrow);
    }

    public String checkEnvNotChanged() {
        return credentialRegistryTextBox.getText();
    }
}