
#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(RNPixelpassModule,NSObject)

RCT_EXTERN_METHOD(decode:(NSString *)parameter
                        resolve:(RCTPromiseResolveBlock)resolve
                         reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(generateQRCode:(NSString *)data ecc:(NSString *)ecc header:(NSString *)header resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)



@end


