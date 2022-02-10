package com.reactnativemetroipo;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.metroipo.sdk.MetroIpoSdk;

@ReactModule(name = MetroIpoModule.NAME)
public class MetroIpoModule extends ReactContextBaseJavaModule {
  public static final String NAME = "MetroIpoRN";
  private MetroIpoSdk metroSdk;

  public MetroIpoModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  private void sendEvent(ReactContext reactContext,
                         String eventName,
                         @Nullable WritableMap params) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, params);
  }

  @ReactMethod
  public void initialize(String domain, String code, ReadableMap theme, Promise promise ) {
    try {
      // Initialize MetroSDK
      metroSdk = new MetroIpoSdk.Builder()
        .setDomain(domain)
        .setCode(code)
        .create();

      // Pass SDK response to JS bridge
      WritableMap params = Arguments.createMap();
      params.putBoolean("success", true);
      params.putString("message", "The Metro IPO Signature SDK has been initialized.");
      promise.resolve(params);
    } catch (Exception e) {
      WritableMap params = Arguments.createMap();
      params.putBoolean("error", true);
      params.putString("message", e.getLocalizedMessage());
      promise.reject(e, params);
    }
  }

  @ReactMethod
  public void startCapture(Promise promise) {
    try {
      metroSdk.start(getCurrentActivity());

      metroSdk.onStart(new MetroIpoSdk.Response() {
        @Override
        public void onSuccess() {
          WritableMap params = Arguments.createMap();
          params.putBoolean("success", true);
          params.putString("message", "The Metro IPO Signature Capture has been started.");
          promise.resolve(params);
        }

        @Override
        public void onFailure(String reason) {
          WritableMap params = Arguments.createMap();
          params.putBoolean("error", false);
          params.putString("message", reason);
          promise.reject(new IllegalStateException(reason), params);
        }
      });

      metroSdk.onComplete(new MetroIpoSdk.Callback() {
        @Override
        public void execute() {
          WritableMap params = Arguments.createMap();
          params.putBoolean("success", true);
          params.putString("message", "The Captured Signature has been uploaded to Metro IPO.");
          sendEvent(getReactApplicationContext(), "onMetroIpoComplete", params);
        }
      });

      metroSdk.onCancel(new MetroIpoSdk.Callback() {
        @Override
        public void execute() {
          WritableMap params = Arguments.createMap();
          params.putBoolean("error", true);
          params.putString("message", "A signature was not uploaded to Metro IPO.");
          sendEvent(getReactApplicationContext(), "onMetroIpoCancel", params);
        }
      });
    } catch (Exception e) {
      WritableMap params = Arguments.createMap();
      params.putBoolean("error", true);
      params.putString("message", e.getLocalizedMessage());
      promise.reject(e, params);
    }
  }
}
