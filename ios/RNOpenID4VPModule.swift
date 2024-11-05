import Foundation
import OpenID4VP
import React

@objc(InjiOpenID4VP)
class RNOpenId4VpModule: NSObject, RCTBridgeModule {
  
  private var openID4VP: OpenID4VP?
  
  static func moduleName() -> String {
    return "InjiOpenID4VP"
  }
  
  @objc
  func `init`(_ appId: String) {
    openID4VP = OpenID4VP(traceabilityId: appId)
  }
  
  @objc
  func authenticateVerifier(_ encodedAuthorizationRequest: String,
                            trustedVerifierJSON: AnyObject,
                            resolver resolve: @escaping RCTPromiseResolveBlock,
                            rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task {
      do {
        guard let verifierMeta = trustedVerifierJSON as? [[String:Any]] else {
          reject("OPENID4VP", "Invalid verifier meta format", nil)
          return
        }
        
        let trustedVerifiersList: [Verifier] = try verifierMeta.map { verifierDict in
          guard let clientId = verifierDict["client_id"] as? String,
                let responseUris = verifierDict["response_uris"] as? [String] else {
            throw NSError(domain: "", code: -1, userInfo: [NSLocalizedDescriptionKey: "Invalid Verifier data"])
          }
          return Verifier(clientId: clientId, responseUris: responseUris)
        }
        
        let authenticationResponse: AuthorizationRequest = try await openID4VP!.authenticateVerifier(encodedAuthorizationRequest: encodedAuthorizationRequest, trustedVerifierJSON: trustedVerifiersList)
        
        let response = try toJsonString(jsonObject: authenticationResponse)
        resolve(response)
      } catch {
        reject("OPENID4VP", error.localizedDescription, error)
      }
    }
  }
  
  @objc
  func constructVerifiablePresentationToken(_ credentialsMap: AnyObject, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task {
      do {
        guard let credentialsMap = credentialsMap as? [String:[String]] else {
          reject("OPENID4VP", "Invalid credentials map format", nil)
          return
        }
        
        let response = try await openID4VP?.constructVerifiablePresentationToken(credentialsMap: credentialsMap)
        resolve(response)
        
      } catch {
        reject("OPENID4VP", error.localizedDescription, error)
      }
    }
  }
  
  @objc
  func shareVerifiablePresentation(_ vpResponseMetadata: AnyObject, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task {
      do {
        guard let vpResponse = vpResponseMetadata as? [String:String] else {
          reject("OPENID4VP", "Invalid vp response meta format", nil)
          return
        }
        
        guard let jws = vpResponse["jws"] as String?,
              let signatureAlgorithm = vpResponse["signatureAlgorithm"] as String?,
              let publicKey = vpResponse["publicKey"] as String?,
              let domain = vpResponse["domain"] as String?
        else {
          reject("OPENID4VP", "Invalid vp response metat", nil)
          return
        }
        
        let vpResponseMeta = VPResponseMetadata(jws: jws, signatureAlgorithm: signatureAlgorithm, publicKey: publicKey, domain: domain)
        
        let response = try await openID4VP?.shareVerifiablePresentation(vpResponseMetadata: vpResponseMeta)
        
        resolve(response)
      } catch {
        reject("OPENID4VP", error.localizedDescription, error)
      }
    }
  }
  
  @objc
  func sendErrorToVerifier(_ error: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task {
      enum VerifierError: Error {
        case customError(String)
      }
      
      await openID4VP?.sendErrorToVerifier(error: VerifierError.customError(error))
      resolve(true)
    }
  }
  
  func toJsonString(jsonObject: AuthorizationRequest) throws -> String {
    let encoder = JSONEncoder()
    encoder.keyEncodingStrategy = .convertToSnakeCase
    let jsonData = try encoder.encode(jsonObject)
    
    if let jsonString = String(data: jsonData, encoding: .utf8) {
      return jsonString
    } else {
      throw NSError(domain: "Error converting JSON data to String", code: 0, userInfo: nil)
    }
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
}
