package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class WelcomePage extends BasePage {

    @AndroidFindBy(accessibility = "introTitle")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`label == \"Welcome!\"`]")
    private WebElement welcomeText;

    @AndroidFindBy(accessibility = "introText")
    @iOSXCUITFindBy(xpath = "//*[contains(@value,'Keep your digital')]")
    private WebElement welcomeTextDescription;

    @AndroidFindBy(accessibility = "skip")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`label == \"Skip\"`][1]")
    private WebElement skipButton;

    @AndroidFindBy(accessibility = "next")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeOther[`label == \"Next\"`][4]")
    private WebElement nextButton;

    @AndroidFindBy(uiAutomator = "new UiSelector().textContains(\"Back\")")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`label == \"Back\"`][1]")
    public WebElement backButton;

    public WelcomePage(AppiumDriver driver) {
        super(driver);
    }
    
    public boolean  verifyLanguageforWelcomePageLoaded(String language){
    	String actualText = welcomeText.getText();
    	
    	switch (language) {
        case "Hindi":
        	 boolean isHederLoadedInHindi  = (actualText.equals("सुरक्षित साझाकरण!")==true) ? true : false;
        	 return isHederLoadedInHindi ;
        case "Filipino":
        	boolean isHederLoadedInFilipino  = (actualText.equals("Ligtas na Pagbabahagi!")==true) ? true : false;
       	 return isHederLoadedInFilipino ;
        case "Tamil":
       	boolean isHederLoadedInTamil  = (actualText.equals("பாதுகாப்பான பகிர்வு!")==true) ? true : false;
      	 return isHederLoadedInTamil ;
        case "Kannada":
           	boolean isHederLoadedInKannada  = (actualText.equals("ಸುರಕ್ಷಿತ ಹಂಚಿಕೆ!")==true) ? true : false;
          	 return isHederLoadedInKannada ;
    	}
    	return false;
    	}
    
    public boolean isWelcomePageLoaded() {
        return this.isElementDisplayed(welcomeText);
    }
    
    public AppUnlockMethodPage clickOnSkipButton() {
        this.clickOnElement(skipButton);
        return new AppUnlockMethodPage(driver);
    }

    public void clickOnNextButton() {
        this.clickOnElement(nextButton);
        new AppUnlockMethodPage(driver);
    }

    public String getWelcomeDescription() {
        return this.getTextFromLocator(welcomeTextDescription);
    }

    public void clickOnBackButton() {
        this.clickOnElement(backButton);
    }
}
