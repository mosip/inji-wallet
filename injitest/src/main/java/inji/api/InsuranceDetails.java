package inji.api;

public class InsuranceDetails {
    private String policyNumber;
    private String fullName;
    private String insuranceId;

    public InsuranceDetails(String policyNumber, String fullName, String insuranceId) {
        this.policyNumber = policyNumber;
        this.fullName = fullName;
        this.insuranceId = insuranceId;
    }

    // Getters
    public String getPolicyNumber() {
        return policyNumber;
    }

    public String getFullName() {
        return fullName;
    }

    public String getInsuranceId() {
        return insuranceId;
    }

    @Override
    public String toString() {
        return "InsuranceData{" +
               "policyNumber='" + policyNumber + '\'' +
               ", fullName='" + fullName + '\'' +
               ", insuranceId='" + insuranceId + '\'' +
               '}';
    }
}

