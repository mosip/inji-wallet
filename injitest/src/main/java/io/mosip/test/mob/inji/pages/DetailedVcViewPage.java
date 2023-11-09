package io.mosip.test.mob.inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public class DetailedVcViewPage extends BasePage{
    @AndroidFindBy(xpath = "//*[contains(@text,'ID Details')]")
    private WebElement detailedVcViewPageTitle;

    public DetailedVcViewPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isDetailedVcViewPageLoaded() {
        return this.isElementDisplayed(detailedVcViewPageTitle, "detailed Vc view page title page");
    }

    public boolean isDetailedVcViewLoaded(String name) {
        By fullName = By.xpath("//*[contains(@name,'" + name + "') or contains(@text,'" + name + "')]");
        return this.isElementDisplayed(fullName, 60, "Name on downloaded card");
    }
}
