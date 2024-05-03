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
    @iOSXCUITFindBy(accessibility = "OK")
    private WebElement allowButton;

    @AndroidFindBy(xpath = "//android.widget.Button[@resource-id=\"com.android.permissioncontroller:id/permission_allow_foreground_only_button\"]")
    @iOSXCUITFindBy(accessibility = "OK")
    private WebElement cameraPopupAndroid;

    @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Deny\")")
    private WebElement denyButton;

    @AndroidFindBy(accessibility = "noShareableVcs")
    @iOSXCUITFindBy(accessibility = "noShareableVcs")
    private WebElement noShareableCards;

	@AndroidFindBy(accessibility = "flipCameraIcon")
    @iOSXCUITFindBy(accessibility = "Flip Camera")
	private WebElement flipCamera;

	@AndroidFindBy(accessibility = "holdPhoneSteadyMessage")
    @iOSXCUITFindBy(accessibility = "holdPhoneSteadyMessage")
    private WebElement holdCameraSteady;

    @iOSXCUITFindBy(accessibility = "enableBluetoothButton")
    private WebElement enableBluetoothButton;

	@AndroidFindBy(accessibility = "bluetoothIsTurnedOffMessage")
    private WebElement bluetoothIsTurnedOffMessage;

    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`name == \"“Inji” Would Like to Use Bluetooth\"`]")
    private WebElement bluetoothPopUpIos;

    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`name == \"“Inji” Would Like to Access the Camera\"`]")
    private WebElement cameraPopUpIos;

    @iOSXCUITFindBy(accessibility = "OK")
    private WebElement okButtonIos;
    @iOSXCUITFindBy(accessibility = "Don’t Allow")
    @AndroidFindBy(xpath = "//android.widget.Button[@resource-id=\"com.android.permissioncontroller:id/permission_deny_button\"]")
    private WebElement dontAllowButtonIos;

    @AndroidFindBy(accessibility = "cameraAccessDisabled")
    @iOSXCUITFindBy(accessibility = "cameraAccessDisabled")
    private WebElement cameraAccessDisabledPopup;



    @AndroidFindBy(xpath = "//android.widget.TextView[@resource-id=\"close\"]")
    private WebElement closePopupButton;


    public SharePage(AppiumDriver driver) {
        super(driver);
    }

    public SharePage acceptPermissionPopupBluetooth() {
        if (isElementDisplayed(allowButton)) {
            clickOnElement(allowButton);
        }
        return this;
    }

    public SharePage acceptPermissionPopupCamera() {
        if (isElementDisplayed(cameraPopupAndroid)) {
            clickOnElement(cameraPopupAndroid);
        }
        return this;
    }

    public SharePage acceptPermissionPopupBluetoothIos() {
        if (isElementDisplayed(okButtonIos)) {
            clickOnElement(okButtonIos);
        }
        return this;
    }

    public SharePage acceptPermissionPopupCameraIos() {
        if (isElementDisplayed(okButtonIos)) {
            clickOnElement(okButtonIos);
        }
        return this;
    }
    
    public SharePage denyPermissionPopupBluetooth() {
        if (isElementDisplayed(denyButton)) {
            clickOnElement(denyButton);
        }
        return this;
    }

    public SharePage denyPermissionPopupBluetoothIos() {
        if (isElementDisplayed(bluetoothPopUpIos)) {
            clickOnElement(dontAllowButtonIos);
        }
        return this;
    }

    public SharePage denyPermissionPopupCameraIos() {
        if (isElementDisplayed(cameraPopUpIos)) {
            clickOnElement(dontAllowButtonIos);
        }
        return this;
    }

    public boolean isCameraOpen() {
        return isElementDisplayed(camera);
    }

    public boolean isNoShareableCardsMessageDisplayed() {
        return isElementDisplayed(noShareableCards);
    }
    
    public String isBluetoothIsTurnedOffMessageDisplayed() {
        return getTextFromLocator(bluetoothIsTurnedOffMessage);
    }

    public String isEnableBluetoothButtonButtonDisplayed() {
        return getTextFromLocator(enableBluetoothButton);
    }

    public boolean isCameraPageLoaded() {
        return this.isElementEnabled(holdCameraSteady,30);
    }

    public boolean isFlipCameraClickable() {
        return this.isElementEnabled(flipCamera,30);
    }

    public void clickOnDenyCameraPopupButton() {
        if (isElementDisplayed(dontAllowButtonIos)) {
            clickOnElement(dontAllowButtonIos);
        }
    }

    public boolean isCameraDisabledPopUpDisplayed(){
        return isElementDisplayed(cameraAccessDisabledPopup);
    }
    public void clickOnPopupCloseButton(){
         clickOnElement(closePopupButton);
    }

}
