interface IMainPluginOptions {
    deviceRatio: any;
    designWidth: number;
}
export default class MainPlugin {
    static PLUGIN_NAME: string;
    options: IMainPluginOptions;
    appEntries: string[];
    constructor(options: any);
    apply(compiler: any): void;
    addLoader(_loaderContext: any, module: any): void;
    getAppEntry(compiler: any): any;
}
export {};
