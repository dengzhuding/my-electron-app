
export interface IElectronAPI {
  loadPreferences: () => Promise<void>,
}

/** 全局增强window interface */
declare global {
    interface Window {
        electornAPI: IElectronAPI
        testStr: string
        testFn: Function
        testObj: Object
    }
}