package io.mosip.residentapp;

public class IntentData {
    private String qrData = "";
    private String ovpQrData = "";

    private static IntentData intentData;
    public static IntentData getInstance() {
        if(intentData == null)
            intentData = new IntentData();
        return intentData;
    }
    public String getQrData() {
        return qrData;
    }

    public void setQrData(String qrData) {
        this.qrData = qrData;
    }

    public String getOVPQrData() {
        return ovpQrData;
    }

    public void setOVPQrData(String ovpQrData) {
        this.ovpQrData = ovpQrData;
    }

    public String getDataByFlow(String flowType) {
        if (flowType == null) return "";
        return switch (flowType) {
            case "qrLoginFlow" -> getQrData();
            case "ovpFlow" -> getOVPQrData();
            default -> "";
        };
    }

    public void resetDataByFlow(String flowType) {
        if (flowType == null) return;
        switch (flowType) {
            case "qrLoginFlow" -> setQrData("");
            case "ovpFlow" -> setOVPQrData("");
        }
    }
}
