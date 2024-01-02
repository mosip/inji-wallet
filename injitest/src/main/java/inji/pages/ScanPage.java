package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class ScanPage extends BasePage{

    @AndroidFindBy(uiAutomator = "new UiSelector().resourceId(\"com.android.permissioncontroller:id/permission_allow_foreground_only_button\")")
    private WebElement allowPermissionPopupButton;

    @AndroidFindBy(accessibility = "camera")
    private WebElement camera;

    @AndroidFindBy(uiAutomator = "new UiSelector().resourceId(\"com.oplus.wirelesssettings:id/alertTitle\")")
    private WebElement bluetoothPopUp;

    @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Allow\")")
    private WebElement allowButton;

    @AndroidFindBy(accessibility = "noShareableVcs")
    @iOSXCUITFindBy(accessibility = "noShareableVcs")
    private WebElement noShareableCards;

	@AndroidFindBy(accessibility = "flipCameraIcon")
	private WebElement flipCamera;

	@AndroidFindBy(accessibility = "holdPhoneSteadyMessage")
	 private WebElement holdCameraSteady;

    public ScanPage(AppiumDriver driver) {
        super(driver);
    }

    public ScanPage acceptPermissionPopup() {
    	if (isElementDisplayed(bluetoothPopUp, "\"Inji\" wants to turn on Bluetooth")) {
    		clickOnElement(allowButton);
        }
         return this;
    }

    public boolean isCameraOpen(){
    return isElementDisplayed(camera, "camera");
    }

    public boolean isNoShareableCardsMessageDisplayed(){
        return isElementDisplayed(noShareableCards, "No shareable cards are available.");
    }

    public boolean isCameraPageLoaded() {
        return this.isElementEnabled(holdCameraSteady);
    }

	public boolean isFlipCameraClickable() {
		return this.isElementEnabled(flipCamera);
	}

}
