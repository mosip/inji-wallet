import Foundation

@objc public class IntentData: NSObject {
    @objc public static let shared = IntentData()
    private let syncQueue = DispatchQueue(label: "com.intentdata.syncQueue", attributes: .concurrent)
    private var qrData: String = ""

    private override init() {
        super.init()
    }

    @objc public func getQrData() -> String {
        var data: String = ""
        syncQueue.sync {
            data = qrData
        }
        return data
    }

    @objc public func setQrData(_ newValue: String) {
        syncQueue.async(flags: .barrier) {
            self.qrData = newValue
        }
    }
}
