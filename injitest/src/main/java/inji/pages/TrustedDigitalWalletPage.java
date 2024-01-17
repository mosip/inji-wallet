package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class TrustedDigitalWalletPage extends BasePage {

    @AndroidFindBy(accessibility = "introTitle")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`label == \"Trusted Digital Wallet\"`]")
    private WebElement trustedDigitalWalletText;

    @AndroidFindBy(accessibility = "introText")
    @iOSXCUITFindBy(xpath = "//*[contains(@value,'Store and carry')]")
    private WebElement trustedDigitalWalletDescription;

    @AndroidFindBy(accessibility = "next")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeOther[`label == \"Next\"`][4]")
    private WebElement nextButton;

    public TrustedDigitalWalletPage(AppiumDriver driver) {
        super(driver);
    }
    
    public String  verifyLanguageforTrustedDigitalWalletPageLoaded(){
     	return getTextFromLocator(trustedDigitalWalletText);
    	
//
//    	switch (language) {
//    	case "English":
//    		boolean isHederLoadedInEnglish  = (actualText.equalsIgnoreCase("Trusted Digital Wallet")==true) ? true : false;
//    		return isHederLoadedInEnglish ;
//    	case "Hindi":
//    		boolean isHederLoadedInHindi  = (actualText.equalsIgnoreCase("विश्वसनीय डिजिटल वॉलेट")==true) ? true : false;
//    		return isHederLoadedInHindi ;
//    	case "Filipino":
//    		boolean isHederLoadedInFilipino  = (actualText.equalsIgnoreCase("Pinagkakatiwalaang Digital Wallet")==true) ? true : false;
//    		return isHederLoadedInFilipino ;
//    	case "Tamil":
//    		boolean isHederLoadedInTamil  = (actualText.equalsIgnoreCase("நம்பகமான டிஜிட்டல் வாலட்")==true) ? true : false;
//    		return isHederLoadedInTamil ;
//    	case "Kannada":
//    		boolean isHederLoadedInKannada  = (actualText.equalsIgnoreCase("ವಿಶ್ವಾಸಾರ್ಹ ಡಿಜಿಟಲ್ ವಾಲೆಟ್")==true) ? true : false;
//    		return isHederLoadedInKannada ;
//    	}
//    	return false;
    }

    public String getTrustedDigitalWalletDescription() {
        return this.getTextFromLocator(trustedDigitalWalletDescription);
    }

    public AppUnlockMethodPage clickOnNextButton() {
        this.clickOnElement(nextButton);
        return new AppUnlockMethodPage(driver);
    }

}
