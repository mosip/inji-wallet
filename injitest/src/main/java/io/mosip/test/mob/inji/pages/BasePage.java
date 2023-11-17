package io.mosip.test.mob.inji.pages;

import io.mosip.test.mob.inji.extentReports.ExtentLogger;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AppiumFieldDecorator;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static java.time.Duration.ofSeconds;

public class BasePage {
    protected AppiumDriver driver;

    public BasePage(AppiumDriver driver) {
        this.driver = driver;
        PageFactory.initElements(new AppiumFieldDecorator(driver), this);
    }

    protected boolean isElementDisplayed(By locator, String elementName) {
        return isElementDisplayed(locator, 30, elementName);
    }

    protected boolean isElementDisplayed(By locator, long seconds, String elementName) {
        WebDriverWait wait = new WebDriverWait(driver, ofSeconds(seconds));
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
            ExtentLogger.pass(elementName + " is displayed");
            return true;
        } catch (Exception e) {
            //ExtentLogger.fail(elementName + " is not displayed");
            return false;
        }
    }

    protected boolean isElementDisplayed(WebElement element, String elementName) {
        try {
            waitForElementToBeVisible(element);
            ExtentLogger.pass(elementName + " is displayed");
            return true;
        } catch (Exception e) {
            //ExtentLogger.fail(elementName + " is not displayed");
            return false;
        }
    }

    protected void clickOnElement(WebElement element) {
        waitForElementToBeVisible(element);
        element.click();
    }

    protected void clickOnElement(By locator) {
        driver.findElement(locator).click();
    }

    private void waitForElementToBeVisible(WebElement element) {
        WebDriverWait wait = new WebDriverWait(driver, ofSeconds(30));
        wait.until(ExpectedConditions.visibilityOf(element));
    }
    
    protected boolean isElementEnabled(WebElement element) {
        try {
            waitForElementToBeVisible(element);
            element.isEnabled();
            ExtentLogger.pass(element + " is displayed");
            return true;
        } catch (Exception e) {
            //ExtentLogger.fail(elementName + " is not displayed");
            return false;
        }
    }
    
    protected void clearTextBoxAndSendKeys(WebElement element, String text, String elementName) {
        this.waitForElementToBeVisible(element);
        element.clear();
        element.sendKeys(text);
        ExtentLogger.pass(text + " entered in " + elementName);
    }

    protected void sendKeysToTextBox(WebElement element, String text, String elementName) {
        this.waitForElementToBeVisible(element);
        element.sendKeys(text);
        ExtentLogger.pass(text + " entered in " + elementName);
    }

    protected String getTextFromLocator(WebElement element) {
        this.waitForElementToBeVisible(element);
        return element.getText();
    }
}
