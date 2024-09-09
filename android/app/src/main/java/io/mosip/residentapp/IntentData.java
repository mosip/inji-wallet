package io.mosip.residentapp;

public class IntentData {
    private String qrData = "";
    private static final IntentData intentData = new IntentData();
    public static IntentData getInstance() {
        return intentData;
    }
    private IntentData() {
    }
    public String getQrData() {
        return qrData;
    }

    public void setQrData(String qrData) {
        this.qrData = qrData;
    }

}