import Foundation
import React

@objc(DeepLinkIntent)
class RNDeepLinkIntentModule: NSObject, RCTBridgeModule {
  
  static func moduleName() -> String {
    return "DeepLinkIntent"
  }
  
  @objc func getDeepLinkIntentData(_ flowType: String, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let intentData = IntentData.shared
    let result = intentData.getDataByFlow(flowType)
    resolve(result)
  }
  
  @objc func resetDeepLinkIntentData(_ flowType: String) {
    IntentData.shared.resetDataByFlow(flowType)
  }
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
