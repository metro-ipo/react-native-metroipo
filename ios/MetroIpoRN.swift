import MetroIpoSdk

@objc(MetroIpoRN)
class MetroIpoRN: RCTEventEmitter {
  private var sdk: MetroIpo!
  
  @objc
  func initialize(_ domain: String,
                  appearance theme: [String: Any],
                  resolve: RCTPromiseResolveBlock,
                  reject: RCTPromiseRejectBlock) {
    var params: [String: Any] = [:]
    do {
      var configBuilder = MetroIpoConfig().setDomain(url: domain)
      if let ui = getTheme(appearance: theme) {
        configBuilder = configBuilder.setAppearance(ui)
      }
      let config = configBuilder.build()
      sdk = try MetroIpo(configuration: config)
      params["success"] = true
      params["message"] = "The Metro Signature Capture api is ready."
      resolve(params)
    } catch let error {
      reject("E_FLOW", "\(error)", error)
    }
  }
  
  @objc
  func startCapture(_ code: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    var params: [String: Any] = [:]
    
    sdk.with(responseHandler: {response in
      switch response {
      case .success(let result):
        params["success"] = true
        params["authKey"] = result
        params["message"] = "Metro IPO Signature was uploaded."
        self.sendEvent(withName: "onMetroIpoComplete", body: params)
        break
      case .failure(let error):
        params["error"] = true
        params["message"] = "Metro IPO Sdk encountered an error: \(error.localizedDescription)"
        self.sendEvent(withName: "onMetroIpoCancel", body: params)
        break
      case .start:
        params["success"] = true
        params["message"] = "Metro IPO Signature Capture was started succesfully."
        resolve(params)
        break
      case .error(let error):
        switch error {
        case .exception(withMessage: let message):
          reject("E_FAIL", "\(message)", error)
        case .USER_CANCELLED:
          reject("E_FAIL", "Applicant cancelled signature capture.", error)
        case .API_NOT_AVAILABLE:
          reject("E_FAIL", "Metro IPO server is unreachable.", error)
        case .UPLOAD_INVALID:
          reject("E_FAIL", "Upload data is corrupted.", error)
        case .CODE_MISSING:
          reject("E_FAIL", "Verification code is missing.", error)
        default:
          reject("E_FAIL", "An unknown error occured.", error)
        }
        break;
      @unknown default:
        reject("E_FAIL", "An unknown error occured.", nil)
      }
    })
    
    var presentationStyle: UIModalPresentationStyle = .fullScreen
    
    if UIDevice.current.userInterfaceIdiom == .pad {
      presentationStyle = .formSheet
    }
    
    DispatchQueue.main.async {
      do {
        guard let presentedView = RCTPresentedViewController() else {
          return
        }
        try self.sdk.start(code: code, origin: presentedView, style: presentationStyle)
      } catch let error {
        reject("E_FLOW", "\(error)", error)
      }
    }
    
  }
  
  func getTheme(appearance theme: [String: Any]) -> Theme? {
    if !theme.isEmpty {
      let darkMode = theme["enableDarkMode"] ?? false
      let primary = theme["colorPrimary"] ?? "#3D71E3"
      let buttonPrimary = theme["colorButtonPrimary"] ?? "#3D71E3"
      let buttonTextPrimary = theme["colorButtonPrimaryText"] ?? "#FFFFFF"
      let buttonPrimaryPressed = theme["colorButtonPrimaryPressed"] ?? "#5E6671"
      return Theme(
        colorPrimary: hexStringToUIColor(hex: primary as! String),
        colorButtonPrimary: hexStringToUIColor(hex: buttonPrimary as! String),
        colorButtonPrimaryText: hexStringToUIColor(hex: buttonTextPrimary as! String),
        colorButtonPrimaryPressed: hexStringToUIColor(hex: buttonPrimaryPressed as! String),
        enableDarkMode: darkMode as! Bool
      )
    }
    return nil
  }
  
  override func supportedEvents() -> [String]! {
    return ["onMetroIpoComplete","onMetroIpoCancel"]
  }
  
  @objc
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  // https://stackoverflow.com/a/27203691/7405943
  func hexStringToUIColor (hex: String) -> UIColor {
    var cString:String = hex.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
    
    if (cString.hasPrefix("#")) {
      cString.remove(at: cString.startIndex)
    }
    
    if ((cString.count) != 6) {
      return UIColor.gray
    }
    
    var rgbValue:UInt64 = 0
    Scanner(string: cString).scanHexInt64(&rgbValue)
    
    return UIColor(
      red: CGFloat((rgbValue & 0xFF0000) >> 16) / 255.0,
      green: CGFloat((rgbValue & 0x00FF00) >> 8) / 255.0,
      blue: CGFloat(rgbValue & 0x0000FF) / 255.0,
      alpha: CGFloat(1.0)
    )
  }
}
