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
      if let imageData = PixelPass().generateQRCode(data: data, ecc: .L, header: header) {
            let base64Image = imageData.base64EncodedString(options: [])
            resolve(base64Image)
        } else {
            reject("E_NO_IMAGE", "Unable to generate QR code", nil)
        }
    }
   
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true;
  }
}



