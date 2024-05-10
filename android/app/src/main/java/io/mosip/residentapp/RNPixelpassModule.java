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
            ECC eccEnum = ECC.valueOf("L"); 
            Bitmap qrCodeBitmap = pixelPass.generateQRCode(data,eccEnum,header);
            String base64QRCode = bitmapToBase64(qrCodeBitmap);
            promise.resolve(base64QRCode);
        } catch (Exception e) {
            promise.reject("ERROR_GENERATING_QR", "Failed to generate QR Code: " + e.toString());
        }
    }
    
    private String bitmapToBase64(Bitmap bitmap) {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
        byte[] byteArray = byteArrayOutputStream.toByteArray();
        return Base64.encodeToString(byteArray, Base64.NO_PADDING);
    }
}
