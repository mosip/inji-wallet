package io.mosip.test.mob.inji.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.mosip.test.mob.inji.driver.TestRunner;

import java.io.File;
import java.io.IOException;

public class TestDataReader {
    public static String readData(String key) {
        ObjectMapper objectMapper = new ObjectMapper();
        String data = null;
        try {
            JsonNode jsonNode = objectMapper.readTree(
            		new File(TestRunner.getResourcePath()+"/TestData.json"));
            data = jsonNode.get(key).asText();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return data;
    }
}
