package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class QuickAccessPage extends BasePage {

    @AndroidFindBy(accessibility = "introTitle-four")
    @iOSXCUITFindBy(accessibility = "introTitle-four")
    private WebElement quickAccessText;

    @AndroidFindBy(accessibility = "introText-four")
    @iOSXCUITFindBy(accessibility = "introText-four")
    private WebElement quickAccessDescription;

    @AndroidFindBy(accessibility = "next")
    @iOSXCUITFindBy(accessibility = "next")
    private WebElement nextButton;

    @AndroidFindBy(accessibility = "scanningGuideText")
    @iOSXCUITFindBy(accessibility = "scanningGuideText")
    private WebElement holdPhoneSteadyMessage;

    public QuickAccessPage(AppiumDriver driver) {
        super(driver);
    }
    BasePage basePage = new BasePage(driver);



    public boolean  verifyLanguageforQuickAccessTextPageLoaded(String language){
        String actualText = getTextFromLocator(quickAccessText);

        switch (language) {
            case "English":
                boolean isEnglishMatch  = (actualText.equalsIgnoreCase("Quick Access")==true) ? true : false;
                return isEnglishMatch ;
            case "Tamil":
                boolean isTamilMatch  = (actualText.equalsIgnoreCase("விரைவான அணுகல்")==true) ? true : false;
                return isTamilMatch ;
            case "Kannada":
                boolean isKannadaMatch  = (actualText.equalsIgnoreCase("ತ್ವರಿತ ಪ್ರವೇಶ")==true) ? true : false;
                return isKannadaMatch ;
            case "Hindi":
                boolean isHindiMatch  = (actualText.equalsIgnoreCase("त्वरित ऐक्सेस")==true) ? true : false;
                return isHindiMatch ;
            case "Arabic":
                boolean isArabicMatch  = (actualText.equalsIgnoreCase("الوصول السريع")==true) ? true : false;
                return isArabicMatch ;
            case "Filipino":
                boolean isFilipinoMatch  = (actualText.equalsIgnoreCase("Mabilis na pagpasok")==true) ? true : false;
                return isFilipinoMatch ;

        }
        return false;
    }

    public boolean  getQuickAccessDescription(String language){
        String actualText = getTextFromLocator(quickAccessDescription);

        switch (language) {
            case "English":
                boolean isEnglishMatch  = (actualText.equalsIgnoreCase("Authenticate yourself with ease using the stored digital credential.")==true) ? true : false;
                return isEnglishMatch ;
            case "Tamil":
                boolean isTamilMatch  = (actualText.equalsIgnoreCase("சேமிக்கப்பட்ட டிஜிட்டல் நற்சான்றிதழைப் பயன்படுத்தி உங்களை எளிதாக அங்கீகரிக்கவும்.")==true) ? true : false;
                return isTamilMatch ;
            case "Kannada":
                boolean isKannadaMatch  = (actualText.equalsIgnoreCase("ಸಂಗ್ರಹಿಸಿದ ಡಿಜಿಟಲ್ ರುಜುವಾತುಗಳನ್ನು ಬಳಸಿಕೊಂಡು ಸುಲಭವಾಗಿ ನಿಮ್ಮನ್ನು ದೃಢೀಕರಿಸಿ.")==true) ? true : false;
                return isKannadaMatch ;
            case "Hindi":
                boolean isHindiMatch  = (actualText.equalsIgnoreCase("संग्रहीत डिजिटल क्रेडेंशियल का उपयोग करके आसानी से स्वयं को प्रमाणित करें।")==true) ? true : false;
                return isHindiMatch ;
            case "Arabic":
                boolean isArabicMatch  = (actualText.equalsIgnoreCase("قم بالمصادقة على نفسك بسهولة باستخدام بيانات الاعتماد الرقمية المخزنة.")==true) ? true : false;
                return isArabicMatch ;
            case "Filipino":
                boolean isFilipinoMatch  = (actualText.equalsIgnoreCase("I-authenticate ang iyong sarili nang madali gamit ang nakaimbak na digital na kredensyal.")==true) ? true : false;
                return isFilipinoMatch ;

        }
        return false;
    }

    public AppUnlockMethodPage clickOnNextButton() {
        this.clickOnElement(nextButton);
        return new AppUnlockMethodPage(driver);
    }

    public Boolean isHoldPhoneSteadyMessageDisplayed() {
        return isElementDisplayed(holdPhoneSteadyMessage);
    }



}