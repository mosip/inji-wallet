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
	
	@AndroidFindBy(uiAutomator = "new UiSelector().resourceId(\"iconIcon\")")
	@iOSXCUITFindBy(accessibility = "arrowLeft")
    public WebElement backArrow;
	
    public CredentialRegistryPage(AppiumDriver driver) {
        super(driver);
    }
    
    public boolean isCredentialRegistryTextBoxHeaderDisplayed() {
        return this.isElementDisplayed(credentialRegistryTextBoxHeader, "Credential Registry Text heder is visible");
    }
    
    public boolean isCredentialRegistryTextBoxHeaderInFilipinoDisplayed() {
        return this.isElementDisplayed(credentialRegistryTextBoxHeaderInFilipino, "Palitan ang Credential Registry");
    }
    
    public boolean isCredentialRegistryTextBoxHeaderForEsignetInFilipinoDisplayed() {
        return this.isElementDisplayed(credentialRegistryEsignetTextBoxHeader, "Palitan ang esignethosturl");
    }
    
    public CredentialRegistryPage setEnterIdTextBox(String env) {
    	clearTextBoxAndSendKeys(credentialRegistryTextBox, env, "Credential Registry env");
        return this;
    }
    
    public CredentialRegistryPage enterUrlToEsignetHostTextBox(String env) {
    	clearTextBoxAndSendKeys(credentialRegistryEsignetTextBox, env, "Credential Registry env");
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
    
    public CredentialRegistryPage clickOnBackArrow() {
        clickOnElement(backArrow);
        return this;
    }
    
    public String checkEnvNotChanged() {
    return credentialRegistryTextBox.getText();
    }
}