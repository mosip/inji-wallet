package io.mosip.residentapp;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import io.mosip.vercred.vcverifier.CredentialsVerifier;

public class RNVCVerifierModule extends ReactContextBaseJavaModule {
    
    private CredentialsVerifier credentialsVerifier;
    public RNVCVerifierModule(ReactApplicationContext reactContext) {
        super(reactContext);
        credentialsVerifier = new CredentialsVerifier();
    }

    @Override
    public String getName() {
        return "VCVerifierModule";
    }

    @ReactMethod
    public void verifyCredentials(String vc, Promise promise) {
        promise.resolve(credentialsVerifier.verifyCredentials(vc));
    }
}