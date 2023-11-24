package io.mosip.test.mob.inji.driver;


import io.mosip.test.mob.inji.api.BaseTestCase;
import org.testng.TestListenerAdapter;
import org.testng.TestNG;

import java.io.File;
import java.util.ArrayList;
import java.util.List;


public class TestRunner {
    public static String jarUrl = TestRunner.class.getProtectionDomain().getCodeSource().getLocation().getPath();

    static TestListenerAdapter tla = new TestListenerAdapter();


    public static void main(String[] args) throws Exception {
        BaseTestCase.intiateUINGenration();

        startTestRunner();
    }

    public static String getResourcePath() {
        if (checkRunType().equalsIgnoreCase("JAR"))
            return (new File(jarUrl)).getParentFile().getAbsolutePath().toString() + "/resources/";
        if (checkRunType().equalsIgnoreCase("IDE")) {
            String path = System.getProperty("user.dir") + "/src/main/resources";
            if (path.contains("test-classes"))
                path = path.replace("test-classes", "classes");
            return path;
        }
        return "Global Resource File Path Not Found";
    }

    public static String checkRunType() {
        if (TestRunner.class.getResource("TestRunner.class").getPath().toString().contains(".jar"))
            return "JAR";
        return "IDE";
    }

    public static void startTestRunner() {
        File homeDir = null;
        TestNG runner = new TestNG();
        List<String> suitefiles = new ArrayList<>();
        String os = System.getProperty("os.name");
        homeDir = new File(System.getProperty("user.dir") + "/testng.xml");
        suitefiles.add(homeDir.getAbsolutePath());
        runner.setTestSuites(suitefiles);
        System.getProperties().setProperty("testng.outpur.dir", "testng-report");
        runner.setOutputDirectory("testng-report");
        runner.run();
    }

    public static String GetKernalFilename() {
        String path = System.getProperty("env.user");
        String kernalpath = null;
        if (System.getProperty("env.user") == null) {
            kernalpath = "Kernel.properties";

        } else {
            kernalpath = "Kernel_" + path + ".properties";
        }
        return kernalpath;
    }
}