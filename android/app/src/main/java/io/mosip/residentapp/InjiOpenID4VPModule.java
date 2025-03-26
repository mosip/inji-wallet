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
import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import io.mosip.openID4VP.OpenID4VP;
import io.mosip.openID4VP.authorizationRequest.AuthorizationRequest;
import io.mosip.openID4VP.authorizationRequest.VPFormatSupported;
import io.mosip.openID4VP.authorizationRequest.WalletMetadata;
import io.mosip.openID4VP.common.ClientIdScheme;
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
                .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
                .disableHtmlEscaping()
                .create();
    }

    @ReactMethod
    public void authenticateVerifier(String urlEncodedAuthorizationRequest, ReadableArray trustedVerifiers,
                                     ReadableMap walletMetadata, Boolean shouldValidateClient, Promise promise) {
        try {
            WalletMetadata walletMetadataObj = getWalletMetadataFromReadableMap(walletMetadata);
            AuthorizationRequest authenticationResponse = openID4VP.authenticateVerifier(urlEncodedAuthorizationRequest,
                    convertReadableArrayToVerifierArray(trustedVerifiers),walletMetadataObj, shouldValidateClient);
            String authenticationResponseAsJson = gson.toJson(authenticationResponse, AuthorizationRequest.class);
            promise.resolve(authenticationResponseAsJson);
        } catch (Exception exception) {
            promise.reject(exception);
        }
    }

    private WalletMetadata getWalletMetadataFromReadableMap(ReadableMap walletMetadata) {
        Map<String, VPFormatSupported> vpFormatsSupportedMap = new HashMap<>();
        ReadableMap vpFormatsMap = walletMetadata.getMap("vp_formats_supported");

        if (vpFormatsMap != null && vpFormatsMap.hasKey("ldp_vc")) {
            ReadableMap ldpVc = vpFormatsMap.getMap("ldp_vc");
            if (ldpVc != null && ldpVc.hasKey("alg_values_supported")) {
                ReadableArray ldpVcAlgArray = ldpVc.getArray("alg_values_supported");
                List<String> algValuesList = new ArrayList<>(ldpVcAlgArray.size());

                for (int i = 0; i < ldpVcAlgArray.size(); i++) {
                    algValuesList.add(ldpVcAlgArray.getString(i));
                }

                vpFormatsSupportedMap.put("ldp_vc", new VPFormatSupported(algValuesList));
            }
        }

        List<String> clientIdSchemes = Optional.ofNullable(walletMetadata.getArray("client_id_schemes_supported"))
                .map(this::convertReadableArrayToStringList)
                .filter(list -> !list.isEmpty())
                .orElse(List.of(ClientIdScheme.PRE_REGISTERED.getValue()));

        return new WalletMetadata(
                walletMetadata.getBoolean("presentation_definition_uri_supported"),
                vpFormatsSupportedMap,
                clientIdSchemes,
                extractStringListOrNull(walletMetadata, "request_object_signing_alg_values_supported"),
                extractStringListOrNull(walletMetadata, "authorization_encryption_alg_values_supported"),
                extractStringListOrNull(walletMetadata, "authorization_encryption_enc_values_supported")
        );
    }

    private List<String> convertReadableArrayToStringList(ReadableArray array) {
        List<String> stringList = new ArrayList<>(array.size());
        for (int i = 0; i < array.size(); i++) {
            stringList.add(array.getString(i));
        }
        return stringList;
    }

    private List<String> extractStringListOrNull(ReadableMap readableMap, String key) {
        return Optional.ofNullable(readableMap.getArray(key))
                .map(this::convertReadableArrayToStringList)
                .filter(list -> !list.isEmpty())
                .orElse(null);
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

    @ReactMethod
    public void sendErrorToVerifier(String errorMessage) {
        openID4VP.sendErrorToVerifier(new Exception(errorMessage));
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
