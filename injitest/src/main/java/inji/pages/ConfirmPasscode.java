package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import inji.constants.Target;
import org.openqa.selenium.WebElement;

public class ConfirmPasscode extends BasePage {

    @iOSXCUITFindBy(accessibility = "confirmPasscodeHeader")
    @AndroidFindBy(xpath = "//*[contains(@text,'Confirm passcode')]")
    private WebElement confirmPasscode;


    @AndroidFindBy(accessibility = "PasscodeError")
    @iOSXCUITFindBy(accessibility = "Passcode did not match.")
    private WebElement invalidPasscode;

    public ConfirmPasscode(AppiumDriver driver) {
        super(driver);
    }

    public boolean isPasscodeInvalidMessageDisplayed() {
        return this.isElementDisplayed(invalidPasscode);
    }

    public boolean isConfirmPassCodePageLoaded() {
        return this.isElementDisplayed(confirmPasscode);
    }

    public HomePage enterPasscodeInConfirmPasscodePage(String passcode, Target os) {
        SetPasscode setPasscode = new SetPasscode(driver);
        setPasscode.enterPasscode(passcode, os);
        return new HomePage(driver);
    }
}
