package com.reactlibrary;
import io.mosip.pixelpass.PixelPass;
import io.mosip.pixelpass.types.ECC;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import java.io.ByteArrayOutputStream;  
import android.util.Base64;           
import android.graphics.Bitmap;

public class RNPixelpassModule extends ReactContextBaseJavaModule {
     private PixelPass pixelPass;
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
            String qrData=pixelPass.generateQRData(data,header);
            promise.resolve(qrData);
        } catch (Exception e) {
            promise.reject("ERROR_GENERATING_QR", "Failed to generate QR Data: " + e.toString());
        }
    }
}
