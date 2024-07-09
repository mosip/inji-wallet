import Foundation
import React
import ios_tuvali_library

@objc(WalletModule)
class WalletModule: RCTEventEmitter {
    var wallet: WalletProtocol = Wallet()
    var tuvaliVersion: String = "unknown"

    override init() {
        super.init()
        RNEventEmitter.sharedInstance.registerEventEmitter(producer: self)
        wallet.subscribe { event in
          RNEventEmitter.sharedInstance.emitEvent(eventMap: RNEventMapper.toMap(event))
        }
    }

    @objc func noop() {
        // No operation method
    }

    @objc
    func startConnection(_ uri: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        do {
            wallet.startConnection(uri)
            resolver(nil)
        } catch let error {
            rejecter("START_CONNECTION_ERROR", "Failed to start connection", error)
        }
    }

    @objc
    func disconnect(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        do {
            wallet.disconnect()
            resolver(nil)
        } catch let error {
            rejecter("DISCONNECT_ERROR", "Failed to disconnect", error)
        }
    }

    @objc
    func sendData(_ payload: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        do {
            wallet.send(payload)
            resolver(nil)
        } catch let error {
            rejecter("SEND_DATA_ERROR", "Failed to send data", error)
        }
    }

  @objc override func supportedEvents() -> [String]! {
      return RNEventEmitter.sharedInstance.allEvents
  }


    override static func requiresMainQueueSetup() -> Bool {
        return false
    }

  @objc
  override static func moduleName() -> String {
        return "WalletModule"
    }
}
