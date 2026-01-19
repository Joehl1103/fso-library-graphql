const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@as-integrations/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const cors = require('cors')
const http = require('http')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/use/ws')

const mongoose = require('mongoose')

require('dotenv').config()

const User = require('./models/userModel.js')

const jwt = require('jsonwebtoken')

const url = process.env.MONGO_URL

const resolvers = require('./resolvers.js')
const typeDefs = require('./schema.js')

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(() => {
    console.log(`Connected to mongoose`)
  })
  .catch((e) => {
    console.warn(`unable to connect to mongodb: ${e.message}`)
  })

// mongoose.set('debug', true)
const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/'
  })

  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema: schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          };
        },
      },
    ],
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer')) {
          const decodedToken = jwt.verify(
            auth.substring(7), process.env.JWT_SECRET
          )
          const currentUser = await User
            .findById(decodedToken.id)
          return { currentUser }
        }
      }
    })
  )

  const PORT = Number(process.env.PORT) || 4000

  httpServer.listen(PORT, () => console.log(`Server is now running on http://localhost:${PORT}`))

}

start()
