package inji.api;

import io.restassured.response.Response;
import org.testng.Reporter;
public class GlobalMethods {

	public static void reportResponse(String responseHeader, String url, Response response) {
		String formattedHeader = ReportUtil.getTextAreaForHeaders(responseHeader);

		Reporter.log(GlobalConstants.REPORT_RESPONSE_PREFIX + url + GlobalConstants.REPORT_RESPONSE_BODY + formattedHeader
				+ ReportUtil.getTextAreaJsonMsgHtml(response.asString()) + GlobalConstants.REPORT_RESPONSE_SUFFIX);
	}

	public static void reportResponse(String responseHeader, String url, String response) {
		reportResponse(responseHeader, url, response, false);
	}

	public static void reportResponse(String responseHeader, String url, String response, boolean formatResponse) {
		String formattedHeader = ReportUtil.getTextAreaForHeaders(responseHeader);

		if (formatResponse)
			Reporter.log(GlobalConstants.REPORT_RESPONSE_PREFIX + url + GlobalConstants.REPORT_RESPONSE_BODY + formattedHeader
					+ ReportUtil.getTextAreaJsonMsgHtml(response) + GlobalConstants.REPORT_RESPONSE_SUFFIX);
		else
			Reporter.log(GlobalConstants.REPORT_RESPONSE_PREFIX + url + GlobalConstants.REPORT_RESPONSE_BODY + responseHeader + response
					+ GlobalConstants.REPORT_RESPONSE_SUFFIX);
	}


}
