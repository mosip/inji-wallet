package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class BackupDataPage extends BasePage {

    @AndroidFindBy(accessibility = "introTitle")
    @iOSXCUITFindBy(xpath = "(//XCUIElementTypeStaticText[@name=\"introTitle\"])[4]")
    private WebElement backupDataText;

    @AndroidFindBy(accessibility = "introText")
    @iOSXCUITFindBy(xpath = "(//XCUIElementTypeStaticText[@name=\"introText\"])[4]")
    private WebElement backupDataDescription;

    @AndroidFindBy(accessibility = "getStarted")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`label == \"Back\"`][4]")
    public WebElement goBackButton;

    public BackupDataPage(AppiumDriver driver) {
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
    
    public BackupDataPage clickOnGoBack() {
        clickOnElement(goBackButton);
        return this;
    }
}
