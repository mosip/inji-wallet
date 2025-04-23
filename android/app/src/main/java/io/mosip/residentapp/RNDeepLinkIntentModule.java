package io.mosip.residentapp;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RNDeepLinkIntentModule extends ReactContextBaseJavaModule {


  @Override
  public String getName() {
    return "DeepLinkIntent";
  }

  RNDeepLinkIntentModule(ReactApplicationContext context) {
    super(context);
  }

  @ReactMethod
  public void getDeepLinkIntentData(String flowType, Promise promise) {
    try {
      IntentData intentData = IntentData.getInstance();
      String result = intentData.getDataByFlow(flowType);
      promise.resolve(result);

    } catch (Exception e) {
      promise.reject("E_UNKNOWN", e.getMessage());
    }
  }

  @ReactMethod
  public void resetDeepLinkIntentData(String flowType) {
      IntentData intentData = IntentData.getInstance();
      intentData.resetDataByFlow(flowType);
  }

}

