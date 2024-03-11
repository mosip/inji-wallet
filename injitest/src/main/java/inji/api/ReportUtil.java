package inji.api;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;


public class ReportUtil {

	/**
	 * Publish the request and response headers in text area
	 * @param content
	 * @return test area html
	 */
	public static String getTextAreaForHeaders(String headers) {
		String formattedHeader = "No headers";
		if (headers != null && !headers.isEmpty())
			formattedHeader = headers;
        String sb = "<div> <textarea style='border:solid 1px gray; background-color: lightgray;' name='headers' rows='4' cols='160' readonly='true'>" +
                formattedHeader +
                "</textarea> </div>";
		return sb;
	}

	/**
	 * Method to show the output validation result in table format in testng report
	 * 
	 * @param outputresultRunConfigUtil.getResourcePath()
	 * @return html table
	 */
	public static String getOutputValidationReport(Map<String, List<OutputValidationDto>> outputresult) {
		String htmlforReport = "<table width='90%' charset='UTF8'>\r\n" + "  <tr>\r\n" + "    <th>FieldName</th>\r\n"
				+ "    <th>Expected Value</th> \r\n" + "    <th>Actual Value</th>\r\n" + "    <th>Status</th>\r\n"
				+ "  </tr>\r\n";
		boolean outputValidationDone = false;
		String temp = "";

		for (Entry<String, List<OutputValidationDto>> entry : outputresult.entrySet()) {
			temp = "<b> Output validation for: </b>" + entry.getKey()+ "\r\n";
			for (OutputValidationDto dto : entry.getValue()) {
				if (dto.getStatus().equals("PASS")) {
					htmlforReport = htmlforReport + "  <tr>\r\n" + "    <td>" + dto.getFieldName() + "</td>\r\n"
							+ "    <td>" + dto.getExpValue() + "</td>\r\n" + "    <td>" + dto.getActualValue()
							+ "</td>\r\n" + "    <td bgcolor='Green'>" + dto.getStatus() + "</td>\r\n" + "  </tr>\r\n";
					outputValidationDone = true;
				} else if (dto.getStatus().equals(GlobalConstants.FAIL_STRING)) {
					htmlforReport = htmlforReport + "  <tr>\r\n" + "    <td>" + dto.getFieldName() + "</td>\r\n"
							+ "    <td>" + dto.getExpValue() + "</td>\r\n" + "    <td>" + dto.getActualValue()
							+ "</td>\r\n" + "    <td bgcolor='RED'>" + dto.getStatus() + "</td>\r\n" + "  </tr>\r\n";
					outputValidationDone = true;
				}

			}
		}
		if (!outputValidationDone) {
			return "<b> Marking test case as passed. As Output validation not performed and no errors in the response </b>";
		}

		htmlforReport = temp + htmlforReport + "</table>";
		return htmlforReport;
	}


	/**
	 * Publish the request and response message in text area 
	 * 
	 * @param content
	 * @return test area html
	 */
	public static String getTextAreaJsonMsgHtml(String content) {
		StringBuilder sb = new StringBuilder();
		sb.append("<div> <textarea style='border:solid 1px white;' name='message' rows='10' cols='160' readonly='true'>");
		try {
			sb.append(JsonPrecondtion.toPrettyFormat(content));
		} catch (Exception e) {
			sb.append(content);
		}
		sb.append("</textarea> </div>");
		return sb.toString();
	}




}
