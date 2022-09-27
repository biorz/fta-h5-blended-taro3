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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var webpack = __importStar(require("webpack"));
var webpack_chain_1 = __importDefault(require("webpack-chain"));
var webpack_merge_1 = require("webpack-merge");
var mainPlugin_1 = __importDefault(require("./plugins/mainPlugin"));
function default_1(_chain) {
    var config = null;
    var chain = null;
    if (!(_chain instanceof webpack_chain_1.default)) {
        config = _chain;
        chain = new webpack_chain_1.default();
    }
    else {
        chain = _chain;
    }
    chain.module
        .rule('h5-blended-script')
        .include.add(/@tarojs/)
        .end()
        .test(/\.js|\.ts$/)
        .use('babel')
        .loader('babel-loader')
        .options({
        configFile: false,
        babelrc: false,
        plugins: [
            ['@babel/plugin-proposal-class-properties'],
            ['@babel/plugin-proposal-optional-chaining'],
            ['@babel/plugin-proposal-nullish-coalescing-operator'],
        ],
    });
    chain.resolve.alias
        .set('@tarojs/taro', '@tarojs/taro-h5')
        .set('@tarojs/components$', '@tarojs/components/dist-h5/react');
    chain.resolve.mainFields
        .prepend('main')
        .prepend('jsnext:main')
        .prepend('module')
        .prepend('browser')
        .prepend('main:h5');
    // TODO: h5 / mw ?
    chain.plugin('define').use(webpack.DefinePlugin, [
        {
            'process.env.TARO_ENV': JSON.stringify('h5'),
            ENABLE_INNER_HTML: JSON.stringify(false),
            ENABLE_ADJACENT_HTML: JSON.stringify(false),
            ENABLE_SIZE_APIS: JSON.stringify(false),
            ENABLE_TEMPLATE_CONTENT: JSON.stringify(false),
            ENABLE_CLONE_NODE: JSON.stringify(false),
            ENABLE_CONTAINS: JSON.stringify(false),
            ENABLE_MUTATION_OBSERVER: JSON.stringify(false),
        },
    ]);
    // TODO: 不同尺寸？
    chain.plugin('mainPlugin').use(mainPlugin_1.default, [
        {
            designWidth: 750,
            designRadio: { 750: 1 },
        },
    ]);
    if (config) {
        var mergeConfig = (0, webpack_merge_1.mergeWithCustomize)({
            customizeArray: function (a, b, key) {
                if (key === 'resolve.mainFields') {
                    return sortMainFields(a, b);
                }
                return undefined;
            },
        })(config, chain.toConfig());
        return mergeConfig;
    }
    return chain;
}
exports.default = default_1;
var sortMainFields = function (a, b) {
    var mainFields = (0, lodash_1.flatten)(b.concat(a)).filter(Boolean);
    var mainFieldPriority = ['main:h5', 'browser', 'module', 'jsnext:main', 'main'];
    var result = (0, lodash_1.sortedUniqBy)(mainFields, function (value) {
        return mainFieldPriority.indexOf(value) || Infinity;
    });
    return result;
};
//# sourceMappingURL=index.js.map