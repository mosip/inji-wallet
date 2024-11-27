package inji.utils;

import org.testng.*;
import org.testng.xml.XmlClass;
import org.testng.xml.XmlInclude;
import org.testng.xml.XmlSuite;
import org.testng.xml.XmlTest;

import java.util.*;

public class SuiteListener implements ISuiteListener {

    private List<ITestNGMethod> failedTestMethods = new ArrayList<>();

    @Override
    public void onStart(ISuite suite) {
        // No action needed for `onStart` in this case
    }

    @Override
    public void onFinish(ISuite suite) {
        if (suite.getName().equalsIgnoreCase("androidSanity")|| suite.getName().equalsIgnoreCase("iosSanity")) {
            boolean hasFailures = suite.getResults().values().stream()
                    .anyMatch(result -> result.getTestContext().getFailedTests().size() > 0);

            // Dynamically skip androidRegression if there are failures
            if (hasFailures) {
               System.exit(1);
                System.out.println("Sanity suite has failures. Skipping Regression suite.");
            } else {
                System.out.println("Sanity suite passed. Proceeding with Regression suite.");
            }
        }
    }
}
