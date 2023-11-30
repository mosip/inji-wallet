package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import inji.constants.Target;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.List;

import static inji.constants.Target.ANDROID;
import static inji.constants.Target.IOS;

public class HistoryPage extends BasePage {
    @AndroidFindBy(xpath = "//*[contains(@text,'History')]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeOther[`label == \"History\"`][5]")
    private WebElement historyHeader;

    @AndroidFindBy(xpath = "//*[contains(@text,'No history available yet')]")
    @iOSXCUITFindBy(accessibility = "No history available yet")
    private WebElement noHistoryAvailable;

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
    
    private boolean verifyDeleteHistoryAndroid(String vcNumber) {
        By locator = By.xpath("//*[contains(@text,'" + vcNumber + " Removed from wallet')]");
        return this.isElementDisplayed(locator, "Delete VC in android");
    }

    private boolean verifyDeletedHistoryIos(String vcNumber) {
        By locator = By.xpath("//*[contains(@name,'" + vcNumber + " Removed from wallet')]");
        return this.isElementDisplayed(locator, "Downloaded VC in ios");
    }
    
    private int verifyNumberOfRecordsInHistoryAndroid(String vcNumber) throws InterruptedException {
   	By locator = By.xpath("//*[contains(@text,'" + vcNumber + " downloaded')]");
       List<WebElement> elements = driver.findElements(locator);
       return elements.size();
   }
   
   private int verifyNumberOfRecordsInHistoryIos(String vcNumber) {
       By locator = By.xpath("//XCUIElementTypeStaticText[@name=\"" + vcNumber + " downloaded\"]");
       List<WebElement> elements = driver.findElements(locator);
       return elements.size();
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
    
    public int getNumberOfRecordsInHistory(String vcNumber, Target os) throws InterruptedException {
        switch (os) {
            case ANDROID:
                return verifyNumberOfRecordsInHistoryAndroid(vcNumber);
            case IOS:
                return verifyNumberOfRecordsInHistoryIos(vcNumber);
        }
        return 0;
    }
    
    public boolean noHistoryAvailable() {
        return this.isElementDisplayed(noHistoryAvailable, "No history available yet");
    }
    
    public boolean verifyDeleteHistory(String vcNumber, Target os) {
        switch (os) {
            case ANDROID:
                return verifyDeleteHistoryAndroid(vcNumber);

            case IOS:
                return verifyDeletedHistoryIos(vcNumber);
        }
        return false;
    }

    public boolean verifyActivationFailedRecordInHistory(String vcNumber, Target os) {
        switch (os) {
            case ANDROID:
                return verifyActivationFailedRecordAndroid(vcNumber);
            case IOS:
                return verifyActivationFailedRecordIos(vcNumber);
        }
        return false;
    }

    private boolean verifyActivationFailedRecordIos(String vcNumber) {
        By locator = By.xpath("//*[contains(@name,'" + vcNumber + " Activation failed')]");
        return this.isElementDisplayed(locator, "Downloaded VC in ios");
    }

    private boolean verifyActivationFailedRecordAndroid(String vcNumber) {
        By locator = By.xpath("//*[contains(@text,'" + vcNumber + " Activation failed')]");
        return this.isElementDisplayed(locator, "Downloaded VC in android");
    }

    public boolean verifyActivationSuccessfulRecordInHistory(String vcNumber, Target os) {
        switch (os) {
            case ANDROID:
                return verifyActivationSuccessfulRecordAndroid(vcNumber);
            case IOS:
                return verifyActivationSuccessfulRecordIos(vcNumber);
        }
        return false;
    }

    private boolean verifyActivationSuccessfulRecordIos(String vcNumber) {
        By locator = By.xpath("//*[contains(@name,'" + vcNumber + " Activation successful')]");
        return this.isElementDisplayed(locator, "Downloaded VC in ios");
    }

    private boolean verifyActivationSuccessfulRecordAndroid(String vcNumber) {
        By locator = By.xpath("//*[contains(@text,'" + vcNumber + " Activation successful')]");
        return this.isElementDisplayed(locator, "Downloaded VC in android");
    }
}
