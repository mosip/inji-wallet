package io.mosip.residentapp;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableMap;
import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import io.mosip.openID4VP.OpenID4VP;
import io.mosip.openID4VP.authorizationRequest.AuthorizationRequest;
import io.mosip.openID4VP.common.FormatType;
import io.mosip.openID4VP.dto.VPResponseMetadata.types.LdpVPResponseMetadata;
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
                .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
                .disableHtmlEscaping()
                .create();
    }

    @ReactMethod
    public void authenticateVerifier(String encodedAuthorizationRequest, ReadableArray trustedVerifiers,
                                     Boolean shouldValidateClient,
                                     Promise promise) {
    public void authenticateVerifier(String urlEncodedAuthorizationRequest, ReadableArray trustedVerifiers,
            Boolean shouldValidateClient,
            Promise promise) {
        try {
            AuthorizationRequest authenticationResponse = openID4VP.authenticateVerifier(urlEncodedAuthorizationRequest,
                    convertReadableArrayToVerifierArray(trustedVerifiers), shouldValidateClient);
            String authenticationResponseAsJson = gson.toJson(authenticationResponse, AuthorizationRequest.class);
            promise.resolve(authenticationResponseAsJson);
        } catch (Exception exception) {
            promise.reject(exception);
        }
    }

    @ReactMethod
    public void constructVerifiablePresentationToken(ReadableMap selectedVCs, Promise promise) {
        try {
            Map<String, Map<String, List<String>>> selectedVCsMap = new HashMap<>();

            ReadableMapKeySetIterator iterator = selectedVCs.keySetIterator();
            while (iterator.hasNextKey()) {
                String inputDescriptorId = iterator.nextKey();
                ReadableMap matchingVcsOfDifferentFormats = selectedVCs.getMap(inputDescriptorId);

                ReadableMapKeySetIterator matchingVcsIterator = Objects.requireNonNull(matchingVcsOfDifferentFormats).keySetIterator();

                Map<String, List<String>> formattedMatchingVcsOfDifferentFormats = new HashMap<>();
                while (matchingVcsIterator.hasNextKey()) {
                    String credentialFormat = matchingVcsIterator.nextKey();
                    List<String> matchingVcsOfSpecificCredentialFormat = convertReadableArrayToList(Objects.requireNonNull(matchingVcsOfDifferentFormats.getArray(credentialFormat)));
                    formattedMatchingVcsOfDifferentFormats.put(credentialFormat, matchingVcsOfSpecificCredentialFormat);
                }
                selectedVCsMap.put(inputDescriptorId, formattedMatchingVcsOfDifferentFormats);
            }
            Map<String, String> vpToken = openID4VP.constructVerifiablePresentationToken(selectedVCsMap);
            WritableMap vpTokenWritableMap = vpToken.entrySet().stream()
                    .collect(Arguments::createMap, (map, entry) -> map.putString(entry.getKey(), entry.getValue()), (m1, m2) -> {});

            promise.resolve(vpTokenWritableMap);
        } catch (Exception exception) {
            promise.reject(exception);
        }

    }

    @ReactMethod
    public void shareVerifiablePresentation(ReadableMap vpResponseMetadata, Promise promise) {
        try {
            Map<String, io.mosip.openID4VP.dto.VPResponseMetadata.VPResponseMetadata> vpResMetadata = getVPResponseMetadata(vpResponseMetadata);
            String response = openID4VP.shareVerifiablePresentation(vpResMetadata);
            promise.resolve(response);
        } catch (Exception exception) {
            promise.reject(exception);
        }
    }

    @ReactMethod
    public void sendErrorToVerifier(String errorMessage) {
        openID4VP.sendErrorToVerifier(new Exception(errorMessage));
    }

    private Map<String, io.mosip.openID4VP.dto.VPResponseMetadata.VPResponseMetadata> getVPResponseMetadata(ReadableMap vpResponsesMetadata) throws IllegalArgumentException {
        ReadableMapKeySetIterator vpResponseMetadataEntryIterator = vpResponsesMetadata.keySetIterator();
        Map<String, io.mosip.openID4VP.dto.VPResponseMetadata.VPResponseMetadata> formattedVpResponsesMetadata = new HashMap<>();
        while (vpResponseMetadataEntryIterator.hasNextKey()) {
            String credentialFormat = vpResponseMetadataEntryIterator.nextKey();
            ReadableMap responseMetadataMap = vpResponsesMetadata.getMap(credentialFormat);
            if (credentialFormat.equals(FormatType.ldp_vc.getValue())) {
                String jws = responseMetadataMap.getString("jws");
                String signatureAlgorithm = responseMetadataMap.getString("signatureAlgorithm");
                String publicKey = responseMetadataMap.getString("publicKey");
                String domain = responseMetadataMap.getString("domain");
                LdpVPResponseMetadata ldpVPResponseMetadata = new LdpVPResponseMetadata(Objects.requireNonNull(jws), Objects.requireNonNull(signatureAlgorithm), Objects.requireNonNull(publicKey), Objects.requireNonNull(domain));
                formattedVpResponsesMetadata.put(credentialFormat, ldpVPResponseMetadata);
            }
        }

        return formattedVpResponsesMetadata;
    }

    private List<String> convertReadableArrayToList(ReadableArray readableArray) {
        List<String> convertedList = new ArrayList<>();
        for (int i = 0; i < readableArray.size(); i++) {
            convertedList.add(readableArray.getString(i));
        }
        return convertedList;
    }

    public List<Verifier> convertReadableArrayToVerifierArray(ReadableArray readableArray) {
        List<Verifier> trustedVerifiersList = new ArrayList<>();
        for (int i = 0; i < readableArray.size(); i++) {
            ReadableMap verifierMap = readableArray.getMap(i);
            String clientId = verifierMap.getString("client_id");
            ReadableArray responseUris = verifierMap.getArray("response_uris");
            List<String> responseUriList = new ArrayList<>();
            for (int j = 0; j < responseUris.size(); j++) {
                responseUriList.add(responseUris.getString(j));
            }
            trustedVerifiersList.add(new Verifier(clientId, responseUriList));
        }
        return trustedVerifiersList;
    }
}
