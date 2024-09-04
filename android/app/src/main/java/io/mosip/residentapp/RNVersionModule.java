
package io.mosip.residentapp;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import io.mosip.residentapp.BuildConfig;



public class RNVersionModule extends ReactContextBaseJavaModule {

    private static final String NAME = "VersionModule";

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String getVersion() {
        return BuildConfig.TUVALI_LIB_VERSION;
    }

    @Override
    public String getName() {
        return NAME;
    }
}


