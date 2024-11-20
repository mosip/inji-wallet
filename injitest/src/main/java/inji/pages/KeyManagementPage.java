package inji.pages;

import inji.utils.IosUtil;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

import java.util.Arrays;
import java.util.List;

public class KeyManagementPage extends BasePage {
    @AndroidFindBy(accessibility = "7done")
    @iOSXCUITFindBy(accessibility = "7done")
    private WebElement stepCountButton;

    @AndroidFindBy(accessibility = "saveKeyOrderingPreference")
    @iOSXCUITFindBy(accessibility = "saveKeyOrderingPreference")
    private WebElement saveKeyOrderingPreference;

    @AndroidFindBy(accessibility = "keyOrderingSuccessText")
    @iOSXCUITFindBy(accessibility = "keyOrderingSuccessText")
    private WebElement keyOrderingSuccessText;

    @AndroidFindBy(accessibility = "arrow-left")
    @iOSXCUITFindBy(accessibility = "arrow-left")
    private WebElement arrowleftButton;


    @AndroidFindBy(xpath = "(//android.widget.TextView[@resource-id=\"iconIcon\"])[6]")
    @iOSXCUITFindBy(xpath = "(//XCUIElementTypeOther[@name=\"RSA \uE25D\"])[2]")
    private WebElement RSAText;

    @AndroidFindBy(xpath = "(//android.widget.TextView[@resource-id=\"iconIcon\"])[3]")
    @iOSXCUITFindBy(xpath = "(//XCUIElementTypeOther[@name=\"ED25519 \uE25D\"])[2]")
    private WebElement ED25519Text;

    @AndroidFindBy(xpath = "//android.widget.TextView[@resource-id=\"listItemTitle\" and @text=\"ECC R1\"]")
    @iOSXCUITFindBy(xpath = "(//XCUIElementTypeOther[@name=\"ED25519 \uE25D\"])[2]")
    private WebElement ECCR1Text;



    @AndroidFindBy(accessibility = "keyTypeVcDetailViewValue")
    @iOSXCUITFindBy(accessibility = "saveKeyOrderingPreference")
    private WebElement keyTypeVcDetailViewValue;


    public KeyManagementPage(AppiumDriver driver) {
        super(driver);
    }
    BasePage basePage = new BasePage(driver);
    public boolean isDoneButtonDisplayed() {
        return this.isElementDisplayed(stepCountButton);
    }

    public void clickOnDoneButton() {
       clickOnElement (stepCountButton);
    }

    public WebElement getTheCoordinatesForRSA(){
        RSAText.isDisplayed();
        return RSAText;
    }

    public WebElement getTheCoordinatesED25519Text(){

        ECCR1Text.isDisplayed();
        return ECCR1Text;
    }

    public WebElement getTheCoordinatesECCR1TextText(){
        ECCR1Text.isDisplayed();
        return ECCR1Text;
    }

    public void clickOnSaveKeyOrderingPreferenceButton() {
        clickOnElement (saveKeyOrderingPreference);
    }

    public void clickOnArrowleftButton() {
        clickOnElement (arrowleftButton);
    }

    public boolean iskeyOrderingSuccessTextMessageDisplayed() {
        return this.isElementDisplayed(keyOrderingSuccessText);
    }

    public String getPKeyTypeVcDetailViewValueSunbirdCard() {
        IosUtil.scrollToElement(driver,100,800,100,200);
        basePage.retryToGetElement(keyTypeVcDetailViewValue);
        return this.getTextFromLocator(keyTypeVcDetailViewValue);
    }

    public boolean compareListOfKeys() {
        List<String> stringList = Arrays.asList("ED25519", "ES256K", "ES256", "RS256");
        String str = getPKeyTypeVcDetailViewValueSunbirdCard();

        for (String key : stringList) {
            if (str.equals(key)) {
                return true;
            }
        }
        return false;
    }
}
