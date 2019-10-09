
const express= require('express');
const bodyParser = require('body-parser');
const fs=require('fs');
const cors=require('cors');

const app= express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routes =require('./routes/routes.js')(app,fs);

const server = app.listen(3001,()=>{
	console.log('listening in port %s...',server.address().port);
});