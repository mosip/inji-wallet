import Foundation
import React

@objc(QrLoginIntent)
class RNQrLoginIntentModule: NSObject, RCTBridgeModule {
  
  static func moduleName() -> String {
    return "QrLoginIntent"
  }
  
  @objc func isQrLoginByDeepLink(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let qrData = IntentData.shared.getQrData()
    resolve(qrData)
  }
  
  @objc func resetQRLoginDeepLinkData() {
    IntentData.shared.setQrData("")
  }
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
