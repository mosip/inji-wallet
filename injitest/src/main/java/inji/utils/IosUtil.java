package inji.utils;

import io.appium.java_client.AppiumDriver;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebElement;
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