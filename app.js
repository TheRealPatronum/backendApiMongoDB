// Server
const port = 3000;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose'); // Status from com. with MongoDB Database
const cors = require('cors');
require('dotenv/config'); // To get confiuration file
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

app.use(cors());
app.options('*', cors());

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);

// Routers
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');

const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

// Database
// Connecting to database with a connectionstring
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'eshop-database',
  })
  .then(() => {
    console.log('Database Connection is ready....');
  })
  .catch((err) => {
    console.log(err);
  });

// Server
// Starting server on selected port:
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
