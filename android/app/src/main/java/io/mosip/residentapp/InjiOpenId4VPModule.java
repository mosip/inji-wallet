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
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import io.mosip.openID4VP.OpenID4VP;
import io.mosip.openID4VP.dto.VPResponseMetadata;
import io.mosip.openID4VP.dto.Verifier;

public class InjiOpenID4VPModule extends ReactContextBaseJavaModule {
    private OpenID4VP openID4VP;
    private Gson gson;

    InjiOpenID4VPModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "InjiOpenID4VP";
    }

    @ReactMethod
    public void init(String appId) {
        Log.d("InjiOpenID4VPModule", "Initializing InjiOpenID4VPModule with " + appId);
        openID4VP = new OpenID4VP(appId);
        gson = new GsonBuilder()
                    .disableHtmlEscaping()
                    .create();
    }

    @ReactMethod
    public void authenticateVerifier(String encodedAuthorizationRequest, ReadableArray trustedVerifiers,
            Promise promise) {
        try {
            Map<String, String> authenticationResponse = openID4VP.authenticateVerifier(encodedAuthorizationRequest,
                    convertReadableArrayToVerifierArray(trustedVerifiers));
            String authenticationResponseAsJson = gson.toJson(authenticationResponse, Map.class);
            promise.resolve(authenticationResponseAsJson);
        } catch (Exception exception) {
            promise.reject(exception);
        }
    }

    @ReactMethod
    public void constructVerifiablePresentationToken(ReadableMap selectedVCs, Promise promise) {
        try {
            Map<String, List<String>> selectedVCsMap = new HashMap<>();

            ReadableMapKeySetIterator iterator = selectedVCs.keySetIterator();
            while (iterator.hasNextKey()) {
                String key = iterator.nextKey();
                ReadableArray valueArray = selectedVCs.getArray(key);

                List<String> valueList = new ArrayList<>();
                for (int i = 0; i < valueArray.size(); i++) {
                    valueList.add(valueArray.getString(i));
                }

                selectedVCsMap.put(key, valueList);
            }
            String vpToken = openID4VP.constructVerifiablePresentationToken(selectedVCsMap);
            promise.resolve(vpToken);
        } catch (Exception exception) {
            promise.reject(exception);
        }

    }

    @ReactMethod
    public void shareVerifiablePresentation(ReadableMap vpResponseMetadata, Promise promise) {
        try {
            VPResponseMetadata vpResMetadata = getVPResponseMetadata(vpResponseMetadata);
            String response = openID4VP.shareVerifiablePresentation(vpResMetadata);
            promise.resolve(response);
        } catch (Exception exception) {
            promise.reject(exception);
        }
    }

    private VPResponseMetadata getVPResponseMetadata(ReadableMap vpResponseMetadata) throws IllegalArgumentException {
        String jws = vpResponseMetadata.getString("jws");
        String signatureAlgorithm = vpResponseMetadata.getString("signatureAlgorithm");
        String publicKey = vpResponseMetadata.getString("publicKey");
        String domain = vpResponseMetadata.getString("domain");

        return new VPResponseMetadata(jws, signatureAlgorithm, publicKey, domain);
    }

    public List<Verifier> convertReadableArrayToVerifierArray(ReadableArray readableArray) {
        List<Verifier> trustedVerifiersList = new ArrayList<>();
        for (int i = 0; i < readableArray.size(); i++) {
            ReadableMap verifierMap = readableArray.getMap(i);
            String clientId = verifierMap.getString("client_id");
            ReadableArray responseUri = verifierMap.getArray("response_uri");
            List<String> responseUriList = new ArrayList<>();
            for (int j = 0; j < responseUri.size(); j++) {
                responseUriList.add(responseUri.getString(j));
            }
            trustedVerifiersList.add(new Verifier(clientId, responseUriList));
        }
        return trustedVerifiersList;
    }
}
