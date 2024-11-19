package inji.utils;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.PerformsTouchActions;
import io.appium.java_client.android.AndroidTouchAction;
import io.appium.java_client.ios.IOSTouchAction;
import io.appium.java_client.touch.LongPressOptions;
import io.appium.java_client.touch.offset.ElementOption;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Action;
import org.openqa.selenium.interactions.Pause;
import org.openqa.selenium.interactions.PointerInput;
import org.openqa.selenium.interactions.Sequence;

import java.time.Duration;
import java.util.Collections;

public class IosUtil {
    public static void scrollToElement(AppiumDriver driver, int startX, int startY, int endX, int endY) {
        PointerInput finger = new PointerInput(PointerInput.Kind.TOUCH, "first finger");
        Sequence sequence = new Sequence(finger, 0)
                .addAction(finger.createPointerMove(Duration.ZERO, PointerInput.Origin.viewport(), startX, startY))
                .addAction(finger.createPointerDown(PointerInput.MouseButton.MIDDLE.asArg()))
                .addAction(finger.createPointerMove(Duration.ofMillis(300), PointerInput.Origin.viewport(), endX, endY))
                .addAction(finger.createPointerUp(PointerInput.MouseButton.MIDDLE.asArg()));

        driver.perform(Collections.singleton(sequence));

    }

    public static void swipeOrScroll(AppiumDriver driver)  {
        Dimension size = driver.manage().window().getSize();
        int startX = 68;
        int startY = 927;
        int endX = startX;
        int endY = 474;
        PointerInput finger1 = new PointerInput(PointerInput.Kind.TOUCH, "finger1");
        Sequence sequence = new Sequence(finger1, 1)
                .addAction(finger1.createPointerMove(Duration.ZERO, PointerInput.Origin.viewport(), startX, startY))
                .addAction(finger1.createPointerDown(PointerInput.MouseButton.LEFT.asArg()))
                .addAction(new Pause(finger1, Duration.ofMillis(200)))
                .addAction(finger1.createPointerMove(Duration.ofMillis(100), PointerInput.Origin.viewport(), endX, endY))
                .addAction(finger1.createPointerUp(PointerInput.MouseButton.LEFT.asArg()));
        driver.perform(Collections.singletonList(sequence));
    }


    public static void dragAndDrop(AppiumDriver driver, WebElement eleToDrag, WebElement eleTODrop) {
        AndroidTouchAction action = new AndroidTouchAction((PerformsTouchActions) driver);
        action.longPress(LongPressOptions.longPressOptions()
                        .withElement(ElementOption.element(eleToDrag)))
                .moveTo(ElementOption.element(eleTODrop))
                .release()
                .perform();

    }

    public static void dragAndDropForIos(AppiumDriver driver, WebElement eleToDrag, WebElement eleTODrop) {
        IOSTouchAction action = new IOSTouchAction((PerformsTouchActions) driver);
        action.longPress(LongPressOptions.longPressOptions()
                        .withElement(ElementOption.element(eleToDrag))
                        .withDuration(Duration.ofSeconds(1)))
                .moveTo(ElementOption.element(eleTODrop))
                .release()
                .perform();
    }






//    public static void dragAndDrop(AppiumDriver driver, WebElement draggableElement, int startX, int startY, int endX, int endY) {
//        PointerInput finger = new PointerInput(PointerInput.Kind.TOUCH, "first finger");
//        Sequence sequence = new Sequence(finger, 0)
//                .addAction(finger.createPointerMove(Duration.ZERO, PointerInput.Origin.viewport(), startX, startY))  // Move to start position
//                .addAction(finger.createPointerDown(Duration.ofMillis(500))) // Long press to initiate drag
//                .addAction(finger.createPointerMove(toPointerLocation(draggableElement)))  // Move to draggable element
//                .addAction(finger.createPointerMove(Duration.ofMillis(100)))  // Slight delay after grabbing element
//                .concat(repeatWhileMoving(finger, endX, endY))  // Loop and move to end position
//                .addAction(finger.createPointerUp());  // Release element at end position
//
//        driver.perform(Collections.singleton(sequence));
//    }
//
//    private static Action repeatWhileMoving(PointerInput finger, int endX, int endY) {
//        CompoundAction action = new CompoundAction();
//        while (true) {
//            action.add(finger.createPointerMove(Duration.ofMillis(50), PointerInput.Origin.pointer(), 10, 10));  // Move slightly during loop
//            if (isElementAtPosition(driver, draggableElement, endX, endY)) {
//                break;
//            }
//        }
//        return action;
//    }

    private static boolean isElementAtPosition(AppiumDriver driver, WebElement element, int x, int y) {
        // Implement logic to check if element is at desired coordinates (x, y) using Appium locators
        // You can use element.getLocation() and compare with (x, y)
        // This is a placeholder, replace with your actual implementation
        return true; // Replace with actual logic
    }

    public static void tapOnElement(AppiumDriver driver, WebElement element) {
        Point location = element.getLocation();
        Dimension size = element.getSize();

        Point centerOfElement = new Point(location.getX() + size.getWidth() / 2,
                location.getY() + size.getHeight() / 2);

        PointerInput finger = new PointerInput(PointerInput.Kind.TOUCH, "finger1");
        Sequence sequence = new Sequence(finger, 1)
                .addAction(finger.createPointerMove(Duration.ZERO, PointerInput.Origin.viewport(), centerOfElement))
                .addAction(finger.createPointerDown(PointerInput.MouseButton.LEFT.asArg()))
                .addAction(new Pause(finger,Duration.ofMillis(1000)))
                .addAction(finger.createPointerUp(PointerInput.MouseButton.LEFT.asArg()));

        driver.perform(Collections.singleton(sequence));

    }

    public static void enableAirplaneMode(){}

    public static void disableAirplaneMode(){}
}