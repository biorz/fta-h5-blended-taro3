import { flatten, sortedUniqBy } from 'lodash'
import * as webpack from 'webpack'
import webpackChain from 'webpack-chain'
import { mergeWithCustomize } from 'webpack-merge'
import MainPlugin from './plugins/mainPlugin'

type TConfiguration = webpack.Configuration | webpackChain

export default function <T extends TConfiguration>(_chain: T): T {
  let config: webpack.Configuration | null = null
  let chain: webpackChain | null = null

  if (!(_chain instanceof webpackChain)) {
    config = _chain
    chain = new webpackChain()
  } else {
    chain = _chain
  }

  chain.module
    .rule('h5-blended-script')
    .include.add(/@tarojs/)
    .end()
    .test(/\.js|\.ts$/)
    .use('babel')
    .loader('babel-loader')

  chain.resolve.alias
    .set('@tarojs/taro', '@tarojs/taro-h5')
    .set('@tarojs/components$', '@tarojs/components/dist-h5/react')

  chain.resolve.mainFields
    .prepend('main')
    .prepend('jsnext:main')
    .prepend('module')
    .prepend('browser')
    .prepend('main:h5')

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
  ])

  // TODO: 不同尺寸？
  chain.plugin('mainPlugin').use(MainPlugin, [
    {
      designWidth: 750,
      designRadio: { 750: 1 },
    },
  ])

  if (config) {
    const mergeConfig: webpack.Configuration = mergeWithCustomize({
      customizeArray(a, b, key) {
        if (key === 'resolve.mainFields') {
          return sortMainFields(a, b)
        }
        return undefined
      },
    })(config, chain.toConfig())
    return mergeConfig as T
  }

  return chain as T
}

const sortMainFields = (a, b) => {
  const mainFields = flatten(b.concat(a)).filter(Boolean)

  const mainFieldPriority = ['main:h5', 'browser', 'module', 'jsnext:main', 'main']
  const result = sortedUniqBy(mainFields, (value: string) => {
    return mainFieldPriority.indexOf(value) || Infinity
  })

  return result
}
