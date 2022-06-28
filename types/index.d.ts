type TaroEnv = 'h5' | 'weapp' | 'swan' | 'alipay' | 'rn' | 'tt' | 'quickapp' | 'qq'

type ExternalResolve = (importee: string, importer: string) => string | undefined | null

export type TaroConfig = {
  [key in TaroEnv]?: any
} & {
  designWidth?: any
  deviceRatio?: any
  postcssOption?: any
  sassOption?: any
  alias?: Record<string, string>
  resolve?: any
  externalResolve?: ExternalResolve
}

export interface ResolverOption {
  include?: (path: boolean) => boolean
  exclude?: (path: boolean) => boolean
  externalResolve: ExternalResolve
}

export interface pluginConfig {
  debug?: boolean
  input: string
  output: string
  taroRoot?: string
  taroEnv?: TaroEnv
  external?: string[]
  tsconfig?: string
  externalResolve: ExternalResolve
}
