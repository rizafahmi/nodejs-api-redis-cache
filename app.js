const app = require('express')()
const responseTime = require('response-time')
const redis = require('redis')
const github = require('./github')

const client = redis.createClient()

client.on('error', err => {
  console.log(`Error: ${err}`)
})

app.set('port', process.env.PORT || 3000)
app.use(responseTime())

app.get('/', (req, res) => {
  res.send('welcome to caching experience!')
})
app.get('/api/:username', (req, res) => {
  const username = req.params.username

  client.get(username, (error, result) => {
    if (result) {
      res.send({
        totalStars: result,
        source: 'redis cache'
      })
    } else {
      github
        .getUserRepositories(username)
        .then(github.computeTotalStars)
        .then(totalStars => {
          client.setex(username, 60, totalStars)
          res.send({
            totalStars: totalStars,
            source: 'GitHub API'
          })
        })
        .catch(response => {
          if (response.status === 404) {
            res.send(
              'The GitHub username could not be found. Try "rizafahmi" as an example.'
            )
          } else {
            res.send(response)
          }
        })
    }
  })
})

app.listen(app.get('port'), () => {
  console.log('Magic happen at http://localhost:', app.get('port'))
})
