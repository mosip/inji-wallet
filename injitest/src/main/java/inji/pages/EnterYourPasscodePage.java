package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import inji.constants.Target;
import org.openqa.selenium.WebElement;

public class EnterYourPasscodePage extends BasePage {

    @iOSXCUITFindBy(accessibility = "enterPasscode")
    @AndroidFindBy(xpath = "//*[contains(@text,'Enter your passcode')]")
    private WebElement enterYourPasscodeText;

    public EnterYourPasscodePage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isEnterYourPasscodePageLoaded() {
        return this.isElementDisplayed(enterYourPasscodeText, "Enter your passcode page");
    }

    public HomePage enterYourPasscode(String passcode, Target os) {
        SetPasscode setPasscode = new SetPasscode(driver);
        setPasscode.enterPasscode(passcode, os);
        return new HomePage(driver);
    }

}
