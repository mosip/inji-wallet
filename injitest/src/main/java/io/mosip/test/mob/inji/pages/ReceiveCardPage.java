package io.mosip.test.mob.inji.pages;

import io.mosip.test.mob.inji.constants.Target;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class ReceiveCardPage extends BasePage {
	 @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Allow\")")
	  private WebElement allowButton;
	 
	 @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Display this QR code to request resident Card\")")
	  private WebElement receiveCardHeder;
	 
	 @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Ipakita ang QR code na ito para humiling ng resident card\")")
	  private WebElement receiveCardHederInFilipinoLanguage;
	 
	 @AndroidFindBy(xpath = "//android.view.ViewGroup/descendant::android.view.ViewGroup[last()]")
	  private WebElement qrCode;
	 
	 @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Waiting for connection...\")")
	  private WebElement watitingForConnection;

    public ReceiveCardPage(AppiumDriver driver) {
        super(driver);
    }
    
    public ReceiveCardPage ClickOnAllowButton() {
    	 this.clickOnElement(allowButton);
         return new ReceiveCardPage(driver);
    }
    
    public boolean isReceiveCardHederDisplayed() {
        return this.isElementDisplayed(receiveCardHeder, "Display this QR code to request resident Card");
    }
    
    public boolean isReceiveCardHederInFilipinoLanguageDisplayed() {
        return this.isElementDisplayed(receiveCardHederInFilipinoLanguage, "Ipakita ang QR code na ito para humiling ng resident card");
    }
    
    public boolean isWaitingForConnectionDisplayed() {
        return this.isElementDisplayed(watitingForConnection, "Waiting for connection...");
    }
    
    public boolean isQrCodeEnabled() {
        return this.isElementEnabled(qrCode);
    }

}
