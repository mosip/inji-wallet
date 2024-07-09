import Foundation

class RNEventEmitter: RNEventEmitterProtocol {
    public static var sharedInstance = RNEventEmitter()
    private var EVENT_NAME = "DATA_EVENT"
    static var producer: WalletModule!

    private  init() {}

    func emitEvent(eventMap: NSMutableDictionary) {
        dispatch(name: EVENT_NAME, body: eventMap)
    }

     func registerEventEmitter(producer: WalletModule) {
        RNEventEmitter.producer = producer
    }

    fileprivate func dispatch(name: String, body: Any?) {
        RNEventEmitter.producer.sendEvent(withName: name, body: body)
    }

    lazy var allEvents: [String] = {
        return [
            EVENT_NAME
        ]
    }()
}
