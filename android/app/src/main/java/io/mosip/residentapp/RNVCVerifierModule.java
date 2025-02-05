package io.mosip.residentapp;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;

import io.mosip.vercred.vcverifier.CredentialsVerifier;
import io.mosip.vercred.vcverifier.constants.CredentialFormat;
import io.mosip.vercred.vcverifier.data.VerificationResult;

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
    public void verifyCredentials(String vc, String format, Promise promise) {

        VerificationResult result = credentialsVerifier.verify(vc, CredentialFormat.Companion.fromValue(format));
        WritableMap response = Arguments.createMap();
        response.putBoolean("verificationStatus", result.getVerificationStatus());
        response.putString("verificationMessage", result.getVerificationMessage());
        response.putString("verificationErrorCode", result.getVerificationErrorCode());

        promise.resolve(response);
    }
}