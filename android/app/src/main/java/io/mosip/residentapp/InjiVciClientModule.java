package io.mosip.residentapp;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import io.mosip.vciclient.VCIClient;
import io.mosip.vciclient.dto.IssuerMetaData;
import kotlin.jvm.functions.Function1;


public class InjiVciClientModule extends ReactContextBaseJavaModule {
    private VCIClient vciClient;

    public InjiVciClientModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
    }

    public void init( String appId) {
        vciClient = new VCIClient(appId);
    }

    @ReactMethod
    public void requestCredential(IssuerMetaData issuerMetaData, Function1 signer, String accessToken, String publicKeyPem, Promise promise) {
        try {
            vciClient.requestCredential(issuerMetaData, signer, accessToken, publicKeyPem);
        } catch (Exception exception) {
            promise.reject(exception);
        }
    }

    @NonNull
    @Override
    public String getName() {
        return "RNINJIVCIClient";
    }
}
