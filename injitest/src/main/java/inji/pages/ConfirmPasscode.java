package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import inji.constants.Target;
import org.openqa.selenium.WebElement;

public class ConfirmPasscode extends BasePage {

    @iOSXCUITFindBy(accessibility = "confirmPasscode")
    @AndroidFindBy(xpath = "//*[contains(@text,'Confirm passcode')]")
    private WebElement confirmPasscode;
    
    
    @AndroidFindBy(xpath = "//*[contains(@text,'Passcode did not match.')]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`label == \"Passcode did not match.\"`]")
    private WebElement invalidPasscode;

    public ConfirmPasscode(AppiumDriver driver) {
        super(driver);
    }
    
    public boolean isPasscodeInvalidMessageDisplayed() {
        return this.isElementDisplayed(invalidPasscode, "Passcode did not match.");
    }

    public boolean isConfirmPassCodePageLoaded() {
        return this.isElementDisplayed(confirmPasscode, "Confirm passcode page");
    }

    public HomePage confirmPasscode(String passcode, Target os) {
        SetPasscode setPasscode = new SetPasscode(driver);
        setPasscode.enterPasscode(passcode, os);
        return new HomePage(driver);
    }
}
