package io.mosip.residentapp;
import io.mosip.pixelpass.PixelPass;
import io.mosip.pixelpass.cbor.Utils;

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
            System.out.println("inside the generateQRData "+data.getClass());
            System.out.println("inside the generateQRData "+data);
            String qrData=pixelPass.generateQRData(data,header);
            System.out.println("success qrdata "+qrData);
            promise.resolve(qrData);
        } catch (Exception e) {
            System.out.println("Error Error "+e);
            promise.reject("ERROR_GENERATING_QR", "Failed to generate QR Data: " + e);
        }
    }

    @ReactMethod
    public void decodeBase64UrlEncodedCBORData(String data, Promise promise) {
        try {
            Object decodedData= new Utils().toJson(data);
            System.out.println("decode success from lib");
            promise.resolve(decodedData.toString());
        } catch (Exception e) {
            promise.reject("ERROR_DECODING_DATA", "Failed to decode Data: " + e);
        }
    }
}
