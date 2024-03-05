package inji.utils;
import org.testng.TestListenerAdapter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import java.io.File;
import java.io.IOException;
import java.util.Random;
import java.io.File;

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
        String path = "Kernel.properties";
        String kernalpath = null;
        if (System.getProperty("env.user") == null) {
            kernalpath = "Kernel.properties";
        } else {
            kernalpath = "Kernel_" + path + ".properties";
        }
        return path;
    }

        public static String getRandomUin () {

            return getRandomUinOrVidOrAid("Uins.json");
        }

        public static String getRandomVid () {
            return getRandomUinOrVidOrAid("Vids.json");
        }

        public static String getRandomAidData () {

            return getRandomUinOrVidOrAid("AidData.json");
        }

    public static String getRandomEmails () {
        ObjectMapper mapper = new ObjectMapper();
        ArrayNode arrayNode = null;
        try {
            arrayNode = (ArrayNode) mapper.readTree(new File(System.getProperty("user.dir") + "/src/main/resources/Emails.json"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        Random random = new Random();
        int randomIndex = random.nextInt(arrayNode.size());
        String email = arrayNode.get(randomIndex).asText();
        String emailValue=email.stripLeading().stripTrailing();
        return emailValue;
    }

    public static String getRandomUinOrVidOrAid (String jsonFileName) {
        ObjectMapper mapper = new ObjectMapper();
        ArrayNode arrayNode = null;
        try {
            arrayNode = (ArrayNode) mapper.readTree(new File(System.getProperty("user.dir") + "/src/main/resources/" + jsonFileName));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        Random random = new Random();
        int randomIndex = random.nextInt(arrayNode.size());
        String randomNumber = arrayNode.get(randomIndex).toString();
        return randomNumber;
    }
    }