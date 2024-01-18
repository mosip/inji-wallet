package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class SecureSharingPage extends BasePage {

    @AndroidFindBy(accessibility = "introTitle")
    @iOSXCUITFindBy(xpath = "(//XCUIElementTypeStaticText[@name=\"introTitle\"])[3]")
    private WebElement secureSharingText;

    @AndroidFindBy(accessibility = "introText")
    @iOSXCUITFindBy(xpath = "(//XCUIElementTypeStaticText[@name=\"introText\"])[3]")
    private WebElement secureSharingDescription;

    @AndroidFindBy(accessibility = "next")
    @iOSXCUITFindBy(xpath = "(//XCUIElementTypeOther[@name=\"Susunod\" or @name=\"next\" or @name=\"अगला\" or @name=\"ಮುಂದೆ\" or @name=\"அடுத்தது\"])[4]\n")
    private WebElement nextButton;

    public SecureSharingPage(AppiumDriver driver) {
        super(driver);
    }
    
    public String  verifyLanguageforSecureSharingPageLoaded(){
    	return getTextFromLocator(secureSharingText);

//    	switch (language) {
//    	case "English":
//    		boolean isHederLoadedInEnglish  = (actualText.equalsIgnoreCase("Secure Sharing")==true) ? true : false;
//    		return isHederLoadedInEnglish ;
//    	case "Hindi":
//    		boolean isHederLoadedInHindi  = (actualText.equalsIgnoreCase("सुरक्षित साझाकरण")==true) ? true : false;
//    		return isHederLoadedInHindi ;
//    	case "Filipino":
//    		boolean isHederLoadedInFilipino  = (actualText.equalsIgnoreCase("Mabilis na pagpasok")==true) ? true : false;
//    		return isHederLoadedInFilipino ;
//    	case "Tamil":
//    		boolean isHederLoadedInTamil  = (actualText.equalsIgnoreCase("பாதுகாப்பான பகிர்வு")==true) ? true : false;
//    		return isHederLoadedInTamil ;
//    	case "Kannada":
//    		boolean isHederLoadedInKannada  = (actualText.equalsIgnoreCase("ಸುರಕ್ಷಿತ ಹಂಚಿಕೆ")==true) ? true : false;
//    		return isHederLoadedInKannada ;
//    	}
//    	return false;
    }

    public String getSecureSharingDescription() {
        return this.getTextFromLocator(secureSharingDescription);
    }

    public void clickOnNextButton() {
        this.clickOnElement(nextButton);
        new AppUnlockMethodPage(driver);
    }
}
