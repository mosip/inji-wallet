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
        System.out.println("Test Suite Finished!");

        for (ISuiteResult result : suite.getResults().values()) {
            ITestContext context = result.getTestContext();

            System.out.println("Failed Test Cases for Context: " + context.getName());

            Iterator<ITestResult> failedTests = context.getFailedTests().getAllResults().iterator();
            while (failedTests.hasNext()) {
                ITestResult failedTest = failedTests.next();
                ITestNGMethod method = failedTest.getMethod();

                System.out.println("  - Failed Test: " + failedTest.getName());
                System.out.println("    - Failed Method: " + method.getQualifiedName());

                failedTestMethods.add(method);
            }
        }

        if (!failedTestMethods.isEmpty()) {
            System.out.println("Rerunning failed test cases...");

            TestNG rerunTestNG = new TestNG();
            XmlSuite xmlSuite = new XmlSuite();
            XmlTest xmlTest = new XmlTest(xmlSuite);
            List<XmlClass> xmlClasses = new ArrayList<>();

            for (ITestNGMethod method : failedTestMethods) {
                XmlClass xmlClass = new XmlClass(method.getRealClass().getName());
                xmlClass.getIncludedMethods().add(new XmlInclude(method.getMethodName()));
                xmlClasses.add(xmlClass);
            }

            xmlTest.setXmlClasses(xmlClasses);
            rerunTestNG.setXmlSuites(Collections.singletonList(xmlSuite));
            rerunTestNG.run();
        }
    }
}
