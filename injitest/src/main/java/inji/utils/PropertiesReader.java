package inji.utils;

import inji.driver.TestRunner;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Objects;
import java.util.Properties;

public class PropertiesReader {
    private static final String PROPERTY_FILE = System.getProperty("user.dir") + "/src/main/resources/config.properties";

    private final Properties props;

    public PropertiesReader() {
        this.props = loadPropertyFile();
    }

    private Properties loadPropertyFile() {
        Properties properties = new Properties();
        InputStream input = null;
        try {
            input = new FileInputStream(PROPERTY_FILE);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
        try {
            properties.load(input);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return properties;
    }

    private String getProperty(String propertyName) {
        return Objects.requireNonNull(props.getProperty(propertyName), "Property not found: " + propertyName);
    }

    public String getIpAddress() {
        return getProperty("ipAddress");
    }

    public int getPortNumber() {
        return Integer.parseInt(getProperty("port"));
    }

    public String getNodePath() {
        return getProperty("nodePath");
    }

    public String getAppiumServerExecutable() {
        return getProperty("appiumServerExecutable");
    }

    public String getAppiumLogFilePath() {
        return getProperty("appiumLogFilePath");
    }

    public String getAppiumServerStartStatus() {
        return getProperty("startAppiumServer");
    }
    
    public static String getTestData()
	{
		return JsonUtil.readJsonFileText("personaData.json");
	}

}
