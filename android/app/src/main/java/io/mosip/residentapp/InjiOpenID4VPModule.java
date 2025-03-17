package io.mosip.residentapp;

import static io.mosip.openID4VP.authorizationResponse.models.vpTokenForSigning.VPTokensForSigningKt.toJsonString;

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
import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import io.mosip.openID4VP.OpenID4VP;
import io.mosip.openID4VP.authorizationRequest.AuthorizationRequest;
import io.mosip.openID4VP.authorizationResponse.models.vpTokenForSigning.VPTokenForSigning;
import io.mosip.openID4VP.constants.FormatType;
import io.mosip.openID4VP.dto.Verifier;
import io.mosip.openID4VP.dto.vpResponseMetadata.VPResponseMetadata;
import io.mosip.openID4VP.dto.vpResponseMetadata.types.LdpVPResponseMetadata;

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
            Map<String, Map<FormatType, List<String>>> selectedVCsMap = new HashMap<>();

            ReadableMapKeySetIterator iterator = selectedVCs.keySetIterator();
            while (iterator.hasNextKey()) {
                String inputDescriptorId = iterator.nextKey();
                ReadableMap matchingVcsOfDifferentFormats = selectedVCs.getMap(inputDescriptorId);

                ReadableMapKeySetIterator matchingVcsIterator = Objects.requireNonNull(matchingVcsOfDifferentFormats).keySetIterator();

                Map<FormatType, List<String>> formattedMatchingVcsOfDifferentFormats = new EnumMap<>(FormatType.class);
                while (matchingVcsIterator.hasNextKey()) {
                    String credentialFormat = matchingVcsIterator.nextKey();
                    List<String> matchingVcsOfSpecificCredentialFormat = convertReadableArrayToList(Objects.requireNonNull(matchingVcsOfDifferentFormats.getArray(credentialFormat)));
                    if(credentialFormat.equals(FormatType.LDP_VC.getValue()))
                     formattedMatchingVcsOfDifferentFormats.put(FormatType.LDP_VC, matchingVcsOfSpecificCredentialFormat);
                    else
                        throw new UnsupportedOperationException("Credential format - "+credentialFormat+" is not supported");
                }
                selectedVCsMap.put(inputDescriptorId, formattedMatchingVcsOfDifferentFormats);
            }
            Map<FormatType,VPTokenForSigning> vpTokens = openID4VP.constructVerifiablePresentationToken(selectedVCsMap);

            promise.resolve(toJsonString(vpTokens));
        } catch (Exception exception) {
            promise.reject(exception);
        }

    }

    @ReactMethod
    public void shareVerifiablePresentation(ReadableMap vpResponseMetadata, Promise promise) {
        try {
            Map<FormatType, VPResponseMetadata> vpResMetadata = getVPResponseMetadata(vpResponseMetadata);
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

    private Map<FormatType, VPResponseMetadata> getVPResponseMetadata(ReadableMap vpResponsesMetadata) throws IllegalArgumentException {
        ReadableMapKeySetIterator vpResponseMetadataEntryIterator = vpResponsesMetadata.keySetIterator();
        Map<FormatType, VPResponseMetadata> formattedVpResponsesMetadata = new EnumMap<>(FormatType.class);
        while (vpResponseMetadataEntryIterator.hasNextKey()) {
            String credentialFormat = vpResponseMetadataEntryIterator.nextKey();
            ReadableMap responseMetadataMap = vpResponsesMetadata.getMap(credentialFormat);
            if (credentialFormat.equals(FormatType.LDP_VC.getValue())) {
                String jws = responseMetadataMap.getString("jws");
                String signatureAlgorithm = responseMetadataMap.getString("signatureAlgorithm");
                String publicKey = responseMetadataMap.getString("publicKey");
                String domain = responseMetadataMap.getString("domain");
                LdpVPResponseMetadata ldpVPResponseMetadata = new LdpVPResponseMetadata(Objects.requireNonNull(jws), Objects.requireNonNull(signatureAlgorithm), Objects.requireNonNull(publicKey), Objects.requireNonNull(domain));
                formattedVpResponsesMetadata.put(FormatType.LDP_VC, ldpVPResponseMetadata);
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
