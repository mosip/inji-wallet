package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

import inji.utils.IosUtil;

public class SharePage extends BasePage {

    @AndroidFindBy(accessibility = "camera")
    private WebElement camera;

    @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Bluetooth\")")
    private WebElement bluetoothPopUp;

    @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Allow\")")
    private WebElement allowButton;
    
    @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Deny\")")
    private WebElement denyButton;

    @AndroidFindBy(accessibility = "noShareableVcs")
    @iOSXCUITFindBy(accessibility = "noShareableVcs")
    private WebElement noShareableCards;

	@AndroidFindBy(accessibility = "flipCameraIcon")
	private WebElement flipCamera;

	@AndroidFindBy(accessibility = "holdPhoneSteadyMessage")
	 private WebElement holdCameraSteady;
	
	@AndroidFindBy(accessibility = "bluetoothIsTurnedOffMessage")
    private WebElement bluetoothIsTurnedOffMessage;

    public SharePage(AppiumDriver driver) {
        super(driver);
    }

    public SharePage acceptPermissionPopupBluetooth() {
        if (isElementDisplayed(allowButton)) {
            clickOnElement(allowButton);
        }
        return this;
    }
    
    public SharePage denyPermissionPopupBluetooth() {
        if (isElementDisplayed(denyButton)) {
            clickOnElement(denyButton);
        }
        return this;
    }
    
    public boolean isCameraOpen() {
        return isElementDisplayed(camera);
    }

    public boolean isNoShareableCardsMessageDisplayed() {
        return isElementDisplayed(noShareableCards);
    }
    
    public boolean isBluetoothIsTurnedOffMessageDisplayed() {
        return isElementDisplayed(bluetoothIsTurnedOffMessage);
    }

    public boolean isCameraPageLoaded() {
        return this.isElementEnabled(holdCameraSteady);
    }

    public boolean isFlipCameraClickable() {
        return this.isElementEnabled(flipCamera);
    }

}
