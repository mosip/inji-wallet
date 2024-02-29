package inji.utils;


public class UinGenerationUtil {

    public static String getResourcePath() {
//        if (checkRunType().equalsIgnoreCase("JAR"))
//            return (new File(jarUrl)).getParentFile().getAbsolutePath() + "/resources/";
//        if (checkRunType().equalsIgnoreCase("IDE")) {
//            String path = System.getProperty("user.dir") + "/src/main/resources";
//            if (path.contains("test-classes"))
//                path = path.replace("test-classes", "classes");
//            return path;
//        }
        return System.getProperty("user.dir") + "/src/main/resources";
    }

    public static String checkRunType() {
//        if (UinGenerationUtil.class.getResource("TestRunner.class").getPath().contains(".jar"))
//            return "JAR";
        return "IDE";
    }
    public static String getKernalFilename() {
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