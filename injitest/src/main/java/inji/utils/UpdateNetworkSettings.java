package inji.utils;

import io.restassured.RestAssured;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;

import java.io.IOException;

public class UpdateNetworkSettings {



    public UpdateNetworkSettings() throws IOException {
    }
    static String userName;

    static {
        try {
            userName = UinGenerationUtil.getKeyValueFromYaml("/androidConfig.yml","userName");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    static String accessKey;

    static {
        try {
            accessKey = UinGenerationUtil.getKeyValueFromYaml("/androidConfig.yml","accessKey");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static void setNoNetworkProfile(String sessionID) {
        String baseURL = "https://api-cloud.browserstack.com";
        String endpoint = "/app-automate/sessions/" + sessionID + "/update_network.json";

        String networkSettingsJson = "{\"networkProfile\":\"no-network\"}";
        RequestSpecification requestSpec = RestAssured.given()
                .auth().basic(userName, accessKey)
                .header("Content-Type", "application/json")
                .body(networkSettingsJson);
        Response response = requestSpec.put(baseURL + endpoint);
    }

    public static void resetNetworkProfile(String sessionID) {
        String baseURL = "https://api-cloud.browserstack.com";
        String endpoint = "/app-automate/sessions/" + sessionID + "/update_network.json";

        String networkSettingsJson = "{\"networkProfile\":\"reset\"}";

        RequestSpecification requestSpec = RestAssured.given()
                .auth().basic(userName, accessKey)
                .header("Content-Type", "application/json")
                .body(networkSettingsJson);

        Response response = requestSpec.put(baseURL + endpoint);
    }
}
