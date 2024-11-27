const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
*/
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {
  // Extract the limit and offset query parameters
  const { offset = 0, limit = 25, tag } = req.query
  // Pass the limit and offset to the Products service
  res.json(await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  }))
}


/**
 * Get a single product
 * @param {object} req
 * @param {object} res
 */
async function getProduct(req, res, next) {
  const { id } = req.params

  const product = await Products.get(id)
  if (!product) {
    return next()
  }

  return res.json(product)
}

/**
 * Create a product
 * @param {object} req 
 * @param {object} res 
 */
async function createProduct(req, res) {
  console.log('request body:', req.body)
  res.json(req.body)
}

/**
 * Edit a product
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
async function editProduct(req, res, next) {
  console.log(req.body)
  res.json(req.body)
}

/**
 * Delete a product
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function deleteProduct(req, res, next) {
  res.json({ success: true })
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  editProduct,
  deleteProduct
});
// api.js
const Orders = require('./orders');

/**
 * List orders
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
async function listOrders(req, res, next) {
  try {
    const { offset = 0, limit = 25, productId, status } = req.query;

    const orders = await Orders.list({
      offset: Number(offset),
      limit: Number(limit),
      productId,
      status,
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
}

/**
 * Get a single order
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
async function getOrder(req, res, next) {
  try {
    const order = await Orders.get(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
}

/**
 * Create an order
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
async function createOrder(req, res, next) {
  try {
    const order = await Orders.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
}

/**
 * Edit an order
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
async function editOrder(req, res, next) {
  try {
    const change = req.body;
    const order = await Orders.edit(req.params.id, change);
    res.json(order);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete an order
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
async function deleteOrder(req, res, next) {
  try {
    await Orders.destroy(req.params.id);
    res.json({ success: true, message: 'Order deleted successfully.' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listOrders,
  getOrder,
  createOrder,
  editOrder,
  deleteOrder,
};
