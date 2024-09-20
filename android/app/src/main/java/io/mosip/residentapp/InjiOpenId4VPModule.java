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

public class InjiOpenId4VPModule extends ReactContextBaseJavaModule {
    private OpenID4VP openID4VP;

    InjiOpenId4VPModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "InjiOpenId4VP";
    }

    @ReactMethod
    public void init(String appId) {
        Log.d("InjiOpenId4VPModule", "Initializing InjiOpenId4VPModule with " + appId);
        openID4VP = new OpenID4VP(appId);
    }

    @ReactMethod
    public void authenticateVerifier(String encodedAuthorizationRequest, ReadableArray trustedVerifiers,
            Promise promise) {
        try {
            Map<String, String> authenticationResponse = openID4VP.authenticateVerifier(encodedAuthorizationRequest,
                    convertReadableArrayToVerifierArray(trustedVerifiers));
            Log.d("authenticationResponse$$ ", authenticationResponse.get("presentation_definition"));
            Gson gson = new GsonBuilder()
                    .disableHtmlEscaping()
                    .create();

            String jsond = gson.toJson(authenticationResponse, Map.class);
            Log.d("json::", jsond);
            promise.resolve(jsond);
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
                System.out.println("key::" + key);
                ReadableArray valueArray = selectedVCs.getArray(key);

                List<String> valueList = new ArrayList<>();
                for (int i = 0; i < valueArray.size(); i++) {
                    System.out.println("value::" + valueArray.getString(i));
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
            VPResponseMetadata vpResMetadata = new VPResponseMetadata(
                    Objects.requireNonNull(vpResponseMetadata.getString("jws")),
                    Objects.requireNonNull(vpResponseMetadata.getString("signatureAlgorithm")),
                    Objects.requireNonNull(vpResponseMetadata.getString("publicKey")),
                    Objects.requireNonNull(vpResponseMetadata.getString("domain")));
            String response = openID4VP.shareVerifiablePresentation(vpResMetadata);
            promise.resolve(response);
        } catch (Exception exception) {
            promise.reject(exception);
        }
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
                System.out.println(responseUriList);
            }
            trustedVerifiersList.add(new Verifier(clientId, responseUriList));
        }
        return trustedVerifiersList;
    }
}
