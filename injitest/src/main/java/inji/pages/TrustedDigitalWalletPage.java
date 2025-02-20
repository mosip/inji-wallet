package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class TrustedDigitalWalletPage extends BasePage {

    @AndroidFindBy(accessibility = "introTitle-three")
    @iOSXCUITFindBy(accessibility = "introTitle-three")
    private WebElement trustedDigitalWalletText;

    @AndroidFindBy(accessibility = "introText-three")
    @iOSXCUITFindBy(accessibility = "introText-three")
    private WebElement trustedDigitalWalletDescription;

    @AndroidFindBy(accessibility = "next")
    @iOSXCUITFindBy(accessibility = "next")
    private WebElement nextButton;

    @AndroidFindBy(accessibility = "injiLogo")
    @iOSXCUITFindBy(accessibility = "injiLogo")
    private WebElement injiLogo;

    @AndroidFindBy(accessibility = "helpText")
    @iOSXCUITFindBy(accessibility = "helpText")
    private WebElement helpText;

    public TrustedDigitalWalletPage(AppiumDriver driver) {
        super(driver);
    }
    BasePage basePage = new BasePage(driver);


    public boolean  verifyLanguageforTrustedDigitalWalletPageLoaded(String language){
        String actualText = getTextFromLocator(trustedDigitalWalletText);

        switch (language) {
            case "English":
                boolean isEnglishMatch  = (actualText.equalsIgnoreCase("Trusted Digital Wallet")==true) ? true : false;
                return isEnglishMatch ;
            case "Tamil":
                boolean isTamilMatch  = (actualText.equalsIgnoreCase("நம்பகமான டிஜிட்டல் வாலட்")==true) ? true : false;
                return isTamilMatch ;
            case "Kannada":
                boolean isKannadaMatch  = (actualText.equalsIgnoreCase("ವಿಶ್ವಾಸಾರ್ಹ ಡಿಜಿಟಲ್ ವಾಲೆಟ್")==true) ? true : false;
                return isKannadaMatch ;
            case "Hindi":
                boolean isHindiMatch  = (actualText.equalsIgnoreCase("विश्वसनीय डिजिटल वॉलेट")==true) ? true : false;
                return isHindiMatch ;
            case "Arabic":
                boolean isArabicMatch  = (actualText.equalsIgnoreCase("المحفظة الرقمية الموثوقة")==true) ? true : false;
                return isArabicMatch ;
            case "Filipino":
                boolean isFilipinoMatch  = (actualText.equalsIgnoreCase("Pinagkakatiwalaang Digital Wallet")==true) ? true : false;
                return isFilipinoMatch ;

        }
        return false;
    }


    public boolean  getTrustedDigitalWalletDescription(String language){
        String actualText = getTextFromLocator(trustedDigitalWalletDescription);

        switch (language) {
            case "English":
                boolean isEnglishMatch  = (actualText.equalsIgnoreCase("Store and carry all your important cards in a single trusted wallet.")==true) ? true : false;
                return isEnglishMatch ;
            case "Tamil":
                boolean isTamilMatch  = (actualText.equalsIgnoreCase("உங்கள் முக்கியமான கார்டுகளை ஒரே நம்பகமான பணப்பையில் சேமித்து எடுத்துச் செல்லுங்கள்.")==true) ? true : false;
                return isTamilMatch ;
            case "Kannada":
                boolean isKannadaMatch  = (actualText.equalsIgnoreCase("ನಿಮ್ಮ ಎಲ್ಲಾ ಪ್ರಮುಖ ಕಾರ್ಡ್\u200Cಗಳನ್ನು ಒಂದೇ ವಿಶ್ವಾಸಾರ್ಹ ವ್ಯಾಲೆಟ್\u200Cನಲ್ಲಿ ಸಂಗ್ರಹಿಸಿ ಮತ್ತು ಒಯ್ಯಿರಿ.")==true) ? true : false;
                return isKannadaMatch ;
            case "Hindi":
                boolean isHindiMatch  = (actualText.equalsIgnoreCase("अपने सभी महत्वपूर्ण कार्डों को एक ही विश्वसनीय वॉलेट में रखें और रखें।")==true) ? true : false;
                return isHindiMatch ;
            case "Arabic":
                boolean isArabicMatch  = (actualText.equalsIgnoreCase("قم بتخزين وحمل جميع بطاقاتك المهمة في محفظة واحدة موثوقة.")==true) ? true : false;
                return isArabicMatch ;
            case "Filipino":
                boolean isFilipinoMatch  = (actualText.equalsIgnoreCase("Itabi at dalhin ang lahat ng iyong mahahalagang card sa isang pinagkakatiwalaang wallet.")==true) ? true : false;
                return isFilipinoMatch ;

        }
        return false;
    }

    public AppUnlockMethodPage clickOnNextButton() {
        this.clickOnElement(nextButton);
        return new AppUnlockMethodPage(driver);
    }

    public Boolean isInjiLogoDisplayed() {
        return isElementDisplayed(injiLogo);
    }

    public Boolean isHelpTextDisplayed() {
        return isElementDisplayed(helpText);
    }

}