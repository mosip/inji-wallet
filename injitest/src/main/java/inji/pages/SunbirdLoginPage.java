package inji.pages;

import inji.utils.IosUtil;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;

import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebElement;

public class SunbirdLoginPage extends BasePage {

    @AndroidFindBy(xpath = "//*[contains(@text,'Login with KBA')]")
    private WebElement loginWithKBA;

    @AndroidFindBy(xpath = "//*[@resource-id=\"_form_policyNumber\"]")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeTextField[@name=\"Please fill in this field\" and @value=\"Policy Number\"]")
    private WebElement enterPolicyTextBox;

    @AndroidFindBy(xpath = "//android.widget.EditText[@resource-id=\"_form_fullName\"]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeTextField[`name == \"Please fill in this field\"`][2]")
    private WebElement enterFullnameTextBox;

    @AndroidFindBy(uiAutomator = "UiSelector().className(\"android.widget.Spinner\")")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeOther[`name == \"Please fill in this field\"`]")
    private WebElement enterDateOfBirthTextBox;

    @AndroidFindBy(xpath = "//android.widget.Button[@resource-id=\"android:id/button1\"]")
    @iOSXCUITFindBy(accessibility = "Done")
    private WebElement clickOnSetButton;

    @AndroidFindBy(xpath = "//android.view.View[@content-desc='01 January 2024']")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeButton[@name=\"Monday, January 1\"]")
    private WebElement dateOfBirth;

    @iOSXCUITFindBy(xpath = "//XCUIElementTypeCollectionView//XCUIElementTypeButton[@name=\"Monday, 1 January\"]")
    private WebElement dateOfBirthSecond;
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeStaticText[@name=\"January 2024\"]")
    private WebElement January2024;

    @AndroidFindBy(xpath = "//android.widget.Button[@resource-id=\"verify_form\"]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`name == \"Login\"`]")
    private WebElement loginButton;


    @AndroidFindBy(xpath = "//android.widget.Button[@text=\"Login\"]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`name == \"Login\"`]")
    private WebElement loginButtonSecond;
    @AndroidFindBy(xpath = "//android.widget.ImageButton[@content-desc=\"Previous month\"]")
    @iOSXCUITFindBy(accessibility = "Previous Month")
    private WebElement previousMonth;

    @AndroidFindBy(accessibility = "wallet-activated-icon")
    @iOSXCUITFindBy(accessibility = "wallet-activated-icon")
    private WebElement activatedStatus;

    @AndroidFindBy(accessibility = "a Veridonia logo")
    @iOSXCUITFindBy(accessibility = "a Veridonia logo")
    private WebElement sunbirdLogo;

    @AndroidFindBy(accessibility = "a square logo of a Sunbird")
    @iOSXCUITFindBy(accessibility = "a square logo of a Sunbird")
    private WebElement sunbirdSquareLogo;



    @AndroidFindBy(accessibility = "fullNameValue")
    @iOSXCUITFindBy(accessibility = "fullNameValue")
    private WebElement fullName;

    @AndroidFindBy(accessibility = "fullNameValue")
    @iOSXCUITFindBy(accessibility = "fullNameValue")
    private WebElement fullNameInDetailView;

    @AndroidFindBy(accessibility = "policyNameValue")
    @iOSXCUITFindBy(accessibility = "policyNameValue")
    private WebElement policyName;

    @AndroidFindBy(accessibility = "idTypeValue")
    @iOSXCUITFindBy(accessibility = "idTypeValue")
    private WebElement idType;

    @iOSXCUITFindBy(accessibility = "Continue")
    private WebElement continueButton;

    @AndroidFindBy(accessibility = "verificationStatus")
    @iOSXCUITFindBy(accessibility = "verificationStatus")
    private WebElement status;

    @AndroidFindBy(accessibility = "emailValue")
    @iOSXCUITFindBy(accessibility = "emailValue")
    private WebElement emailIdValue;

