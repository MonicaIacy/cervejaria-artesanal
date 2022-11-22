import express from "express"
import * as http from "http"

import * as winston from "winston"
import * as expressWinston from "express-winston"
import cors from "cors"
import { debug } from "debug"
import { CommonRoutesConfig } from "../../../adapters/apis/routes/common.routes.config"
import { ProductsRoutes } from "../../../adapters/apis/routes/products.routes.config"
import apiConfig from "../../config/api.config"
import { AddressesRoutes } from "../../../adapters/apis/routes/addresses.routes.config"

const app: express.Application = express()
const server: http.Server = http.createServer(app)
const port = apiConfig.port
const routes: CommonRoutesConfig[] = []
const debugLog: debug.IDebugger = debug("app")

app.use(express.json())
app.use(cors())

const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  ),
}

if (!process.env.DEBUG) {
  loggerOptions.meta = false
}

app.use(expressWinston.logger(loggerOptions))

routes.push(new ProductsRoutes(app))
routes.push(new AddressesRoutes(app))

const runningMessage = `Servidor rodando na porta ${port}`
app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).send(runningMessage)
})

if (process.env.NODE_ENV !== "test") {
  server.listen(port, () => {
    routes.forEach((route: CommonRoutesConfig) => {
      debugLog(`Rotas configuradas para ${route.getName()}`)
    })
    console.log(runningMessage)
  })
}

export default app
