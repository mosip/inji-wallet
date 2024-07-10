import Foundation
import React
import os.log


@objc(VersionModule)
class VersionModule: RCTEventEmitter {
    private var tuvaliVersion: String = "unknown"
    
    @objc
    func setTuvaliVersion(_ version: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        do {
            tuvaliVersion = version
            os_log("Tuvali version - %{public}@", tuvaliVersion)
            resolver(tuvaliVersion)
        } catch let error {
            rejecter("SET_VERSION_ERROR", "Failed to set Tuvali version", error)
        }
    }
    
    @objc
    override func supportedEvents() -> [String]! {
        return []
    }
    
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }

    @objc
  override static func moduleName() -> String {
        return "VersionModule"
    }
}
