package inji.extentReports;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import com.aventstack.extentreports.reporter.configuration.Theme;

public final class ExtentReport {

    private ExtentReport() {
    }

    private static ExtentReports extentReports;
    private static final ThreadLocal<ExtentTest> extentTestThreadLocal = new ThreadLocal<>();


    public static void initReport() {
        extentReports = new ExtentReports();
        ExtentSparkReporter extentSparkReporter = new ExtentSparkReporter("report/index.html");
        extentSparkReporter.config().setTheme(Theme.DARK);
        extentSparkReporter.config().setReportName("Inji Mobile Automation Report");
        extentReports.attachReporter(extentSparkReporter);
    }

    public static void flushReports() {
        extentReports.flush();
    }

    public static void createTest(String testCaseName) {
        extentTestThreadLocal.set(extentReports.createTest(testCaseName));
    }

    static ExtentTest getExtentTest() {
        return extentTestThreadLocal.get();
    }

}
