package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class HassleFreeAuthenticationPage extends BasePage {

    @AndroidFindBy(accessibility = "introTitle")
    @iOSXCUITFindBy(iOSNsPredicate = "label == \"Hassle free authentication\"")
    private WebElement hassleFreeAuthenticationText;

    @AndroidFindBy(accessibility = "introText")
    @iOSXCUITFindBy(xpath = "//*[contains(@value,'Authenticate yourself')]")
    private WebElement hassleFreeAuthenticationDescription;

    @AndroidFindBy(accessibility = "getStarted")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`label == \"Back\"`][4]")
    public WebElement goBackButton;

    public HassleFreeAuthenticationPage(AppiumDriver driver) {
        super(driver);
    }
    
    public String  verifyLanguageforHassleFreeAuthenticationPageLoaded(){
    	return getTextFromLocator(hassleFreeAuthenticationText);

//    	switch (language) {
//    	case "English":
//    		boolean isHederLoadedInEnglish  = (actualText.equalsIgnoreCase("Hassle free authentication")==true) ? true : false;
//    		return isHederLoadedInEnglish ;
//    	case "Hindi":
//    		boolean isHederLoadedInHindi  = (actualText.equalsIgnoreCase("परेशानी मुक्त प्रमाणीकरण")==true) ? true : false;
//    		return isHederLoadedInHindi ;
//    	case "Filipino":
//    		boolean isHederLoadedInFilipino  = (actualText.equalsIgnoreCase("Walang problema sa pagpapatotoo")==true) ? true : false;
//    		return isHederLoadedInFilipino ;
//    	case "Tamil":
//    		boolean isHederLoadedInTamil  = (actualText.equalsIgnoreCase("தொந்தரவு இல்லாத அங்கீகாரம்")==true) ? true : false;
//    		return isHederLoadedInTamil ;
//    	case "Kannada":
//    		boolean isHederLoadedInKannada  = (actualText.equalsIgnoreCase("ಜಗಳ ಮುಕ್ತ ದೃಢೀಕರಣ")==true) ? true : false;
//    		return isHederLoadedInKannada ;
//    	}
//    	return false;
    }

    public String getHassleFreeAuthenticationDescription() {
        return this.getTextFromLocator(hassleFreeAuthenticationDescription);
    }
    
    public HassleFreeAuthenticationPage clickOnGoBack() {
        clickOnElement(goBackButton);
        return this;
    }
}
