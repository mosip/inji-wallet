import Foundation
import VCIClient
import React

@objc(InjiVciClient)
class RNVCIClientModule: NSObject, RCTBridgeModule {
  
  private var vciClient: VCIClient?
  
  static func moduleName() -> String {
    return "InjiVciClient"
  }
  
  @objc
  func requestCredential(_ accessToken: String, proof: String, issuerMeta: AnyObject, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task {
      do {
        let vciClient = VCIClient(traceabilityId: "INJI-module")
        if let issuerMetaDict = issuerMeta as? [String: Any],
           let credentialAudience = issuerMetaDict["credentialAudience"] as? String,
           let credentialEndpoint = issuerMetaDict["credentialEndpoint"] as? String,
           let downloadTimeoutInMilliseconds = issuerMetaDict["downloadTimeoutInMilliSeconds"] as? Int,
           let credentialType = issuerMetaDict["credentialType"] as? [String],
           let credentialFormatString = issuerMetaDict["credentialFormat"] as? String,
           let credentialFormat = CredentialFormat(rawValue: credentialFormatString) {
          
          let issuerMetaObject = IssuerMeta(
            credentialAudience: credentialAudience,
            credentialEndpoint: credentialEndpoint,
            downloadTimeoutInMilliseconds: downloadTimeoutInMilliseconds,
            credentialType: credentialType,
            credentialFormat: credentialFormat
          )
          
          let response = try await vciClient.requestCredential(issuerMeta: issuerMetaObject, proof: JWTProof(jwt: proof), accessToken: accessToken)!
          let responseString = try response.toJSONString()
          resolve(responseString)
        } else {

          reject("E_INVALID_FORMAT", "Invalid issuerMeta format", nil)
        }
      } catch {
        print("Error")
        reject("E_REQUEST_FAILED", "Request failed", error)
      }
    }
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
