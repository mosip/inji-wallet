package io.mosip.residentapp;

import android.bluetooth.BluetoothAdapter;
import android.content.IntentFilter;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import io.mosip.residentapp.RNEventEmitter;
import io.mosip.tuvali.common.BluetoothStateChangeReceiver;
import io.mosip.tuvali.wallet.Wallet;
import kotlin.Unit;
import kotlin.jvm.functions.Function1;
import kotlin.jvm.functions.Function2;

public class RNWalletModule extends ReactContextBaseJavaModule {

  private static final String NAME = "WalletModule";
  private final RNEventEmitter eventEmitter;
  private final Wallet wallet;
  private final IntentFilter bluetoothStateChangeIntentFilter;
  private final BluetoothStateChangeReceiver bluetoothStateChangeReceiver;

  public RNWalletModule(RNEventEmitter eventEmitter, Wallet wallet, ReactApplicationContext reactContext) {
    super(reactContext);
    this.eventEmitter = eventEmitter;
    this.wallet = wallet;

    this.bluetoothStateChangeIntentFilter = new IntentFilter();
    bluetoothStateChangeIntentFilter.addAction(BluetoothAdapter.ACTION_STATE_CHANGED);

    this.bluetoothStateChangeReceiver = new BluetoothStateChangeReceiver(handleDisconnect);
    reactContext.registerReceiver(bluetoothStateChangeReceiver, bluetoothStateChangeIntentFilter);
    wallet.subscribe(event -> eventEmitter.emitEvent(RNEventMapper.toMap(event)));
  }

  Function2<Integer, Integer, Unit> handleDisconnect = new Function2<Integer, Integer, Unit>() {
    @Override
    public Unit invoke(Integer status, Integer state) {
      wallet.handleDisconnect(status, state);
      return Unit.INSTANCE;
    }
  };

  public Function1<WritableMap, Unit> emitEventHandler = new Function1<WritableMap, Unit>() {
    @Override
    public Unit invoke(WritableMap eventMap) {
      eventEmitter.emitEvent(eventMap);
      return Unit.INSTANCE;
    }
  };

  @ReactMethod(isBlockingSynchronousMethod = true)
  public void startConnection(String uri) {
    wallet.startConnection(uri);
  }

  @ReactMethod
  public void sendData(String payload) {
    wallet.sendData(payload);
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public void disconnect() {
    wallet.disconnect();
  }

  @Override
  public String getName() {
    return NAME;
  }

  @Override
  protected void finalize() throws Throwable {
    try {
      getReactApplicationContext().unregisterReceiver(bluetoothStateChangeReceiver);
    } finally {
      super.finalize();
    }
  }
}
