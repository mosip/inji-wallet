package extentReports;

public final class ExtentLogger {
    private ExtentLogger() {
    }

    public static void pass(String message) {
        ExtentReport.getExtentTest().pass(message);
    }

    public static void fail(String message) {
        ExtentReport.getExtentTest().fail(message);
    }

    public static void skip(String message) {
        ExtentReport.getExtentTest().skip(message);
    }

}

