package utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.IOException;

public class TestDataReader {
    public static String readData(String key) {
        ObjectMapper objectMapper = new ObjectMapper();
        String data = null;
        try {
            JsonNode jsonNode = objectMapper.readTree(new File(System.getProperty("user.dir") + "/src/main/resources/TestData.json"));
            data = jsonNode.get(key).asText();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return data;
    }
}
