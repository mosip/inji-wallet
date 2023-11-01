package io.mosip.test.mob.inji.pages;

import io.mosip.test.mob.inji.constants.Target;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class ConfirmPasscode extends BasePage {

    @iOSXCUITFindBy(accessibility = "Confirm passcode")
    @AndroidFindBy(xpath = "//*[contains(@text,'Confirm passcode')]")
    private WebElement confirmPasscode;
    
    
    @AndroidFindBy(xpath = "//*[contains(@text,'Passcode did not match.')]")
    private WebElement invalidPasscode;

    public ConfirmPasscode(AppiumDriver driver) {
        super(driver);
    }
    
    public boolean isConfirmPassCodeIsInValid() {
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
