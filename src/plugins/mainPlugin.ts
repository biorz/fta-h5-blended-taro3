import { defaults } from 'lodash'
import * as path from 'path'

interface IMainPluginOptions {
  deviceRatio: any
  designWidth: number
}

export default class MainPlugin {
  static PLUGIN_NAME = 'MainPlugin'

  options: IMainPluginOptions
  appEntries: string[]

  constructor(options) {
    this.options = defaults(options || {}, {
      deviceRatio: {},
      designWidth: 750,
    })
  }

  apply(compiler) {
    this.appEntries = this.getAppEntry(compiler)

    compiler.hooks.compilation.tap(MainPlugin.PLUGIN_NAME, (compilation) => {
      compilation.hooks.normalModuleLoader.tap(MainPlugin.PLUGIN_NAME, this.addLoader.bind(this))
    })
  }

  addLoader(_loaderContext, module: any) {
    const { designWidth, deviceRatio } = this.options

    if (!this.appEntries.includes(module.resource)) return

    module.loaders.push({
      loader: path.join(__dirname, '../loaders/appEntry'),
      options: {
        pxTransformConfig: {
          designWidth,
          deviceRatio,
        },
      },
    })
  }

  getAppEntry(compiler) {
    let { entry } = compiler.options

    if (typeof entry === 'object' && !Array.isArray(entry)) {
      entry = Object.entries(entry).map(([key, val]) => {
        if (Array.isArray(val)) return val
        return typeof val == 'string' ? val : (val as Record<string, any>)?.import
      })

      entry = [].concat.apply([], entry)
    }

    entry = entry
      .filter((it) => {
        return !~it.indexOf('webpack-dev-server') && !~it.indexOf('node_modules')
      })
      .map((it) => {
        return path.isAbsolute(it) ? it : path.join(compiler.context, it)
      })
    return entry
  }
}
