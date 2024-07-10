#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(VersionModule, RCTEventEmitter)

RCT_EXTERN_METHOD(setTuvaliVersion:(NSString *)version
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)


@end
