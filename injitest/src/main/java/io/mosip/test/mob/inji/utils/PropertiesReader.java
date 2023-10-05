package io.mosip.test.mob.inji.utils;

import java.io.IOException;
import java.io.InputStream;
import java.util.Objects;
import java.util.Properties;

import io.mosip.test.mob.inji.driver.TestRunner;

public class PropertiesReader {
    private static final String PROPERTY_FILE = TestRunner.getResourcePath()+"/config.properties";

    private final Properties props;

    public PropertiesReader() {
        this.props = loadPropertyFile();
    }

    private Properties loadPropertyFile() {
        Properties properties = new Properties();
        try (InputStream stream = Thread.currentThread().getContextClassLoader().getResourceAsStream(PROPERTY_FILE)) {
            if (stream != null) {
                properties.load(stream);
            } else {
                throw new IOException("Property file not found: " + PROPERTY_FILE);
            }
        } catch (IOException e) {
            throw new RuntimeException("Error loading properties file: " + e.getMessage(), e);
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
}
