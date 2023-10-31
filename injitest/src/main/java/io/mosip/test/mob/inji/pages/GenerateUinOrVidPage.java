package io.mosip.test.mob.inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class GenerateUinOrVidPage extends BasePage {

    @AndroidFindBy(xpath = "//*[contains(@text,'Retrieve your UIN/VID')]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`label == \"Retrieve your UIN/VID\"`]")
    private WebElement retrieveUinVidText;

    @AndroidFindBy(className = "android.widget.EditText")
    @iOSXCUITFindBy(accessibility = "RNE__Input__text-input")
    private WebElement applicationIdTextBox;

    @AndroidFindBy(xpath = "//*[contains(@text,'Get UIN/VID')]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`label == \"Get UIN/VID\"`]")
    private WebElement getUinOrVidButton;

    public GenerateUinOrVidPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isGenerateUinOrVidPageLoaded() {
        return this.isElementDisplayed(retrieveUinVidText, "Retrieve your UIN/VID page");
    }

    public GenerateUinOrVidPage enterApplicationID(String applicationId) {
        sendKeysToTextBox(applicationIdTextBox, applicationId, "application textbox");
        return this;
    }

    public OtpVerificationPage clickOnGetUinOrVidButton() {
        clickOnElement(getUinOrVidButton);
        return new OtpVerificationPage(driver);
    }

}
