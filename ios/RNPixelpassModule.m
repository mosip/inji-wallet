
#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(RNPixelpassModule,NSObject)

RCT_EXTERN_METHOD(decode:(NSString *)parameter
                        resolve:(RCTPromiseResolveBlock)resolve
                         reject:(RCTPromiseRejectBlock)reject)


RCT_EXTERN_METHOD(generateQRCodeWithinLimit:(NSInteger)allowedQRDataSizeLimit
                data:(NSString *)data
                header:(NSString *)header
                resolve:(RCTPromiseResolveBlock)resolve
                reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(decodeBase64UrlEncodedCBORData:(NSString *)data
                   resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)



@end


