package io.mosip.residentapp;

import com.facebook.react.bridge.WritableMap;

import kotlin.Unit;

public interface IRNEventEmitter {
    Unit emitEvent(WritableMap eventMap);
}