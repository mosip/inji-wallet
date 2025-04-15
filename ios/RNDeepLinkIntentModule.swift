import Foundation
import React

@objc(DeepLinkIntent)
class RNDeepLinkIntentModule: NSObject, RCTBridgeModule {
  
  static func moduleName() -> String {
    return "DeepLinkIntent"
  }
  
  @objc func getDeepLinkIntentData(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let qrData = IntentData.shared.getQrData()
    resolve(qrData)
  }
  
  @objc func resetDeepLinkIntentData() {
    IntentData.shared.setQrData("")
  }
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
