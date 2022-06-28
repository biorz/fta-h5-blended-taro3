import webpackChain from 'webpack-chain'
import h5BlendedTaro3 from '../src'
import webpackConfig from './mock/webpack.config'
import { compile, devServer, getOutput } from './utils'

describe('chain', () => {
  jest.setTimeout(1000000)

  test('modify webpack config', () => {
    const newConfig = h5BlendedTaro3(webpackConfig)

    expect(newConfig).toMatchSnapshot()
  })

  test('modify webpack chain', () => {
    const chain = h5BlendedTaro3(new webpackChain())

    expect(chain.toConfig()).toMatchSnapshot()
  })

  test('inject entry on build', async () => {
    const chain = h5BlendedTaro3(webpackConfig)

    const { stats, config } = await compile(chain)
    const assets = stats?.toJson().assets || []
    expect(assets.length).toMatchSnapshot()
    const output = getOutput(stats, config)
    expect(output).toEqual(expect.stringContaining('defineCustomElements'))
  })

  test('inject entry on dev server', async () => {
    const config = h5BlendedTaro3(webpackConfig)

    const stats = await devServer(config)
    const assets = stats?.toJson().assets || []
    expect(assets.length).toMatchSnapshot()
    const output = getOutput(stats, config)
    expect(output).toEqual(expect.stringContaining('defineCustomElements'))
  })

  test('entries of object type', async () => {
    const config = h5BlendedTaro3({
      ...webpackConfig,
      entry: {
        app: './src/app.tsx',
      },
    })

    const stats = await devServer(config)
    const assets = stats?.toJson().assets || []
    expect(assets.length).toMatchSnapshot()
    const output = getOutput(stats, config)
    expect(output).toEqual(expect.stringContaining('defineCustomElements'))
  })
})
