package io.mosip.test.mob.inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import org.openqa.selenium.WebElement;

public class CredentialRegistryPage extends BasePage {
	
	@AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Edit Credential Registry\")")
    public WebElement CredentialRegistryTextBoxHeader;
	
	@AndroidFindBy(uiAutomator = "new UiSelector().resourceId(\"RNE__Input__text-input\")")
	public WebElement CredentialRegistryTextBox;
	
	@AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Save\")")
    public WebElement SaveButton;
	
	@AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Cancel\")")
    public WebElement CancelButton;
	
	@AndroidFindBy(uiAutomator = "new UiSelector().resourceId(\"iconIcon\")")
    public WebElement BackArrow;
	
    public CredentialRegistryPage(AppiumDriver driver) {
        super(driver);
    }
    
    public boolean isCredentialRegistryTextBoxHeaderDisplayed() {
        return this.isElementDisplayed(CredentialRegistryTextBoxHeader, "Credential Registry Text heder is visible");
    }
    
    public CredentialRegistryPage setEnterIdTextBox(String env) {
    	clearTextBoxAndSendKeys(CredentialRegistryTextBox, env, "Credential Registry env");
        return this;
    }
    
    public CredentialRegistryPage clickOnSaveButton() {
        clickOnElement(SaveButton);
        return this;
    }
    
    public CredentialRegistryPage clickOnCancelButton() {
        clickOnElement(CancelButton);
        return this;
    }
    
    public CredentialRegistryPage clickOnBackArrow() {
        clickOnElement(BackArrow);
        return this;
    }
    
    public String checkEnvNotChanged() {
    return CredentialRegistryTextBox.getText();
    }
}