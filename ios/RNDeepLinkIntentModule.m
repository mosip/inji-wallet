#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(DeepLinkIntent,NSObject)

RCT_EXTERN_METHOD(getDeepLinkIntentData:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(resetDeepLinkIntentData)

@end
