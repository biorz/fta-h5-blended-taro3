import { getOptions } from 'loader-utils'

export default function (source: string) {
  // 热更新不重新注入脚本
  if (source.includes('defineCustomElements')) {
    return source
  }

  const options = getOptions(this)
  const pxTransformConfig = options.pxTransformConfig

  //! code在insert的过程中顺序会被改变，所以需要插入到最后
  const code = `
import { defineCustomElements, applyPolyfills } from '@tarojs/components/loader';
import '@tarojs/components/dist/taro-components/taro-components.css';
import { initPxTransform } from '@tarojs/taro';

${source}

applyPolyfills().then(function () {
  defineCustomElements(window)
})
initPxTransform({
  designWidth: ${pxTransformConfig.designWidth},
  deviceRatio: ${JSON.stringify(pxTransformConfig.deviceRatio)}
})`

  return code
}
