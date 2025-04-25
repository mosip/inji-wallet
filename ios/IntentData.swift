import Foundation

@objc public class IntentData: NSObject {
  @objc public static let shared = IntentData()
  private let syncQueue = DispatchQueue(label: "com.intentdata.syncQueue", attributes: .concurrent)
  private var qrData: String = ""
  private var ovpQrData: String = ""
  
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
  
  @objc public func getOvpQrData() -> String {
    var data: String = ""
    syncQueue.sync {
      data = ovpQrData
    }
    return data
  }
  
  @objc public func setOvpQrData(_ newValue: String) {
    syncQueue.async(flags: .barrier) {
      self.ovpQrData = newValue
    }
  }
  
  func getDataByFlow(_ flowType: String?) -> String {
    switch flowType {
    case "qrLoginFlow":
      return getQrData()
    case "ovpFlow":
      return getOvpQrData()
    default:
      return ""
    }
  }
  
  func resetDataByFlow(_ flowType: String) {
    switch flowType {
    case "qrLoginFlow":
      setQrData("")
    case "ovpFlow":
      setOvpQrData("")
    default:
      break
    }
  }
  
}