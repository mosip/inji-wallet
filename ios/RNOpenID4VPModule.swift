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
  func authenticateVerifier(_ urlEncodedAuthorizationRequest: String,
                            trustedVerifierJSON: AnyObject,
                            walletMetadata: AnyObject?,
                            shouldValidateClient: Bool,
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
        
        let walletMetadataObject: WalletMetadata? = {
          guard let metadata = walletMetadata as? [String: Any] else { return nil }
          guard let vpFormatsSupportedDict = metadata["vp_formats_supported"] as? [String: [String: Any]] else { return nil }
          
          let vpFormatsSupported: [String: VPFormatSupported] = {
            guard let ldpVcDict = vpFormatsSupportedDict["ldp_vc"] as? [String: Any] else {
              return [:]
            }
            let algValuesSupported = ldpVcDict["alg_values_supported"] as? [String]
            return ["ldp_vc": VPFormatSupported(algValuesSupported: algValuesSupported)]
          }()
          
          // Extract clientIdSchemesSupported and check if it's nil or empty
          let clientIdSchemesSupported = metadata["client_id_schemes_supported"] as? [String]
          
          // Create WalletMetadata conditionally
          var walletMetadata = WalletMetadata(
            presentationDefinitionURISupported: metadata["presentation_definition_uri_supported"] as? Bool ?? true,
            vpFormatsSupported: vpFormatsSupported,
            requestObjectSigningAlgValuesSupported: metadata["request_object_signing_alg_values_supported"] as? [String],
            authorizationEncryptionAlgValuesSupported: metadata["authorization_encryption_alg_values_supported"] as? [String],
            authorizationEncryptionEncValuesSupported: metadata["authorization_encryption_enc_values_supported"] as? [String]
          )
          
          // Assign clientIdSchemesSupported only if it's non-nil and non-empty
          if let clientIdSchemes = clientIdSchemesSupported, !clientIdSchemes.isEmpty {
            walletMetadata.clientIdSchemesSupported = clientIdSchemes
          }
          return walletMetadata
        }()
        
        let authenticationResponse: AuthorizationRequest = try await openID4VP!.authenticateVerifier(
          urlEncodedAuthorizationRequest: urlEncodedAuthorizationRequest,
          trustedVerifierJSON: trustedVerifiersList,
          walletMetadata: walletMetadataObject,
          shouldValidateClient: shouldValidateClient
        )
        
        let response = try toJsonString(jsonObject: authenticationResponse)
        resolve(response)
      } catch {
        reject("OPENID4VP", error.localizedDescription, error)
      }
    }
  }
  
  @objc
  func constructUnsignedVPToken(_ credentialsMap: AnyObject, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task {
      do {
        guard let credentialsMap = credentialsMap as? [String: [String: Array<Any>]] else {
          reject("OPENID4VP", "Invalid credentials map format", nil)
          return
        }
        
        let formattedCredentialsMap = credentialsMap.mapValues { selectedVcsFormatMap -> [FormatType: [Any]] in
          selectedVcsFormatMap.reduce(into: [:]) { result, entry in
            let (credentialFormat, credentialsArray) = entry
            switch FormatType(rawValue: credentialFormat) {
            case .ldp_vc:
              result[.ldp_vc] = credentialsArray
            default:
              reject("OPENID4VP", "Credential format is not supported for OVP", nil)
            }
          }
        }
        
        let response = try await openID4VP?.constructUnsignedVPToken(credentialsMap: formattedCredentialsMap)
        let encodableDict = response?.mapKeys { $0.rawValue }
          .mapValues { EncodableWrapper($0) }
        
        do {
          let jsonData = try JSONEncoder().encode(encodableDict) // Convert Enum to String
          if let jsonObject = try JSONSerialization.jsonObject(with: jsonData, options: []) as? [String: Any] {
            resolve(jsonObject)
          } else {
            reject("ERROR", "Failed to serialize JSON", nil)
          }
        } catch {
          reject("ENCODING_ERROR", error.localizedDescription, nil)
        }
        
      } catch {
        reject("OPENID4VP", error.localizedDescription, error)
      }
    }
  }
  
  @objc
  func shareVerifiablePresentation(_ vpResponsesMetadata: [String: Any], resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task {
      do {
        var formattedVPResponsesMetadata: [FormatType: VPResponseMetadata] = [:]
        
        for (credentialFormat, vpResponseMetadata) in vpResponsesMetadata {
          switch credentialFormat {
          case FormatType.ldp_vc.rawValue:
            guard let vpResponse = vpResponseMetadata as? [String:Any] else {
              reject("OPENID4VP", "Invalid vp response meta format", nil)
              return
            }
            guard let jws = vpResponse["jws"] as! String?,
                  let signatureAlgorithm = vpResponse["signatureAlgorithm"] as! String?,
                  let publicKey = vpResponse["publicKey"] as! String?,
                  let domain = vpResponse["domain"] as! String?
            else {
              reject("OPENID4VP", "Invalid vp response metadata", nil)
              return
            }
            
            formattedVPResponsesMetadata[FormatType.ldp_vc] = LdpVPResponseMetadata(jws: jws, signatureAlgorithm: signatureAlgorithm, publicKey: publicKey, domain: domain)
          default:
            reject("OPENID4VP", "Invalid vp response meta format", nil)
          }
        }
        
        let response = try await openID4VP?.shareVerifiablePresentation(vpResponsesMetadata: formattedVPResponsesMetadata)
        
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

struct EncodableWrapper: Encodable {
  private let value: Encodable
  
  init(_ value: Encodable) {
    self.value = value
  }
  
  func encode(to encoder: Encoder) throws {
    try value.encode(to: encoder)
  }
}

extension Dictionary {
  func mapKeys<T: Hashable>(_ transform: (Key) -> T) -> [T: Value] {
    Dictionary<T, Value>(uniqueKeysWithValues: map { (transform($0.key), $0.value) })
  }
}
