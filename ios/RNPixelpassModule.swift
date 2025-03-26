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
    func generateQRCodeWithinLimit(allowedQRDataSizeLimit: Int, _ data: String, header: String = "", resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        do {
            if let qrImageData = try PixelPass().generateQRCodeWithinLimit(allowedQRDataSizeLimit: allowedQRDataSizeLimit, data: data, header: header) {
                resolve(qrImageData.base64EncodedString())
            } else {
                reject("E_NO_IMAGE", "Unable to generate QR image", nil)
            }
        } catch QRDataOverflowException.customError(let description) {
            reject("E_QR_DATA_OVERFLOW", description, nil)
        } catch {
            reject("E_UNKNOWN_ERROR", "An unknown error occurred", nil)
        }
    }

  @objc
  func decodeBase64UrlEncodedCBORData(_ data: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    do {
      let decodedData =  try PixelPass().toJson(base64UrlEncodedCborEncodedString: data)
      resolve(decodedData)
    } catch {
          reject("ERROR_DECODING", "Unable to decode data", nil)
    }
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true;
  }
}



