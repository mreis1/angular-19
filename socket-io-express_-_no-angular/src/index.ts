import {createServer} from 'node:http';
import express from 'express';
import IO from 'socket.io';

const app = express()
const server = createServer(app)
const io = new IO.Server(server, {
  // cors: {
  //   origin: '*'
  // }
  // path: '/path-to-socket-srv/'
});
console.log('👉 you may use postman to establish a connection to your server.' +
  'If path is not specified, the default path will be /socket.io/'
);

io.on('connection', (socket) => {
  console.log('New connection received. SocketID=' + socket.id);
})
const port = process.env.PORT || 3000
app.get('/', (req, res) => {
  res.json({
    hello: 'world'
  })
})
server.listen(port, () => {
  console.log(`Server listening on port http://127.0.0.1:${port}`)
})
