package io.mosip.residentapp;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RNQrLoginIntentModule extends ReactContextBaseJavaModule {


  @Override
  public String getName() {
    return "QrLoginIntent";
  }

  RNQrLoginIntentModule(ReactApplicationContext context) {
    super(context);
  }

  @ReactMethod
  public void isQrLoginByDeepLink(Promise promise) {
    try {

      IntentData intentData = IntentData.getInstance();
      promise.resolve(intentData.getQrData());

    } catch (Exception e) {
      promise.reject("E_UNKNOWN", e.getMessage());
    }
  }

  @ReactMethod
  public void resetQRLoginDeepLinkData(){
    IntentData intentData = IntentData.getInstance();
    intentData.setQrData("");
  }

}