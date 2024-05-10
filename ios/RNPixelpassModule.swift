import Foundation
import pixelpass
import React
@objc(RNPixelpassModule)
class RNPixelpassModule: NSObject, RCTBridgeModule {
    static func moduleName() -> String {
        return "RNPixelpassModule"
    }
    
    @objc(decode:resolver:rejecter:)
    func decode(_ parameter: String, resolve:  RCTPromiseResolveBlock, reject:  RCTPromiseRejectBlock) {
        do {
            let pixelPass = PixelPass()
          guard let result = pixelPass.decode(data:parameter) else { return resolve("Failed") }
          resolve(String(data:result, encoding: .ascii))
        } catch {
            reject("ERROR", "Failed to de code", error)
        }
    }

    @objc(generateQRCode:data:ecc:header:resolver:rejecter:)
    func generateQRCode(data: String, ecc: String = "L", header: String = "", resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let eccValue = ECC(rawValue: ecc) ?? .L
        if let imageData = generateQRCode(data: data, ecc: eccValue, header: header) {
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



