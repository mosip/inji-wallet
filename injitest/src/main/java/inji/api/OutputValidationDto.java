package inji.api;

public class OutputValidationDto {


	private String fieldName;
	private String fiedlHierarchy;
	private String actualValue;
	private String expValue;
	private String status;

	/**
	 * The method gets the fieldName of input file (Json or XML)
	 * 
	 * @return String - FiledName of Json or XML Path
	 */
	public String getFieldName() {
		return fieldName;
	}

	/**
	 * The method sets the fieldName of input file (Json or XML)
	 * 
	 * @param fieldName - fieldName of input file (Json or XML) from testdata yml
	 *                  file
	 */
	public void setFieldName(String fieldName) {
		this.fieldName = fieldName;
	}

	/**
	 * The method gets the fieldHierarchy of input file (Json or XML)
	 * 
	 * @return FieldHierarchy - Json or XML Path
	 */
	public String getFieldHierarchy() {
		return fiedlHierarchy;
	}

	/**
	 * The method set the fieldHierarchy of input file (Json or XML)
	 * 
	 * @return FieldHierarchy - Json or XML Path
	 */
	public void setFieldHierarchy(String fiedlHierarchy) {
		this.fiedlHierarchy = fiedlHierarchy;
	}

	/**
	 * The method get the actual fieldName value of output file
	 * 
	 * @return String - actual fieldName value
	 */
	public String getActualValue() {
		return actualValue;
	}

	/**
	 * The method set the actual fieldName value of output file
	 * 
	 * @param String - actual fieldName Value
	 */
	public void setActualValue(String actualValue) {
		this.actualValue = actualValue;
	}

	/**
	 * The method get the expected fieldName value of output file
	 * 
	 * @return String - expected fieldName Value
	 */
	public String getExpValue() {
		return expValue;
	}

	/**
	 * The method set the expected fieldName value of output file
	 * 
	 * @param String - expected fieldName Value
	 */
	public void setExpValue(String expValue) {
		this.expValue = expValue;
	}

	/**
	 * The method get or return status of result (either "PASS" or GlobalConstants.FAIL_STRING)
	 * 
	 * @return String - Either "PASS" or GlobalConstants.FAIL_STRING
	 */
	public String getStatus() {
		return status;
	}

	/**
	 * The method set either "PASS" or GlobalConstants.FAIL_STRING
	 * 
	 * @param status - Either "PASS" or GlobalConstants.FAIL_STRING
	 */
	public void setStatus(String status) {
		this.status = status;
	}




}
