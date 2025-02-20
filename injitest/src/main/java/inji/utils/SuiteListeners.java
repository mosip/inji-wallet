package inji.utils;

import org.testng.ISuite;
import org.testng.ISuiteListener;

public interface SuiteListeners extends ISuiteListener {

    void onTestFailure(ISuite suite);
}
