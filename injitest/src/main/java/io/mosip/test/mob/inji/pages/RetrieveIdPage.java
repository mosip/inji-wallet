package io.mosip.test.mob.inji.pages;

import io.mosip.test.mob.inji.constants.Target;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;


public class RetrieveIdPage extends BasePage {
    @AndroidFindBy(xpath = "//*[contains(@text,'Retrieve your ID')]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`label == \"Retrieve your ID\"`]")
    private WebElement retrieveIdText;

    @AndroidFindBy(xpath = "//*[contains(@text,'Enter ID')]")
    @iOSXCUITFindBy(accessibility = "RNE__Input__text-input")
    private WebElement enterIdTextBox;

    @AndroidFindBy(xpath = "//*[contains(@text,'Generate Card')]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`label == \"Generate Card\"`]")
    private WebElement generateCardButton;

    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypePickerWheel[`value == \"UIN\"`]")
    private WebElement vidDropDownValueIos;

    @AndroidFindBy(xpath = "//*[contains(@text,'VID')]")
    private WebElement vidDropDownValueAndroid;

    @AndroidFindBy(className = "android.widget.Spinner")
    private WebElement spinnerButton;

    @AndroidFindBy(xpath = "//*[contains(@text,'Get it now')]")
    @iOSXCUITFindBy(accessibility = "Get it now")
    private WebElement getItNowText;


    public RetrieveIdPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isRetrieveIdPageLoaded() {
        return this.isElementDisplayed(retrieveIdText, "Retrieve your id page");
    }

    public RetrieveIdPage setEnterIdTextBox(String uinOrVid) {
        sendKeysToTextBox(enterIdTextBox, uinOrVid, "uin or vid textbox");
        return this;
    }

    public OtpVerificationPage clickOnGenerateCardButton() {
        this.clickOnElement(generateCardButton);
        return new OtpVerificationPage(driver);
    }

    public GenerateUinOrVidPage clickOnGetItNowText() {
        this.clickOnElement(getItNowText);
        return new GenerateUinOrVidPage(driver);
    }


    public RetrieveIdPage clickOnVid(Target os) {
        switch (os) {
            case ANDROID:
                clickOnElement(spinnerButton);
                clickOnElement(vidDropDownValueAndroid);
                break;
            case IOS:
                sendKeysToTextBox(vidDropDownValueIos, "VID", "ios dropdown");
                break;
        }
        return this;
    }
}
