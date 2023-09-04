package io.mosip.residentapp;

import android.app.Application;
import android.content.Context;
import android.content.res.Configuration;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;

import timber.log.Timber;

import com.facebook.react.bridge.JSIModulePackage;
import com.google.firebase.analytics.FirebaseAnalytics;
import com.google.firebase.crashlytics.FirebaseCrashlytics;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  private final ReactNativeHost mReactNativeHost =
    new DefaultReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      // Packages that cannot be autolinked yet can be added manually here, for example:
      // packages.add(new MyReactNativePackage());
      return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
   @Override
    protected boolean isNewArchEnabled() {
      return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    }
    @Override
    protected Boolean isHermesEnabled() {
      return BuildConfig.IS_HERMES_ENABLED;
    }    
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);

    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      DefaultNewArchitectureEntryPoint.load();
    }
    ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());

    if (BuildConfig.DEBUG) {
      Timber.plant(new Timber.DebugTree());
    }
    // Setup Firebase
    FirebaseAnalytics.getInstance(this);
    Timber.plant(new CrashReportingTree());
  }


  /**
   * A tree which logs important information for crash reporting.
   */
  private static class CrashReportingTree extends Timber.Tree {
    FirebaseCrashlytics crashlytics = FirebaseCrashlytics.getInstance();
    @Override
    protected void log(int priority, String tag, @NonNull String message, Throwable t) {
      if (priority == Log.VERBOSE || priority == Log.DEBUG) {
        return;
      }

      crashlytics.setCustomKey("priority", priority);
      crashlytics.setCustomKey("tag", tag);
      crashlytics.log(message);

      if (t != null) {
        if (priority == Log.ERROR) {
          crashlytics.recordException(t);
        }
      }
    }
  }
}
