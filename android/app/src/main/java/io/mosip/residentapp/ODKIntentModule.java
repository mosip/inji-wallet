package io.mosip.residentapp;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

public class ODKIntentModule extends ReactContextBaseJavaModule {

  @Override
  public String getName() {
    return "ODKIntentModule";
  }

  ODKIntentModule(ReactApplicationContext context) {
    super(context);
  }

  @ReactMethod
  public void isRequestIntent(Promise promise) {
    try {
      Activity activity = getCurrentActivity();
      Intent intent = activity.getIntent();
      String action = intent.getAction();
      if (activity == null || intent == null || action == null) {
        promise.resolve(false);
        return;
      }

      promise.resolve(action.equals("io.mosip.residentapp.odk.REQUEST"));

    } catch (Exception e) {
      promise.reject("E_UNKNOWN", e.getMessage());
    }
  }

  @ReactMethod
  public void sendBundleResult(ReadableMap vcData) {
    try {
      Activity activity = getCurrentActivity();
      if (activity == null) {
        throw new Exception("Activity does not exist");
      }

      Intent result = new Intent();
      result.setPackage(activity.getPackageName());

      Bundle vcBundle = new Bundle(Arguments.toBundle(vcData));
      if (vcBundle == null) {
        throw new Exception("Bundle could not be created");
      }

      for (String key : vcBundle.keySet()) {
        result.putExtra(key, vcBundle.getString(key));
      }

      activity.setResult(Activity.RESULT_OK, result);
      activity.finish();
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}