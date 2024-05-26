#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(InjiVciClient, NSObject)

RCT_EXTERN_METHOD(init:(NSString *)appId)

RCT_EXTERN_METHOD(requestCredential:(id)issuerMeta
                  proof:(NSString *)proof
                  accessToken:(NSString *)accessToken
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(requiresMainQueueSetup:(BOOL))

@end
