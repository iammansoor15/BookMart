require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');
const router = require('./Routes/router');
const Rent = require('./Routes/Rent'); 
const Exchange = require('./Routes/Exchange'); 


const DefaultData = require('./defaultdata');
const PORT = process.env.PORT || 5000;
const cors = require('cors');
require('./database/conn');



app.use(cors({
    origin: 'http://localhost:3000',  
    credentials: true,               
  }));

app.use(cookieParser());
app.use(express.json());


app.use(router);
app.use(Rent);
app.use(Exchange);


app.listen(PORT, '0.0.0.0', () => 
    console.log(`Server is running on port ${PORT}`)
);
DefaultData();
