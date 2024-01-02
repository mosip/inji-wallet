package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class CredentialRegistryPage extends BasePage {
	
	@AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Edit Credential Registry\")")
    @iOSXCUITFindBy(accessibility = "credentialRegistryLabel")
    public WebElement credentialRegistryTextBoxHeader;
	
	@AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Edit Esignet Host\")")
    @iOSXCUITFindBy(accessibility = "esignetHostLabel")
    public WebElement credentialRegistryEsignetTextBoxHeader;
	
	@AndroidFindBy(uiAutomator = "new UiSelector().resourceId(\"RNE__Input__text-input\")")
    @iOSXCUITFindBy(accessibility = "credentialRegistryInputField")
	public WebElement credentialRegistryTextBox;
	
	@AndroidFindBy(xpath = "(//android.widget.EditText[@resource-id=\"RNE__Input__text-input\"])[2]")
    @iOSXCUITFindBy(accessibility = "esignetHostInputField")
	public WebElement credentialRegistryEsignetTextBox;
	
	@AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Save\")")
    @iOSXCUITFindBy(accessibility = "save")
    public WebElement saveButton;
	
	@AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Cancel\")")
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