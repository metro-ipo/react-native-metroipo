import { NativeModules, EventEmitter, NativeEventEmitter } from 'react-native';

interface Result {
  success: boolean;
  error: boolean;
  message: string;
}

interface MetroIpoConfig {
  domain?: String;
  code?: String;
  theme?: Theme;
}

interface Theme {
  /**
   * Defines the background color of the Toolbar.
   */
  colorPrimary?: string;
  /**
   * Defines the background color of Primary Buttons and the text color of Secondary Buttons.
   */
  colorButtonPrimary?: string;
  /**
   * Defines the text color of primary buttons
   */
  colorButtonPrimaryText?: string;
  /**
   * Defines the background color of primary buttons when pressed
   */
  colorButtonPrimaryPressed?: string;
}

class MetroIpoModule {
  private readonly module: any;
  private readonly emitter: EventEmitter;
  private onCompleteListener: any;
  private onCancelListener: any;

  constructor() {
    this.module = NativeModules.MetroIpoRN;
    this.emitter = new NativeEventEmitter(this.module);
  }

  /**
  * Function 'init' takes the following parameters:
  * 1. MetroIpoConfig config: Metro IPO Sdk configuration.
  * 
  * Returns a Promise
  */
  public init(config: MetroIpoConfig = { domain: '', code: '', theme: {} }): Promise<Result> {
    return this.module.initialize(config.domain, config.code, config.theme);
  }

  public startCapture(): Promise<Result> {
    return this.module.startCapture();
  }

  public onComplete(callback: (...args: any[]) => any) {
    this.onCompleteListener = this.emitter.addListener('onMetroIpoComplete', callback);
  }

  public onCancel(callback: (...args: any[]) => any) {
    this.onCancelListener = this.emitter.addListener('onMetroIpoCancel', callback);
  }

  /**
  * Function 'removeListeners' unregisters the 'onMetroIpoComplete' and 'onMetroIpoCancel' event listeners if they were defined.
  */
  public removeListeners() {
    if (this.onCompleteListener != null) {
      this.onCompleteListener.remove('onMetroIpoComplete', () => { });
    }
    if (this.onCancelListener != null) {
      this.onCancelListener.remove('onMetroIpoCancel', () => { });
    }
  }
}

class ConfigBuilder {
  private domain: String = '';
  private code: String = '';
  private appearance: Theme = {};

  /**
  * Function 'setDomain' takes the following parameter:
  * String: Metro Ipo Admin Server base url.
  */
  public setDomain(domain: String) {
    let val = domain.trim();
    if (val == '') {
      throw new Error("Admin server base url is missing.");
    }
    this.domain = val;
    return this;
  }

  /**
  * Function 'setCode' takes the following parameter:
  * String: Metro Ipo Application Verification Code.
  */
  public setCode(code: String) {
    let val = code.trim();
    if (val == '') {
      throw new Error("Verification code is missing.");
    }
    this.code = val;
    return this;
  }

  /**
  * iOS only - for android, set appearance in colors.xml file
  */
  public setAppearance(theme: Theme): ConfigBuilder {
    this.appearance = theme;
    return this;
  }

  public build(): MetroIpoConfig {
    return { domain: this.domain, code: this.code, theme: this.appearance }
  }
}

export const MetroIpo = new MetroIpoModule();

export const MetroIpoConfig = new ConfigBuilder();