    @AndroidFindBy(accessibility = "genderValue")
    @iOSXCUITFindBy(accessibility = "genderValue")
    private WebElement gender;

    @AndroidFindBy(accessibility = "dobValue")
    @iOSXCUITFindBy(accessibility = "dobValue")
    private WebElement dateofBirthValue;

    @AndroidFindBy(accessibility = "mobileValue")
    @iOSXCUITFindBy(accessibility = "mobileValue")
    private WebElement phoneNumber;

    @AndroidFindBy(accessibility = "Policy NumberValue")
    @iOSXCUITFindBy(accessibility = "Policy NumberValue")
    private WebElement policyNumber;

    @AndroidFindBy(accessibility = "ExpiryValue")
    @iOSXCUITFindBy(accessibility = "ExpiryValue")
    private WebElement expiryValue;

    @AndroidFindBy(accessibility = "profileAuthenticated")
    @iOSXCUITFindBy(accessibility = "profileAuthenticated")
    private WebElement activeStatus;

    @AndroidFindBy(accessibility = "qrCodeHeader")
    @iOSXCUITFindBy(accessibility = "qrCodeHeader")
    private WebElement qrCodeHeader;

    @AndroidFindBy(accessibility = "credentialTypeSelectionScreen")
    @iOSXCUITFindBy(accessibility = "credentialTypeSelectionScreen")
    private WebElement credentialTypeSelectionScreen;

    @AndroidFindBy(accessibility = "credentialTypeItem-InsuranceCredential")
    @iOSXCUITFindBy(accessibility = "credentialTypeItem-InsuranceCredential")
    private WebElement credentialTypeItemInsuranceCredential;

    @AndroidFindBy(accessibility = "credentialTypeItem-LifeInsuranceCredential_ldp")
    @iOSXCUITFindBy(accessibility = "credentialTypeItem-LifeInsuranceCredential_ldp")
    private WebElement credentialTypeItemLifeInsuranceCredentialldp;

    @AndroidFindBy(accessibility = "arrow-left")
    @iOSXCUITFindBy(accessibility = "goBack")
    private WebElement arrowLeft;

    @AndroidFindBy(accessibility = "policyExpiresOnValue")
    @iOSXCUITFindBy(accessibility = "policyExpiresOnValue")
    private WebElement policyExpiresOnValue;

    @AndroidFindBy(accessibility = "benefitsValue")
    @iOSXCUITFindBy(accessibility = "benefitsValue")
    private WebElement benefitsValue;

    @AndroidFindBy(xpath = "//android.view.ViewGroup[@resource-id=\"statusIcon\"]")
    private WebElement statusIcon;

    @AndroidFindBy(accessibility = "6done")
    @iOSXCUITFindBy(accessibility = "6done")
    private WebElement doneButton;

    public SunbirdLoginPage(AppiumDriver driver) {
        super(driver);
    }
    BasePage basePage = new BasePage(driver);
    public void clickOnloginWithKbaButton() {
        clickOnElement(loginWithKBA);
    }


    public void enterPolicyNumberTextBox(String PolicyNo) {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        sendKeysToTextBox(enterPolicyTextBox, PolicyNo);
    }

    public void enterFullNameTextBox(String fullname) {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
            sendKeysToTextBox(enterFullnameTextBox, fullname);
    }

    public void enterDateOfBirthTextBox() {
        clickOnElement(enterDateOfBirthTextBox);
        int MAX_ATTEMPTS = 12;
        if (!isElementDisplayed(dateOfBirth, 10)) {
            for (int i = 0; i < MAX_ATTEMPTS; i++) {
                try {
                    clickOnElement(previousMonth);
                    if(isElementDisplayed(dateOfBirth,5)) {
                        break;
                    } else if (isElementDisplayed(dateOfBirthSecond,5)) {
                        break;
                    }

                } catch (TimeoutException e) {
                } catch (NoSuchElementException e) {
                    break;
                }
            }
        }

        if (isElementDisplayed(dateOfBirth,5)) {
            clickOnElement(dateOfBirth);
            clickOnElement(clickOnSetButton);
        } else if (isElementDisplayed(dateOfBirthSecond)) {
            clickOnElement(dateOfBirthSecond);
            clickOnElement(clickOnSetButton);
        }
    }
    public void clickOnloginButton() {
        if(isElementDisplayed(loginButton)) {
            clickOnElement(loginButton);
        }
        else {
            clickOnElement(loginButtonSecond);
        }
    }

