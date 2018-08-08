// @flow

import express from 'express'

const app = express()

app.post('/dataOutputs', (req, res) => {
  res.send(req.params)
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
