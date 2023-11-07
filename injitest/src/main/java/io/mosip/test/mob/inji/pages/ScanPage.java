package io.mosip.test.mob.inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class ScanPage extends BasePage{

    @AndroidFindBy(uiAutomator = "new UiSelector().resourceId(\"com.android.permissioncontroller:id/permission_allow_foreground_only_button\")")
    private WebElement allowPermissionPopupButton;

    @AndroidFindBy(uiAutomator = "new UiSelector().resourceId(\"io.mosip.residentapp:id/texture_view\")")
    private WebElement camera;

    @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Inji wants to turn on Bluetooth\")")
    private WebElement bluetoothPopup;

    @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Allow\")")
    private WebElement allowButton;
    
	@AndroidFindBy(className = "android.widget.ImageView")
	private WebElement flipCamera;
	
	@AndroidFindBy(xpath = "//*[contains(@text,'Hold the phone steady and scan the QR code')]")
	 private WebElement holdCameraSteady;

    public ScanPage(AppiumDriver driver) {
        super(driver);
    }

    public ScanPage acceptPermissionPopup(){
        if(isElementDisplayed(bluetoothPopup, "Inji wants to turn on Bluetooth popup")){
            clickOnElement(allowButton);
        }return new ScanPage(driver);
    }

    public boolean isCameraOpen(){
    return isElementDisplayed(camera, "camera");
    }
    
    public boolean isCameraPageLoaded() {
        return this.isElementEnabled(holdCameraSteady);
    }
	
	public boolean isFlipCameraClickable() {
		return this.isElementEnabled(flipCamera);
	}

}
