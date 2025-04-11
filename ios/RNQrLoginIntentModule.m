#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(QrLoginIntent,NSObject)

RCT_EXTERN_METHOD(isQrLoginByDeepLink:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(resetQRLoginDeepLinkData)

@end
