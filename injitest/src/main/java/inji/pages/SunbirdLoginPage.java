package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.HidesKeyboard;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;

import java.util.List;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import inji.constants.Target;

public class SunbirdLoginPage extends BasePage {

    @AndroidFindBy(xpath = "//*[contains(@text,'Login with KBA')]")
    private WebElement loginWithKBA;
    
    @AndroidFindBy(uiAutomator = "UiSelector().className(\"android.widget.EditText\").instance(0)")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeTextField[`name == \"Please fill in this field\"`][1]")
    private WebElement enterPolicyTextBox;
    
    @AndroidFindBy(uiAutomator = "UiSelector().className(\"android.widget.EditText\").instance(1)")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeTextField[`name == \"Please fill in this field\"`][2]")
    private WebElement enterFullnameTextBox;
    
    @AndroidFindBy(uiAutomator = "UiSelector().className(\"android.widget.Spinner\")")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeOther[`name == \"Please fill in this field\"`]")
    private WebElement enterDateOfBirthTextBox;
    
    @AndroidFindBy(uiAutomator = "UiSelector().className(\"android.widget.Button\").instance(2)")
    @iOSXCUITFindBy(accessibility = "Done")
    private WebElement clickOnSetButton;
    
    @AndroidFindBy(xpath = "//android.view.View[@content-desc='01 January 2024']")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`name == \"Monday, 1 January\"`]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther")
    private WebElement DateOfBirth;
    @AndroidFindBy(uiAutomator = "UiSelector().className(\"android.widget.Button\").instance(1)")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`name == \"Login\"`]")
    private WebElement loginButton;

    @AndroidFindBy(xpath = "//android.widget.ImageButton[@content-desc=\"Previous month\"]")
    @iOSXCUITFindBy(accessibility = "Previous Month")
    private WebElement previousMonth;
    
    @AndroidFindBy(accessibility = "activated")
    @iOSXCUITFindBy(accessibility = "Activated")
    private WebElement activatedStatus;
    
    @AndroidFindBy(accessibility = "a square logo of a Sunbird")
    @iOSXCUITFindBy(accessibility = "a square logo of a Sunbird")
    private WebElement sunbirdLogo;

    @AndroidFindBy(accessibility = "NameValue")
    @iOSXCUITFindBy(accessibility = "NameValue")
    private WebElement fullName;

    @AndroidFindBy(accessibility = "Policy NameValue")
    @iOSXCUITFindBy(accessibility = "Policy NameValue")
    private WebElement policyName;

    @AndroidFindBy(accessibility = "ID TypeValue")
    @iOSXCUITFindBy(accessibility = "ID TypeValue")
    private WebElement idType;

    @iOSXCUITFindBy(accessibility = "Continue")
    private WebElement continueButton;

    public SunbirdLoginPage(AppiumDriver driver) {
        super(driver);
    }
    BasePage basePage = new BasePage(driver);
    public void clickOnloginWithKbaButton() {
        clickOnElement(loginWithKBA);
    }
    
    
    public void enterPolicyNumberTextBox(String PolicyNo) {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        sendKeysToTextBox(enterPolicyTextBox, PolicyNo);
    }
    
    public void enterFullNameTextBox(String fullname) {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        sendKeysToTextBox(enterFullnameTextBox, fullname);
    }
    
    public void enterDateOfBirthTextBox() {
    	clickOnElement(enterDateOfBirthTextBox);
    	int MAX_ATTEMPTS = 12;
    	if (!isElementDisplayed(DateOfBirth, 5)) {
    	    for (int i = 0; i < MAX_ATTEMPTS; i++) {
    	        try {
    	            clickOnElement(previousMonth);
    	         if(isElementDisplayed(DateOfBirth,3)) {
    	            break;  
    	         }
    	        } catch (TimeoutException e) {
    	        } catch (NoSuchElementException e) {
    	            break;  
    	        }
    	    }
    	}

    	if (isElementDisplayed(DateOfBirth)) {  
    	    clickOnElement(DateOfBirth);
    	    clickOnElement(clickOnSetButton);
    	} 
    }
    public void clickOnloginButton() {
        clickOnElement(loginButton);
    }
    
    public boolean isSunbirdCardIsActive() {
        return this.isElementDisplayed(activatedStatus);
    }
    
    public boolean isSunbirdCardLogoIsDisplayed() {
        return this.isElementDisplayed(sunbirdLogo);
    }
    public String getFullNameForSunbirdCard() {
        basePage.retrieToGetElement(fullName);
        return this.getTextFromLocator(fullName);
    }
    public String getPolicyNameForSunbirdCard() {
        basePage.retrieToGetElement(policyName);
        return this.getTextFromLocator(policyName);
    }

    public String getIdTypeForSunbirdCard() {
        basePage.retrieToGetElement(idType);
        return this.getTextFromLocator(idType);
    }
    public void clickOnContinueButtonInSigninPopupIos(){
        clickOnElement(continueButton);
    }

}
