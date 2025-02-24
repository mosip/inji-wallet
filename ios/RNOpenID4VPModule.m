#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(InjiOpenID4VP, NSObject)

RCT_EXTERN_METHOD(init:(NSString *)appId)

RCT_EXTERN_METHOD(authenticateVerifier:(NSString *)urlEncodedAuthorizationRequest
                  trustedVerifierJSON:(id)trustedVerifierJSON
                  shouldValidateClient:(BOOL)shouldValidateClient
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(constructVerifiablePresentationToken:(id)credentialsMap
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(shareVerifiablePresentation:(id)vpResponseMetadata
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(sendErrorToVerifier:(NSString *)error
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(requiresMainQueueSetup:(BOOL))

@end
