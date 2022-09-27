"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var loader_utils_1 = require("loader-utils");
function default_1(source) {
    // 热更新不重新注入脚本
    if (source.includes('defineCustomElements')) {
        return source;
    }
    var options = (0, loader_utils_1.getOptions)(this);
    var pxTransformConfig = options.pxTransformConfig;
    //! code在insert的过程中顺序会被改变，所以需要插入到最后
    var code = "\nimport { defineCustomElements, applyPolyfills } from '@tarojs/components/loader';\nimport '@tarojs/components/dist/taro-components/taro-components.css';\nimport { initPxTransform } from '@tarojs/taro';\n\n".concat(source, "\n\napplyPolyfills().then(function () {\n  defineCustomElements(window)\n})\ninitPxTransform({\n  designWidth: ").concat(pxTransformConfig.designWidth, ",\n  deviceRatio: ").concat(JSON.stringify(pxTransformConfig.deviceRatio), "\n})");
    return code;
}
exports.default = default_1;
//# sourceMappingURL=appEntry.js.map