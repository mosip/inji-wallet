package inji.utils;


import org.testng.TestListenerAdapter;

import java.io.File;


public class UinGenerationUtil {
    public static String jarUrl = UinGenerationUtil.class.getProtectionDomain().getCodeSource().getLocation().getPath();

    static TestListenerAdapter tla = new TestListenerAdapter();

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
        if (UinGenerationUtil.class.getResource("TestRunner.class").getPath().toString().contains(".jar"))
            return "JAR";
        return "IDE";
    }
    public static String GetKernalFilename() {
        String path ="Kernel.properties" ;
        String kernalpath = null;
        if (System.getProperty("env.user") == null) {
            kernalpath = "Kernel.properties";
        } else {
            kernalpath = "Kernel_" + path + ".properties";
        }
        return path;
    }
}