import detectPort from 'detect-port'
import { createFsFromVolume, IFs, Volume } from 'memfs'
import joinPath from 'memory-fs/lib/join'
import * as path from 'path'
import * as webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

console.log('WebpackDevServer', WebpackDevServer)

export async function compile(config: webpack.Configuration) {
  process.env.TARO_ENV = 'h5'

  const appPath = path.resolve(__dirname, '../mock')

  process.chdir(appPath)

  const stats = await run(config)
  return { stats, config }
}

function run(webpackConfig: webpack.Configuration): Promise<webpack.Stats | undefined> {
  const compiler = webpack.default(webpackConfig)
  const fs = createFsFromVolume(new Volume())
  const ensuredFs = ensureWebpackMemoryFs(fs)

  compiler.outputFileSystem = ensuredFs

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err ?? stats?.hasErrors()) {
        const error = err ?? stats!.toJson().errors
        reject(error)
      } else {
        resolve(stats)
      }
    })
  })
}

interface EnsuredFs extends IFs {
  join: () => string
}

function ensureWebpackMemoryFs(fs: IFs): EnsuredFs {
  const newFs: EnsuredFs = Object.create(fs)
  newFs.join = joinPath

  return newFs
}

export function getOutput(stats, config: webpack.Configuration) {
  const fs: IFs = stats.compilation.compiler.outputFileSystem

  const files = readDir(fs, config.output.path)
  const output = files.reduce((content, file) => {
    return `${content}
/** filePath: ${file} **/
${fs.readFileSync(file)}
`
  }, '')
  return output
}

function readDir(fs: IFs, dir: string) {
  let files: string[] = []
  const list = fs.readdirSync(dir)
  list.forEach((item) => {
    const filePath = path.join(dir, item)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      files = files.concat(readDir(fs, filePath))
    } else {
      files.push(filePath)
    }
  })
  return files
}

export const devServer = async (
  webpackConfig: webpack.Configuration
): Promise<webpack.Stats | undefined> => {
  const port = await detectPort(8080)
  const devServerOptions = {
    host: 'localhost',
    port,
  }

  return new Promise((resolve, reject) => {
    WebpackDevServer.addDevServerEntrypoints(webpackConfig, devServerOptions)
    const compiler = webpack.default(webpackConfig) as webpack.Compiler
    const server = new WebpackDevServer(compiler, devServerOptions)
    compiler.hooks.done.tap('taroBuildDone', (stats) => {
      resolve(stats)
    })

    compiler.hooks.failed.tap('taroBuildDone', (error) => {
      reject(error)
    })

    server.listen(devServerOptions.port, devServerOptions.host as string, (err) => {
      if (err) {
        console.log(err)
      }
    })
  })
}
