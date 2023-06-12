package io.mosip.residentapp;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import androidx.annotation.CallSuper;
import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.core.content.ContextCompat;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import expo.modules.ReactActivityDelegateWrapper;

/**
 * IMPORTANT NOTE: The Android permission flow here works
 * for Android 10 and below, and Android 11,
 * and under continuous investigation if other manufacturers
 * fails to work, etc.
 */
public class MainActivity extends ReactActivity {

  private static final String[] REQUIRED_PERMISSIONS = new String[] {
    Manifest.permission.BLUETOOTH,
    Manifest.permission.BLUETOOTH_ADMIN,
    Manifest.permission.ACCESS_WIFI_STATE,
    Manifest.permission.CHANGE_WIFI_STATE,
    Manifest.permission.CHANGE_WIFI_MULTICAST_STATE
  };

  private static final int REQUEST_CODE_REQUIRED_PERMISSIONS = 1;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    // Set the theme to AppTheme BEFORE onCreate to support
    // coloring the background, status bar, and navigation bar.
    // This is required for expo-splash-screen.
    setTheme(R.style.AppTheme);
    super.onCreate(null);
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "main";
  }

  @RequiresApi(api = Build.VERSION_CODES.M)
  @Override
  protected void onStart() {
    super.onStart();

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      if (!hasPermissions(this, REQUIRED_PERMISSIONS)) {
        this.requestPermissions(REQUIRED_PERMISSIONS, REQUEST_CODE_REQUIRED_PERMISSIONS);
      }
    }
    // TODO Commenting this only for now if permission is not working for other Android 11 manifacturer/devices
    // if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
    //  WifiManager wifi = (WifiManager)getSystemService( Context.WIFI_SERVICE );
    //  if (wifi != null){
    //    WifiManager.MulticastLock lock = wifi.createMulticastLock("IdpassSmartshareExample");
    //    lock.acquire();
    //  }
    // }
    // Must add this to onDestroy/onStop or disconnect to save battery
    // lock.release();

  }

  /**
   * Returns true if the app was granted all the permissions. Otherwise, returns false.
   */
  private static boolean hasPermissions(Context context, String... permissions) {
    for (String permission : permissions) {
      if (ContextCompat.checkSelfPermission(context, permission) != PackageManager.PERMISSION_GRANTED) {
        return false;
      }
    }
    return true;
  }

  /**
   * Handles user acceptance (or denial) of our permission request.
   */
  @CallSuper
  @Override
  public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);

    if (requestCode != REQUEST_CODE_REQUIRED_PERMISSIONS) {
      return;
    }

    for (int grantResult : grantResults) {
      if (grantResult == PackageManager.PERMISSION_DENIED) {
        // Toast.makeText(this, R.string.error_missing_permissions, Toast.LENGTH_LONG).show();
        // connectButton.setEnabled(false);
        Log.d("Main", "Denied");
        return;
      }
    }
    recreate();
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegateWrapper(
      this,
      new ReactActivityDelegate(this, getMainComponentName()) {
        @Override
        protected ReactRootView createRootView() {
          return new RNGestureHandlerEnabledRootView(MainActivity.this);
        }
      }
    );
  }
}
