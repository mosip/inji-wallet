package io.mosip.residentapp;

public class IntentData {
    private String qrData = "";
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

}