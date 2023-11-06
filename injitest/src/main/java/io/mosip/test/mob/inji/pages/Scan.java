package io.mosip.test.mob.inji.pages;

import org.openqa.selenium.WebElement;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;

public class Scan extends BasePage{
	
	
	@AndroidFindBy(className = "android.widget.ImageView")
	private WebElement flipCamera;
	
	@AndroidFindBy(xpath = "//*[contains(@text,'Hold the phone steady and scan the QR code')]")
	 private WebElement holdCameraSteady;
	
	public Scan(AppiumDriver driver) {
        super(driver);
    }
	
	public boolean isCameraPageLoaded() {
        return this.isElementEnabled(holdCameraSteady);
    }
	
	
	public boolean isFlipCameraClickable() {
		return this.isElementEnabled(flipCamera);
		
	}

}
