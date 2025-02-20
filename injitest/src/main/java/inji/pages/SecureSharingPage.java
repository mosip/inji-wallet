package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class SecureSharingPage extends BasePage {

    @AndroidFindBy(accessibility = "introTitle-two")
    @iOSXCUITFindBy(accessibility = "introTitle-two")
    private WebElement secureSharingText;

    @AndroidFindBy(accessibility = "introText-two")
    @iOSXCUITFindBy(accessibility = "introText-two")
    private WebElement secureSharingDescription;

    @AndroidFindBy(accessibility = "next")
    @iOSXCUITFindBy(accessibility = "next")
    private WebElement nextButton;

    @AndroidFindBy(xpath = "//android.widget.TextView[@text=\"Requester\"]")
    @iOSXCUITFindBy(accessibility = "passwordTypeDescription")
    private WebElement RequesterHeader;

    @AndroidFindBy(xpath = "//android.widget.TextView[@text=\"Please select an ID\"]")
    @iOSXCUITFindBy(accessibility = "passwordTypeDescription")
    private WebElement pleaseSelectId;


    public SecureSharingPage(AppiumDriver driver) {
        super(driver);
    }
    BasePage basePage = new BasePage(driver);

//    public String  verifyLanguageforSecureSharingPageLoaded(){
//        basePage.retryToGetElement(secureSharingText);
//        return getTextFromLocator(secureSharingText);
//
//    }


    public boolean  verifyLanguageforSecureSharingPageLoaded(String language){
        String actualText = getTextFromLocator(secureSharingText);

        switch (language) {
            case "English":
                boolean isEnglishMatch  = (actualText.equalsIgnoreCase("Secure Sharing")==true) ? true : false;
                return isEnglishMatch ;
            case "Tamil":
                boolean isTamilMatch  = (actualText.equalsIgnoreCase("பாதுகாப்பான பகிர்வு")==true) ? true : false;
                return isTamilMatch ;
            case "Kannada":
                boolean isKannadaMatch  = (actualText.equalsIgnoreCase("ಸುರಕ್ಷಿತ ಹಂಚಿಕೆ")==true) ? true : false;
                return isKannadaMatch ;
            case "Hindi":
                boolean isHindiMatch  = (actualText.equalsIgnoreCase("सुरक्षित साझाकरण")==true) ? true : false;
                return isHindiMatch ;
            case "Arabic":
                boolean isArabicMatch  = (actualText.equalsIgnoreCase("المشاركة الآمنة")==true) ? true : false;
                return isArabicMatch ;
            case "Filipino":
                boolean isFilipinoMatch  = (actualText.equalsIgnoreCase("Ligtas na Pagbabahagi")==true) ? true : false;
                return isFilipinoMatch ;

        }
        return false;
    }

    public boolean  getSecureSharingDescription(String language){
        String actualText = getTextFromLocator(secureSharingDescription);

        switch (language) {
            case "English":
                boolean isEnglishMatch  = (actualText.equalsIgnoreCase("Share your cards securely in a hassle free way and avail various services.")==true) ? true : false;
                return isEnglishMatch ;
            case "Tamil":
                boolean isTamilMatch  = (actualText.equalsIgnoreCase("தொந்தரவு இல்லாத வகையில் உங்கள் கார்டுகளைப் பாதுகாப்பாகப் பகிர்ந்து, பல்வேறு சேவைகளைப் பெறுங்கள்.")==true) ? true : false;
                return isTamilMatch ;
            case "Kannada":
                boolean isKannadaMatch  = (actualText.equalsIgnoreCase("ನಿಮ್ಮ ಕಾರ್ಡ್\u200Cಗಳನ್ನು ಜಗಳ ಮುಕ್ತ ರೀತಿಯಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿ ಹಂಚಿಕೊಳ್ಳಿ ಮತ್ತು ವಿವಿಧ ಸೇವೆಗಳನ್ನು ಪಡೆದುಕೊಳ್ಳಿ.")==true) ? true : false;
                return isKannadaMatch ;
            case "Hindi":
                boolean isHindiMatch  = (actualText.equalsIgnoreCase("परेशानी मुक्त तरीके से अपने कार्ड सुरक्षित रूप से साझा करें और विभिन्न सेवाओं का लाभ उठाएं।")==true) ? true : false;
                return isHindiMatch ;
            case "Arabic":
                boolean isArabicMatch  = (actualText.equalsIgnoreCase("شارك بطاقاتك بأمان وبطريقة خالية من المتاعب واستفد من الخدمات المتنوعة.")==true) ? true : false;
                return isArabicMatch ;
            case "Filipino":
                boolean isFilipinoMatch  = (actualText.equalsIgnoreCase("Ibahagi ang iyong mga card nang ligtas sa isang walang problemang paraan at mag-avail ng iba't ibang serbisyo.")==true) ? true : false;
                return isFilipinoMatch ;

        }
        return false;
    }

    public void clickOnNextButton() {
        this.clickOnElement(nextButton);
        new AppUnlockMethodPage(driver);
    }

    public Boolean isRequesterHeaderTextDisplayed() {
        return isElementDisplayed(RequesterHeader);
    }

    public Boolean isPleaseSelectIdTextDisplayed() {
        return isElementDisplayed(pleaseSelectId);
    }


}