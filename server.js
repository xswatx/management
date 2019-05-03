const fs =require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const data = fs.readFileSync('./database.json','utf8');
const conf = JSON.parse(data);
const mysql = require('mysql');
const conn = mysql.createConnection({
  host:conf.host,
  user:conf.user,
  password:conf.password,
  port:conf.port,
  database:conf.database
});
conn.connect();

app.get('/api/customers', (req, res)=>{
    conn.query('select * from customer',(err, rows, fields) => {
        res.send(rows);
      }
    );
});


app.listen(port, () => console.log(`listening on port ${port}`));