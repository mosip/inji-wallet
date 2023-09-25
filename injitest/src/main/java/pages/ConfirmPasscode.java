package pages;

import constants.Target;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class ConfirmPasscode extends BasePage {

    @iOSXCUITFindBy(accessibility = "Confirm passcode")
    @AndroidFindBy(xpath = "//*[contains(@text,'Confirm passcode')]")
    private WebElement confirmPasscode;

    public ConfirmPasscode(AppiumDriver driver) {
        super(driver);
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
