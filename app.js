const app = require('express')()
const responseTime = require('responseTime')
const axios = require('axios')
const redis = require('redis')

const client = redis.createClient()

client.on('error', err => {
  console.log(`Error: ${err}`)
})

app.set('port', process.env.PORT || 3000)
app.use(responseTime())

app.get('/', (req, res) => {})

app.listen(app.get('port'), () => {
  console.log('Magic happen at http://localhost:', app.get('port'))
})
