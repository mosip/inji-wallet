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

    public BackupDataTourPage(AppiumDriver driver) {
        super(driver);
    }
    BasePage basePage = new BasePage(driver);

    public String  verifyLanguageforBackupDataPageLoaded(){
        basePage.retrieToGetElement(backupDataText);
        return getTextFromLocator(backupDataText);
    }

    public String getBackupDataPageDescription() {

        basePage.retrieToGetElement(backupDataDescription);
        return this.getTextFromLocator(backupDataDescription);
    }

    public BackupDataTourPage clickOnGoBack() {
        clickOnElement(goBackButton);
        return this;
    }
}
