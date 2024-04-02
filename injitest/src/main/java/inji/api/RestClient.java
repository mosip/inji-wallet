package inji.api;

import io.restassured.RestAssured;
import io.restassured.config.HttpClientConfig;
import io.restassured.config.RestAssuredConfig;
import io.restassured.response.Response;
import org.testng.log4testng.Logger;

import static io.restassured.RestAssured.given;

public class RestClient {

	private static final Logger RESTCLIENT_LOGGER = Logger.getLogger(RestClient.class);
	private static final RestAssuredConfig config = RestAssured.config()
			.httpClient(HttpClientConfig.httpClientConfig().setParam("http.connection.timeout", 500000)
					.setParam("http.socket.timeout", 500000).setParam("http.connection-manager.timeout", 500000));




	public static Response getRequest(String url, String contentHeader, String acceptHeader) {
		RESTCLIENT_LOGGER.info("RESSURED: Sending a GET request to " + url);
		Response getResponse = given().config(config).relaxedHTTPSValidation().log().all().when().get(url).then().log()
				.all().extract().response();
		RESTCLIENT_LOGGER.info("REST-ASSURED: The response from the request is: " + getResponse.asString());
		RESTCLIENT_LOGGER.info("REST-ASSURED: The response Time is: " + getResponse.time());
		return getResponse;
	}

	public static Response getRequestWithCookie(String url, String contentHeader, String acceptHeader,
			String cookieName, String cookieValue) {
		RESTCLIENT_LOGGER.info("REST-ASSURED: Sending a GET request to " + url);
		Response getResponse = given().config(config).relaxedHTTPSValidation().cookie(cookieName, cookieValue).log()
				.all().when().get(url).then().log().all().extract().response();
		RESTCLIENT_LOGGER.info("REST-ASSURED: The response from the request is: " + getResponse.asString());
		RESTCLIENT_LOGGER.info("REST-ASSURED: The response Time is: " + getResponse.time());
		return getResponse;
	}

	public static Response postRequestWithCookie(String url, Object body, String contentHeader, String acceptHeader,
			String cookieName, String cookieValue) {
		RESTCLIENT_LOGGER.info("REST-ASSURED: Sending a POST request to " + url);
		Response postResponse = given().config(config).relaxedHTTPSValidation().body(body).contentType(contentHeader)
				.cookie(cookieName, cookieValue).accept(acceptHeader).log().all().when().post(url).then().log().all()
				.extract().response();
		RESTCLIENT_LOGGER.info("REST-ASSURED: The response from the request is: " + postResponse.asString());
		RESTCLIENT_LOGGER.info("REST-ASSURED: The response Time is: " + postResponse.time());
		return postResponse;
	}
}