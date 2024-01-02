package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AppiumFieldDecorator;
import inji.extentReports.ExtentLogger;
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
    
    protected boolean isElementDisplayed(WebElement element,int waitTime, String elementName) {
        try {
            waitForElementToBeVisible(element,waitTime);
            ExtentLogger.pass(elementName + " is displayed");
            return true;
        } catch (Exception e) {
            //ExtentLogger.fail(elementName + " is not displayed");
            return false;
        }
    }
    
    protected boolean isElementInvisibleYet(WebElement element, String elementName) {
        try {
        	waitForElementToBeInvisible(element);
            ExtentLogger.pass(elementName + " is displayed");
            return false;
        } catch (Exception e) {
            //ExtentLogger.fail(elementName + " is not displayed");
            return true;
        }
    }

    protected boolean WaitTillElementVisible(WebElement element,int waitTime, String elementName) {
        try {
        	waitForElementToBeInvisible(element,waitTime);
            ExtentLogger.pass(elementName + " is displayed");
            return false;
        } catch (Exception e) {
            //ExtentLogger.fail(elementName + " is not displayed");
            return true;
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
    
    private void waitForElementToBeVisible(WebElement element,int waitTime) {
        WebDriverWait wait = new WebDriverWait(driver, ofSeconds(waitTime));
        wait.until(ExpectedConditions.visibilityOf(element));
    }
    
    private void waitForElementToBeInvisible(WebElement element) {
    	  WebDriverWait wait = new WebDriverWait(driver, ofSeconds(30));
    	  wait.until(ExpectedConditions.invisibilityOf(element));
    	}
    
    private void waitForElementToBeInvisible(WebElement element,int waitTime) {
  	  WebDriverWait wait = new WebDriverWait(driver, ofSeconds(waitTime));
  	  wait.until(ExpectedConditions.invisibilityOf(element));
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
