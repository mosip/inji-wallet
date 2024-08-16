package io.mosip.residentapp;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import io.mosip.vciclient.VCIClient;
import io.mosip.vciclient.constants.CredentialFormat;
import io.mosip.vciclient.credentialResponse.CredentialResponse;
import io.mosip.vciclient.dto.IssuerMetaData;
import io.mosip.vciclient.proof.jwt.JWTProof;


public class InjiVciClientModule extends ReactContextBaseJavaModule {
    private VCIClient vciClient;

    public InjiVciClientModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void init(String appId) {
        Log.d("InjiVciClientModule", "Initializing InjiVciClientModule with " + appId);
        vciClient = new VCIClient(appId);
    }

    @NonNull
    @Override
    public String getName() {
        return "InjiVciClient";
    }

    @ReactMethod
    public void requestCredential(ReadableMap issuerMetaData, String jwtProofValue, String accessToken, Promise promise) {
        try {
            CredentialFormat credentialFormat;
            IssuerMetaData issuerMetaData1 ;
            switch (issuerMetaData.getString("credentialFormat")) {
                case "ldp_vc":
                    credentialFormat = CredentialFormat.LDP_VC;
                    issuerMetaData1 =  new IssuerMetaData(
                            issuerMetaData.getString("credentialAudience"),
                            issuerMetaData.getString("credentialEndpoint"),
                            issuerMetaData.getInt("downloadTimeoutInMilliSeconds"),
                            convertReadableArrayToStringArray(issuerMetaData.getArray("credentialType")),
                            credentialFormat,null,null);
                    break;
                case "mso_mdoc":
                    credentialFormat = CredentialFormat.MSO_MDOC;
                    issuerMetaData1 =  new IssuerMetaData(
                            issuerMetaData.getString("credentialAudience"),
                            issuerMetaData.getString("credentialEndpoint"),
                            issuerMetaData.getInt("downloadTimeoutInMilliSeconds"),
                            null,
                            credentialFormat, issuerMetaData.getString("doctype"),
                            issuerMetaData.getMap("claims").toHashMap());
                    break;

                default:
                    throw new IllegalStateException("Unexpected value: " + issuerMetaData.getString("credentialFormat"));
            }

            CredentialResponse response = vciClient.requestCredential(issuerMetaData1, new JWTProof(jwtProofValue)
                    , accessToken);
            promise.resolve(response.toJsonString());
        } catch (Exception exception) {
            promise.reject(exception);
        }
    }

    private String[] convertReadableArrayToStringArray(ReadableArray readableArray) {
        String[] stringArray = new String[readableArray.size()];
        for (int i = 0; i < readableArray.size(); i++) {
            stringArray[i] = readableArray.getString(i);
        }
        return stringArray;
    }
}
