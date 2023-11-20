package io.mosip.test.mob.inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import io.mosip.test.mob.inji.constants.Target;

public class SetPasscode extends BasePage {

    @iOSXCUITFindBy(accessibility = "setPasscode")
    @AndroidFindBy(xpath = "//*[contains(@text,'Set Passcode')]")
    private WebElement setPasscode;

    public SetPasscode(AppiumDriver driver) {
        super(driver);
    }

    public boolean isSetPassCodePageLoaded() {
        return this.isElementDisplayed(setPasscode, "Set passcode page");
    }

    public ConfirmPasscode enterPasscode(String passcode, Target os) {
        char[] arr = passcode.toCharArray();
        switch (os) {
            case ANDROID:
                enterOtpAndroid(arr);
                break;
            case IOS:
                enterOtpIos(arr);
                break;
        }
        return new ConfirmPasscode(driver);
    }

    private void enterOtpAndroid(char[] arr) {
        for (int i = 1; i <= 6; i++) {
            String locator = "(//*[@class='android.widget.EditText'])[" + i + "]";
            driver.findElement(By.xpath(locator)).sendKeys(String.valueOf(arr[i - 1]));
        }
    }

    private void enterOtpIos(char[] arr) {
        for (int i = 1; i <= 6; i++) {
            String locator = "(//*[@type='XCUIElementTypeSecureTextField'])[" + i + "]";
            driver.findElement(By.xpath(locator)).sendKeys(String.valueOf(arr[i - 1]));
        }
    }
}
