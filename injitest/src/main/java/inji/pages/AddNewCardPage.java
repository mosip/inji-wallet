package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class AddNewCardPage extends BasePage{

    @AndroidFindBy(accessibility = "issuersScreenHeader")
    @iOSXCUITFindBy(accessibility = "title")
    private WebElement addNewCardHeader;

    @AndroidFindBy(accessibility = "issuerHeading-Mosip")
    @iOSXCUITFindBy(accessibility = "issuerHeading-Mosip")
    private WebElement downloadViaUin;
    
    @AndroidFindBy(accessibility = "goBack")
    @iOSXCUITFindBy(accessibility = "goBack")
    private WebElement backButton;
    
    @AndroidFindBy(accessibility = "issuer-ESignet")
    @iOSXCUITFindBy(accessibility = "issuerHeading-ESignet")
    private WebElement downloadViaEsignet;
    
    @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Please choose your preferred issuer from the options below to add a new card.\")")
    private WebElement addNewCardGuideMessage;
    
    public AddNewCardPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isAddNewCardPageLoaded() {
        return this.isElementDisplayed(addNewCardHeader, "Home page");
    }

    public RetrieveIdPage clickOnDownloadViaUin(){
        clickOnElement(downloadViaUin);
        return new RetrieveIdPage(driver);
    }
    
    public AddNewCardPage clickOnBack() {
    	clickOnElement(backButton);
		return this;
    }
    
    public boolean isAddNewCardGuideMessageDisplayed() {
        return this.isElementDisplayed(addNewCardGuideMessage, "Please choose your preferred issuer from the options below to add a new card.");
    }
    
    public boolean isDownloadViaUinDisplayed() {
        return this.isElementDisplayed(downloadViaUin, "Download via UIN, VID, AID");
    }
    
    public boolean isDownloadViaEsignetDisplayed() {
        return this.isElementDisplayed(downloadViaEsignet, "Download via e-Signet");
    }
    
    public EsignetLoginPage clickOnDownloadViaEsignet(){
        clickOnElement(downloadViaEsignet);
        return new EsignetLoginPage(driver);
    }
}