    public boolean isSunbirdCardIsActive() {
        if(isElementDisplayed(doneButton))
       clickOnElement(doneButton);
        basePage.retryToGetElement(activatedStatus);
        return this.isElementDisplayed(activatedStatus);
    }

    public boolean isSunbirdCardLogoIsDisplayed() {
        if(isElementDisplayed(sunbirdSquareLogo)){
            basePage.retryToGetElement(sunbirdSquareLogo);
            return true;
        } else if (isElementDisplayed(sunbirdLogo)) {
            basePage.retryToGetElement(sunbirdLogo);
            return true;
        }
        else {
            return false;
        }
    }

    public String getFullNameForSunbirdCard() {
        basePage.retryToGetElement(fullName);
        return this.getTextFromLocator(fullName);
    }
    public String getFullNameForSunbirdCardForDetailView() {
        basePage.retryToGetElement(fullNameInDetailView);
        return this.getTextFromLocator(fullNameInDetailView);
    }
    public String getPolicyNameForSunbirdCard() {
        basePage.retryToGetElement(policyName);
        return this.getTextFromLocator(policyName);
    }

    public String getPolicyNumberForSunbirdCard() {
        basePage.retryToGetElement(policyNumber);
        return this.getTextFromLocator(policyNumber);
    }

    public String getPhoneNumberForSunbirdCard() {
        basePage.retryToGetElement(phoneNumber);
        return this.getTextFromLocator(phoneNumber);
    }

    public String getDateofBirthValueForSunbirdCard() {
        basePage.retryToGetElement(dateofBirthValue);
        return this.getTextFromLocator(dateofBirthValue);
    }

    public String getGenderValueForSunbirdCard() {
        basePage.retryToGetElement(gender);
        return this.getTextFromLocator(gender);
    }

    public String getEmailIdValueForSunbirdCard() {
        IosUtil.scrollToElement(driver,100,800,100,200);
        basePage.retryToGetElement(emailIdValue);
        return this.getTextFromLocator(emailIdValue);
    }

    public String getStatusValueForSunbirdCard() {
        basePage.retryToGetElement(status);
        return this.getTextFromLocator(status);
    }

    public String getIdTypeValueForSunbirdCard() {
        basePage.retryToGetElement(idType);
        return this.getTextFromLocator(idType);
    }

    public void clickOnContinueButtonInSigninPopupIos(){
        clickOnElement(continueButton);
    }

    public void openDetailedSunbirdVcView() {
        basePage.retryToGetElement(fullName);
        clickOnElement(fullName);
    }

    public boolean isSunbirdRCInsuranceVerifiableCredentialHeaderDisplayed() {
        basePage.retryToGetElement(credentialTypeSelectionScreen);
        return this.isElementDisplayed(credentialTypeSelectionScreen);
    }

    public boolean isMosipInsuranceDisplayed() {
        basePage.retryToGetElement(credentialTypeItemInsuranceCredential);
        return this.isElementDisplayed(credentialTypeItemInsuranceCredential);
    }

    public void clickOnMosipInsurance() {
         this.clickOnElement(credentialTypeItemInsuranceCredential);
    }

 public void clickOnBackArrow() {
        this.clickOnElement(arrowLeft);
 }

    public boolean isPolicyExpiresOnValueDisplayed() {
        return this.isElementDisplayed(policyExpiresOnValue);
    }

    public boolean isbenefitsValueDisplayed() {
        return this.isElementDisplayed(benefitsValue);
    }

    public boolean isStatusIconDisplayed() {
        return this.isElementDisplayed(statusIcon);
    }

}
