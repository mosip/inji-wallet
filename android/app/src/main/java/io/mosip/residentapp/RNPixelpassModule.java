package io.mosip.residentapp;

import io.mosip.pixelpass.PixelPass;
import io.mosip.pixelpass.cbor.Utils;
import io.mosip.pixelpass.types.ECC;
import io.mosip.pixelpass.exception.QrDataOverflowException;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class RNPixelpassModule extends ReactContextBaseJavaModule {
    private final PixelPass pixelPass;

    public RNPixelpassModule(ReactApplicationContext reactContext) {
        super(reactContext);
        pixelPass = new PixelPass();
    }

    @Override
    public String getName() {
        return "RNPixelpassModule";
    }

    @ReactMethod
    public void decode(String parameter, Promise promise) {
        try {
            String text = pixelPass.decode(parameter);
            promise.resolve(text);
        } catch (Exception e) {
            promise.reject("ERROR", e.toString());
        }
    }

    @ReactMethod
    public void generateQRData(String data, String header, Promise promise) {
        try {
            String qrData = pixelPass.generateQRData(data, header);
            promise.resolve(qrData);
        } catch (Exception e) {
            promise.reject("ERROR_GENERATING_QR", "Failed to generate QR Data: " + e);
        }
    }

    @ReactMethod
    public void generateQRCodeWithinLimit(int allowedQRDataSizeLimit, String data, String header, Promise promise) {
        try {
            String qrData = pixelPass.generateQRCodeWithinLimit(allowedQRDataSizeLimit, data, ECC.L, header);
            promise.resolve(qrData);
        } catch (QrDataOverflowException e) {
            promise.reject("QR_DATA_OVERFLOW", "QR data exceeds the allowed size limit.");
        } catch (Exception e) {
            promise.reject("ERROR_GENERATING_QR", "Failed to generate QR Data: " + e);
        }
    }


    @ReactMethod
    public void decodeBase64UrlEncodedCBORData(String data, Promise promise) {
        try {
            Object decodedData = pixelPass.toJson(data);
            promise.resolve(decodedData.toString());
        } catch (Exception e) {
            promise.reject("ERROR_DECODING_DATA", "Failed to decode Data: " + e);
        }
    }
}
