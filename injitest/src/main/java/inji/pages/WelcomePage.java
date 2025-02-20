package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class WelcomePage extends BasePage {

    @AndroidFindBy(accessibility = "introTitle-one")
    @iOSXCUITFindBy(accessibility = "introTitle-one")
    private WebElement welcomeText;

    @AndroidFindBy(accessibility = "introText-one")
    @iOSXCUITFindBy(accessibility = "introText-one")
    private WebElement welcomeTextDescription;

    @AndroidFindBy(accessibility = "skipButton-one")
    @iOSXCUITFindBy(accessibility = "skipButton-one")
    private WebElement skipButton;

    @AndroidFindBy(accessibility = "next")
    @iOSXCUITFindBy(accessibility = "next")
    private WebElement nextButton;

    @AndroidFindBy(accessibility = "backButton-one")
    @iOSXCUITFindBy(accessibility = "backButton-one")
    public WebElement backButton;

    @AndroidFindBy(accessibility = "selectAppUnlockMethod")
    @iOSXCUITFindBy(accessibility = "selectAppUnlockMethod")
    private WebElement selectAppUnlockMethodHeader;

    @AndroidFindBy(accessibility = "description")
    @iOSXCUITFindBy(accessibility = "description")
    private WebElement description;

    @AndroidFindBy(accessibility = "passwordTypeDescription")
    @iOSXCUITFindBy(accessibility = "passwordTypeDescription")
    private WebElement passwordTypeDescription;

    @AndroidFindBy(xpath = "//android.widget.TextView[@text=\"Requester\"]")
    @iOSXCUITFindBy(accessibility = "passwordTypeDescription")
    private WebElement RequesterHeader;

    @AndroidFindBy(accessibility = "injiLogo")
    @iOSXCUITFindBy(accessibility = "injiLogo")
    private WebElement injiLogo;

    @AndroidFindBy(accessibility = "helpText")
    @iOSXCUITFindBy(accessibility = "helpText")
    private WebElement helpText;



    @AndroidFindBy(accessibility = "AccountSectionHeader")
    @iOSXCUITFindBy(accessibility = "AccountSectionHeader")
    private WebElement AccountSectionHeader;

    @AndroidFindBy(accessibility = "LastBackupSectionHeader")
    @iOSXCUITFindBy(accessibility = "LastBackupSectionHeader")
    private WebElement LastBackupSectionHeader;

    @AndroidFindBy(xpath = "(//android.widget.TextView[@text=\"Backup & Restore\"])[2]")
    @iOSXCUITFindBy(accessibility = "AccountSectionHeader")
    private WebElement BackupAndRestore;









    public WelcomePage(AppiumDriver driver) {
        super(driver);
    }
    BasePage basePage = new BasePage(driver);

    public String  verifyLanguageforWelcomePageLoaded(){
        return getTextFromLocator(welcomeText);
    }

    public boolean isWelcomePageLoaded() {
        basePage.retryToGetElement(welcomeText);
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

    public void clickOnBackButton() {
        this.clickOnElement(backButton);
    }

    public Boolean isSelectAppUnlockMethodHeaderTextDisplayed() {
        return isElementDisplayed(selectAppUnlockMethodHeader);
    }

    public Boolean isWelcomePageDescriptionTextDisplayed() {
        return isElementDisplayed(description);
    }

    public Boolean isPasswordTypeDescriptionTextDisplayed() {
        return isElementDisplayed(passwordTypeDescription);
    }

    public boolean  getWelcomeDescription(String language){
        String actualText = getTextFromLocator(welcomeTextDescription);
        System.out.println(actualText);

        switch (language) {
            case "English":
                boolean isEnglishMatch  = (actualText.equalsIgnoreCase("Keep your digital credential with you at all times. Inji helps you manage and use them effectively. To get started, add cards to your profile.")==true) ? true : false;
                return isEnglishMatch ;
            case "Tamil":
                boolean isTamilMatch  = (actualText.equalsIgnoreCase("உங்கள் டிஜிட்டல் நற்சான்றிதழை எப்போதும் உங்களுடன் வைத்திருக்கவும். ")==true) ? true : false;
                return isTamilMatch ;
            case "Filipino":
                boolean isFilipinoMatch  = (actualText.equalsIgnoreCase("Panatilihin ang iyong digital na kredensyal sa iyo sa lahat ng oras. ")==true) ? true : false;
                return isFilipinoMatch ;
            case "Hindi":
                boolean isHindiMatch  = (actualText.equalsIgnoreCase("अपना डिजिटल क्रेडेंशियल हर समय अपने पास रखें। ")==true) ? true : false;
                return isHindiMatch ;
            case "Kannada":
                boolean isKannadaMatch  = (actualText.equalsIgnoreCase("ನಿಮ್ಮ ಡಿಜಿಟಲ್ ರುಜುವಾತುಗಳನ್ನು ಯಾವಾಗಲೂ ನಿಮ್ಮೊಂದಿಗೆ ಇರಿಸಿಕೊಳ್ಳಿ. ")==true) ? true : false;
                return isKannadaMatch ;
            case "Arabic":
                boolean isArabicMatch  = (actualText.equalsIgnoreCase("احتفظ ببيانات اعتمادك الرقمية معك في جميع الأوقات. ")==true) ? true : false;
                return isArabicMatch ;

        }
        return false;
    }




}