package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class BackupDataTourPage extends BasePage {

    @AndroidFindBy(accessibility = "introTitle-five")
    @iOSXCUITFindBy(accessibility = "introTitle-five")
    private WebElement backupDataText;

    @AndroidFindBy(accessibility = "introText-five")
    @iOSXCUITFindBy(accessibility = "introText-five")
    private WebElement backupDataDescription;

    @AndroidFindBy(accessibility = "goBack")
    @iOSXCUITFindBy(accessibility = "goBack")
    public WebElement goBackButton;

    @AndroidFindBy(accessibility = "AccountSectionHeader")
    @iOSXCUITFindBy(accessibility = "AccountSectionHeader")
    private WebElement AccountSectionHeader;

    @AndroidFindBy(accessibility = "LastBackupSectionHeader")
    @iOSXCUITFindBy(accessibility = "LastBackupSectionHeader")
    private WebElement LastBackupSectionHeader;

    @AndroidFindBy(xpath = "(//android.widget.TextView[@text=\"Backup & Restore\"])[2]")
    @iOSXCUITFindBy(accessibility = "AccountSectionHeader")
    private WebElement BackupAndRestore;

    public BackupDataTourPage(AppiumDriver driver) {
        super(driver);
    }
    BasePage basePage = new BasePage(driver);

    public boolean  verifyLanguageforBackupDataPageLoaded(String language){
        String actualText = getTextFromLocator(backupDataText);

        switch (language) {
            case "English":
                boolean isEnglishMatch  = (actualText.equalsIgnoreCase("Backup & Restore")==true) ? true : false;
                return isEnglishMatch ;
            case "Tamil":
                boolean isTamilMatch  = (actualText.equalsIgnoreCase("காப்புப்பிரதி மற்றும் மீட்டமை")==true) ? true : false;
                return isTamilMatch ;
            case "Kannada":
                boolean isKannadaMatch  = (actualText.equalsIgnoreCase("ಬ್ಯಾಕಪ್ & ಮರುಸ್ಥಾಪಿಸಿ")==true) ? true : false;
                return isKannadaMatch ;
            case "Hindi":
                boolean isHindiMatch  = (actualText.equalsIgnoreCase("बैकअप & पुनर्स्थापित करना")==true) ? true : false;
                return isHindiMatch ;
            case "Arabic":
                boolean isArabicMatch  = (actualText.equalsIgnoreCase("دعم & يعيد")==true) ? true : false;
                return isArabicMatch ;
            case "Filipino":
                boolean isFilipinoMatch  = (actualText.equalsIgnoreCase("Backup & Ibalik")==true) ? true : false;
                return isFilipinoMatch ;

        }
        return false;
    }

    public boolean  getBackupDataPageDescription(String language){
        String actualText = getTextFromLocator(backupDataDescription);

        switch (language) {
            case "English":
                boolean isEnglishMatch  = (actualText.equalsIgnoreCase("Protect your data with ease using our Backup & Restore feature. Safely store your VCs against loss or accidents by creating regular backups and recover it effortlessly whenever needed for seamless continuity.")==true) ? true : false;
                return isEnglishMatch ;
            case "Tamil":
                boolean isTamilMatch  = (actualText.equalsIgnoreCase("எங்கள் காப்புப்பிரதியைப் பயன்படுத்தி உங்கள் தரவை எளிதாகப் பாதுகாக்கவும்")==true) ? true : false;
                return isTamilMatch ;
            case "Kannada":
                boolean isKannadaMatch  = (actualText.equalsIgnoreCase("ನಮ್ಮ ಬ್ಯಾಕಪ್ ಅನ್ನು ಬಳಸಿಕೊಂಡು ನಿಮ್ಮ ಡೇಟಾವನ್ನು ಸುಲಭವಾಗಿ ರಕ್ಷಿಸಿ")==true) ? true : false;
                return isKannadaMatch ;
            case "Hindi":
                boolean isHindiMatch  = (actualText.equalsIgnoreCase("हमारे बैकअप का उपयोग करके आसानी से अपने डेटा को सुरक्षित रखें")==true) ? true : false;
                return isHindiMatch ;
            case "Arabic":
                boolean isArabicMatch  = (actualText.equalsIgnoreCase("قم بحماية بياناتك بسهولة باستخدام النسخة الاحتياطية لدينا")==true) ? true : false;
                return isArabicMatch ;
            case "Filipino":
                boolean isFilipinoMatch  = (actualText.equalsIgnoreCase("Protektahan ang iyong data nang madali gamit ang aming Backup")==true) ? true : false;
                return isFilipinoMatch ;

        }
        return false;
    }

    public BackupDataTourPage clickOnGoBack() {
        clickOnElement(goBackButton);
        return this;
    }

    public Boolean isAccountSectionHeaderDisplayed() {
        return isElementDisplayed(AccountSectionHeader);
    }

    public Boolean isLastBackupSectionHeaderDisplayed() {
        return isElementDisplayed(LastBackupSectionHeader);
    }

    public Boolean isBackupAndRestoreDisplayed() {
        return isElementDisplayed(BackupAndRestore);
    }


}