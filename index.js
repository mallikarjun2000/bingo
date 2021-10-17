const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT | 1234;

app.use(express.static(path.resolve(__dirname,'public')))

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname,'public','index.html'));
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})