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
  func `init`(_ traceabilityId: String) {
      vciClient = VCIClient(traceabilityId: traceabilityId)
    }

  @objc
  func requestCredential(_ issuerMeta: AnyObject, proof: String, accessToken: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
      Task {
          do {
              guard let issuerMetaDict = issuerMeta as? [String: Any] else {
                  reject(nil, "Invalid issuerMeta format", nil)
                  return
              }

              guard let credentialAudience = issuerMetaDict["credentialAudience"] as? String,
                    let credentialEndpoint = issuerMetaDict["credentialEndpoint"] as? String,
                    let downloadTimeoutInMilliseconds = issuerMetaDict["downloadTimeoutInMilliSeconds"] as? Int,
                    let credentialType = issuerMetaDict["credentialType"] as? [String],
                    let credentialFormatString = issuerMetaDict["credentialFormat"] as? String,
                    let credentialFormat = CredentialFormat(rawValue: credentialFormatString) else {
                  reject(nil, "Invalid issuerMeta format", nil)
                  return
              }

              let issuerMetaObject = IssuerMeta(
                  credentialAudience: credentialAudience,
                  credentialEndpoint: credentialEndpoint,
                  downloadTimeoutInMilliseconds: downloadTimeoutInMilliseconds,
                  credentialType: credentialType,
                  credentialFormat: credentialFormat
              )

              let response = try await vciClient!.requestCredential(issuerMeta: issuerMetaObject, proof: JWTProof(jwt: proof), accessToken: accessToken)!
              let responseString = try response.toJSONString()
              resolve(responseString)
          } catch {
            reject(nil,error.localizedDescription, nil)
          }
      }
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
