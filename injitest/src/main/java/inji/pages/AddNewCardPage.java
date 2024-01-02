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
    
    @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Mangyaring piliin ang iyong gustong tagabigay mula sa mga opsyon sa ibaba upang magdagdag ng bagong card.\")")
    private WebElement addNewCardGuideMessageInFillpino;
    
    @AndroidFindBy(accessibility = "issuerDescription-Mosip")
    @iOSXCUITFindBy(accessibility = "issuerDescription-Mosip")
    private WebElement issuerDescriptionMosip;
    
    @AndroidFindBy(accessibility = "issuerDescription-ESignet")
    @iOSXCUITFindBy(accessibility = "issuerDescription-ESignet")
    private WebElement issuerDescriptionEsignet;
    
    @AndroidFindBy(className = "android.widget.EditText")
    @iOSXCUITFindBy(accessibility = "issuerSearchBar")
    private WebElement issuerSearchBar;
    
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
    
    public boolean isDownloadViaEsignetDisplayedinFillpino() {
        return this.isElementDisplayed(downloadViaEsignet, "I-download sa pamamagitan ng e-Signet");
    }
    
    public EsignetLoginPage clickOnDownloadViaEsignet(){
        clickOnElement(downloadViaEsignet);
        return new EsignetLoginPage(driver);
    }
    
    public boolean isBackButtonDisplayed() {
        return backButton.isDisplayed() ;
    }
    
    public boolean isAddNewCardGuideMessageDisplayedInFillopin() {
        return this.isElementDisplayed(addNewCardGuideMessageInFillpino, "Mangyaring piliin ang iyong gustong tagabigay mula sa mga opsyon sa ibaba upang magdagdag ng bagong card.");
    }
    
    public boolean isIssuerDescriptionMosipDisplayed() {
        return this.isElementDisplayed(issuerDescriptionMosip, "Enter your national ID to download your card.");
    }
    
    public boolean isIssuerDescriptionEsignetDisplayed() {
        return this.isElementDisplayed(issuerDescriptionEsignet, "Enter your national ID to download your card.");
    }
    
    public boolean isIssuerSearchBarDisplayed() {
    	return this.isElementDisplayed(issuerSearchBar, "Search by Issuer’s name");
    }
    
    public boolean isIssuerSearchBarDisplayedInFilipino() {
    	return this.isElementDisplayed(issuerSearchBar, "Maghanap ayon sa pangalan ng Nag-isyu");
    }
    
    public AddNewCardPage IssuerSearchBar(String env) {
    	clearTextBoxAndSendKeys(issuerSearchBar, env, "issuer search bar");
        return this;
    }


}
