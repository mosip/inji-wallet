import Foundation
import pixelpass
import React
@objc(RNPixelpassModule)
class RNPixelpassModule: NSObject, RCTBridgeModule {
    static func moduleName() -> String {
        return "RNPixelpassModule"
    }
    
    @objc
    func decode(_ parameter: String, resolve:  @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        do {
            let pixelPass = PixelPass()
          guard let result = pixelPass.decode(data:parameter) else { return resolve("Failed") }
          resolve(String(data:result, encoding: .ascii))
        } catch {
            reject("ERROR", "Failed to de code", error)
        }
    }

    @objc
    func generateQRData(_ data: String, header: String = "", resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
      if let encodedData = PixelPass().generateQRData(data) {
            let qrData=encodedData+header
            resolve(qrData)
        } else {
            reject("E_NO_IMAGE", "Unable to generate QR data", nil)
        }
    }
   
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true;
  }
}



