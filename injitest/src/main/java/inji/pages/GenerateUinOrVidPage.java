package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class GenerateUinOrVidPage extends BasePage {

    @AndroidFindBy(accessibility = "getIdHeader")
    @iOSXCUITFindBy(accessibility = "getIdHeader")
    private WebElement retrieveUinVidText;

    @AndroidFindBy(accessibility = "getIdInputModalIndividualId")
    @iOSXCUITFindBy(accessibility = "getIdInputModalIndividualId")
    private WebElement applicationIdTextBox;

    @AndroidFindBy(accessibility = "getIdButton")
    @iOSXCUITFindBy(accessibility = "getIdButton")
    private WebElement getUinOrVidButton;

    @AndroidFindBy(xpath = "//*[@text=\"Network request failed\"]")
    @iOSXCUITFindBy(accessibility = "getIdButton")
    private WebElement networkErrorMesseage;



    public GenerateUinOrVidPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isGenerateUinOrVidPageLoaded() {
        return this.isElementDisplayed(retrieveUinVidText);
    }

    public String getRetrieveUinVidText() {
        return this.getTextFromLocator(retrieveUinVidText);
    }

    public GenerateUinOrVidPage enterApplicationID(String applicationId) {
        sendKeysToTextBox(applicationIdTextBox, applicationId);
        return this;
    }

    public OtpVerificationPage clickOnGetUinOrVidButton() {
        clickOnElement(getUinOrVidButton);
        return new OtpVerificationPage(driver);
    }

    public String getGenerateUinOrVidPageTextloaded() {
        return this.getTextFromLocator(retrieveUinVidText);
    }

    public boolean isNetworkRequesFailedDisplayed() {
        return this.isElementDisplayed(networkErrorMesseage);
    }

}
