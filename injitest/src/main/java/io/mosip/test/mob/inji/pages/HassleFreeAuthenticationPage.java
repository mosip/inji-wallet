package io.mosip.test.mob.inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class HassleFreeAuthenticationPage extends BasePage {

    @AndroidFindBy(xpath = "//*[contains(@text,'Hassle free authentication')]")
    @iOSXCUITFindBy(iOSNsPredicate = "label == \"Hassle free authentication\"")
    private WebElement hassleFreeAuthenticationText;

    @AndroidFindBy(xpath = "(//*[@class='android.widget.TextView'])[3]")
    @iOSXCUITFindBy(xpath = "//*[contains(@value,'Authenticate yourself')]")
    private WebElement hassleFreeAuthenticationDescription;

    public HassleFreeAuthenticationPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isHassleFreeAuthenticationPageLoaded() {
        return this.isElementDisplayed(hassleFreeAuthenticationText, "Hassle free authentication page");
    }

    public String getHassleFreeAuthenticationDescription() {
        return this.getTextFromLocator(hassleFreeAuthenticationDescription);
    }
}
