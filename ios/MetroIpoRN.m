#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(MetroIpoRN, RCTEventEmitter)

RCT_EXTERN_METHOD(initialize:(NSString*)domain
                  appearance:(NSDictionary)theme
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(startCapture:(NSString*)code
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
                  )

@end
