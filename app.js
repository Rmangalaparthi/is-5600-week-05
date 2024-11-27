const express = require('express')
const api = require('./api')
const middleware = require('./middleware')
const bodyParser = require('body-parser')


// Set the port
const port = process.env.PORT || 3000
// Boot the app
const app = express()
// Register the public directory
app.use(express.static(__dirname + '/public'));
// register the routes
app.use(bodyParser.json())
app.use(middleware.cors)
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.put('/products/:id', api.editProduct)
app.delete('/products/:id', api.deleteProduct)
app.post('/products', api.createProduct)
// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))

// app.js
const express = require('express');
const api = require('./api');
const app = express();

app.use(express.json());

// Order routes
app.get('/orders', api.listOrders); // List orders
app.get('/orders/:id', api.getOrder); // Get a specific order
app.post('/orders', api.createOrder); // Create a new order
app.put('/orders/:id', api.editOrder); // Update an order
app.delete('/orders/:id', api.deleteOrder); // Delete an order

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
