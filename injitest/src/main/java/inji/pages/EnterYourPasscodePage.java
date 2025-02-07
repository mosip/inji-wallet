package inji.pages;

import inji.constants.Target;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class EnterYourPasscodePage extends BasePage {

    @iOSXCUITFindBy(accessibility = "enterPasscode")
    @AndroidFindBy(xpath = "//*[contains(@text,'Enter your passcode')]")
    private WebElement enterYourPasscodeText;

    public EnterYourPasscodePage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isEnterYourPasscodePageLoaded() {
        return this.isElementDisplayed(enterYourPasscodeText);
    }

    public void enterPasscodeOnPasscodePage(String passcode, Target os) {
        SetPasscode setPasscode = new SetPasscode(driver);
        setPasscode.enterPasscode(passcode, os);
        new HomePage(driver);
    }

}