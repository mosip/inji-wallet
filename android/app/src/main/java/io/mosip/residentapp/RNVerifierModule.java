package io.mosip.residentapp;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import io.mosip.tuvali.verifier.Verifier;

public class RNVerifierModule extends ReactContextBaseJavaModule {

  private static final String NAME = "VerifierModule";
  private final RNEventEmitter eventEmitter;
  private final  Verifier verifier;


    public RNVerifierModule(RNEventEmitter eventEmitter, Verifier verifier, ReactApplicationContext reactContext) {
        super(reactContext);
        this.eventEmitter = eventEmitter;
        this.verifier = verifier;
        verifier.subscribe(event -> eventEmitter.emitEvent(RNEventMapper.toMap(event)));
    }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public String startAdvertisement(String advIdentifier) {
        return verifier.startAdvertisement(advIdentifier);
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public void disconnect() {
        verifier.disconnect();
  }

  @ReactMethod
  public void sendVerificationStatus(int status) {
        verifier.sendVerificationStatus(status);
  }

  @Override
  public String getName() {
        return NAME;
  }
}
