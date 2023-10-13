package io.mosip.test.mob.inji.pages;

import io.mosip.test.mob.inji.constants.Target;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public class HistoryPage extends BasePage {
    @AndroidFindBy(xpath = "//*[contains(@text,'History')]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeOther[`label == \"History\"`][5]")
    private WebElement historyHeader;

    public HistoryPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isHistoryPageLoaded() {
        return this.isElementDisplayed(historyHeader, "History page");
    }

    private boolean verifyHistoryIos(String vcNumber) {
        By locator = By.xpath("//*[contains(@name,'" + vcNumber + " downloaded')]");
        return this.isElementDisplayed(locator, "Downloaded VC in ios");
    }

    private boolean verifyHistoryAndroid(String vcNumber) {
        By locator = By.xpath("//*[contains(@text,'" + vcNumber + " downloaded')]");
        return this.isElementDisplayed(locator, "Downloaded VC in android");
    }

    public boolean verifyHistory(String vcNumber, Target os) {
        switch (os) {
            case ANDROID:
                return verifyHistoryAndroid(vcNumber);
            case IOS:
                return verifyHistoryIos(vcNumber);
        }
        return false;
    }
}
