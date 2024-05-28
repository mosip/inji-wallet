package inji.api;

import io.restassured.response.Response;

import javax.ws.rs.core.MediaType;

public class ApplicationLibrary extends BaseTestCase {

	private static final CommonLibrary commonLibrary = new CommonLibrary();


	// get requests
	public Response getWithoutParams(String endpoint, String cookie) {
		return commonLibrary.getWithoutParams(ApplnURI + endpoint, cookie);
	}

	public Response postWithJson(String endpoint, Object body) {
		return commonLibrary.postWithJson(ApplnURI + endpoint, body, MediaType.APPLICATION_JSON,
				MediaType.APPLICATION_JSON);
	}
}