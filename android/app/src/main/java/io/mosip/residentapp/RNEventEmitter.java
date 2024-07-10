package io.mosip.residentapp;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import kotlin.Unit;
import kotlin.jvm.functions.Function1;

public class RNEventEmitter implements IRNEventEmitter {

    private static final String EVENT_NAME = "DATA_EVENT";
    private final ReactApplicationContext reactContext;

    public RNEventEmitter(ReactApplicationContext reactContext) {
        this.reactContext = reactContext;
    }

    @Override
    public Unit emitEvent(WritableMap eventMap) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(EVENT_NAME, eventMap);
        return null;
    }
}
