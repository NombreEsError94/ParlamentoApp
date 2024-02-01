const express = require('express');
const { connect } = require('./Database/sqliteConnector')

const app = express();

app.get('/parliamentGroups', (req, res) => {
    connect();
    res.status(200).json("test");
});

const port=5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});