package io.mosip.test.mob.inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import org.openqa.selenium.WebElement;

public class CredentialRegistryPage extends BasePage {

	@AndroidFindBy(xpath = "//android.widget.TextView[@text=\"Edit Credential Registry\"]")
    public WebElement CredentialRegistryTextBoxHeader;
	
	@AndroidFindBy(xpath = "(//android.widget.EditText[@resource-id=\"RNE__Input__text-input\"])[1]")
	public WebElement CredentialRegistryTextBox;
	
	@AndroidFindBy(xpath = "//*[contains(@text,'Save')]")
    public WebElement SaveButton;
	
	@AndroidFindBy(xpath = "//*[contains(@text,'Cancel')]")
    public WebElement CancelButton;
	
	@AndroidFindBy(xpath = "//android.widget.TextView[@resource-id=\"iconIcon\" and @text=\"󰁍\"]")
    public WebElement BackArrow;
	
	@AndroidFindBy(xpath = "//*[contains(@text,'Something is wrong. Please try again later!')]")
    public WebElement SomthingIsWrongPopup;
	
    public CredentialRegistryPage(AppiumDriver driver) {
        super(driver);
    }
    
    public boolean isCredentialRegistryTextBoxHeaderDisplayed() {
        return this.isElementDisplayed(CredentialRegistryTextBoxHeader, "Credential Registry Text heder is visible");
    }
    
    public CredentialRegistryPage setEnterIdTextBox(String env) {
    	CredentialRegistryTextBox.clear();
        sendKeysToTextBox(CredentialRegistryTextBox, env, "Credential Registry env");
        return this;
    }
    
    public CredentialRegistryPage clickOnSaveButton() {
        this.clickOnElement(SaveButton);
        return new CredentialRegistryPage(driver);
    }
    
    public CredentialRegistryPage clickOnCancelButton() {
        this.clickOnElement(CancelButton);
        return new CredentialRegistryPage(driver);
    }
    
    public CredentialRegistryPage clickOnBackArrow() {
        this.clickOnElement(BackArrow);
        return new CredentialRegistryPage(driver);
    }
    
    public String CheckEnvNotChanged() {
    return CredentialRegistryTextBox.getText();
    }
    
    public boolean isSomthingIsWrongPopupVisible() {
        return this.isElementDisplayed(SomthingIsWrongPopup, "Something is wrong. Please try again later!");
    }
    
    
}
