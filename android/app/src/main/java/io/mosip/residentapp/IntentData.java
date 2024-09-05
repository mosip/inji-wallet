package io.mosip.residentapp;

public class IntentData {
    private String qrData = "";
    private static final IntentData ourInstance = new IntentData();
    public static IntentData getInstance() {
        return ourInstance;
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