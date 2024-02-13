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
        Activity activity = getCurrentActivity();
        Intent intent = activity.getIntent();

        String action = intent.getAction();
        if (action == "io.mosip.residentapp.odk.REQUEST") {
            promise.resolve(true);
        } else {
            promise.resolve(false);
        }
    }

    @ReactMethod
    public void sendBundleResult(ReadableMap vcData) {
        Activity activity = getCurrentActivity();

        Intent result = new Intent();
        Bundle vcBundle = new Bundle(Arguments.toBundle(vcData));
        for (String key : vcBundle.keySet()) {
            result.putExtra(key, vcBundle.getString(key));
        }

        activity.setResult(Activity.RESULT_OK, result);
        activity.finish();
    }
}