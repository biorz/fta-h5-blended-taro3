"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var path = __importStar(require("path"));
var MainPlugin = /** @class */ (function () {
    function MainPlugin(options) {
        this.options = (0, lodash_1.defaults)(options || {}, {
            deviceRatio: {},
            designWidth: 750,
        });
    }
    MainPlugin.prototype.apply = function (compiler) {
        var _this = this;
        this.appEntries = this.getAppEntry(compiler);
        compiler.hooks.compilation.tap(MainPlugin.PLUGIN_NAME, function (compilation) {
            compilation.hooks.normalModuleLoader.tap(MainPlugin.PLUGIN_NAME, _this.addLoader.bind(_this));
        });
    };
    MainPlugin.prototype.addLoader = function (_loaderContext, module) {
        var _a = this.options, designWidth = _a.designWidth, deviceRatio = _a.deviceRatio;
        if (!this.appEntries.includes(module.resource))
            return;
        module.loaders.push({
            loader: path.join(__dirname, '../loaders/appEntry'),
            options: {
                pxTransformConfig: {
                    designWidth: designWidth,
                    deviceRatio: deviceRatio,
                },
            },
        });
    };
    MainPlugin.prototype.getAppEntry = function (compiler) {
        var entry = compiler.options.entry;
        if (typeof entry === 'object' && !Array.isArray(entry)) {
            entry = Object.entries(entry).map(function (_a) {
                var key = _a[0], val = _a[1];
                if (Array.isArray(val))
                    return val;
                return typeof val == 'string' ? val : val === null || val === void 0 ? void 0 : val.import;
            });
            entry = [].concat.apply([], entry);
        }
        entry = entry
            .filter(function (it) {
            return !~it.indexOf('webpack-dev-server') && !~it.indexOf('node_modules');
        })
            .map(function (it) {
            return path.isAbsolute(it) ? it : path.join(compiler.context, it);
        });
        return entry;
    };
    MainPlugin.PLUGIN_NAME = 'MainPlugin';
    return MainPlugin;
}());
exports.default = MainPlugin;
//# sourceMappingURL=mainPlugin.js.map