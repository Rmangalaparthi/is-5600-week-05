// orders.js
const cuid = require('cuid');
const db = require('./db');

// Define the Order model
const Order = db.model('Order', {
  _id: { type: String, default: cuid },
  buyerEmail: { type: String, required: true },
  products: [
    {
      type: String,
      ref: 'Product', // Reference the Product model
      index: true,
      required: true,
    },
  ],
  status: {
    type: String,
    index: true,
    default: 'CREATED',
    enum: ['CREATED', 'PENDING', 'COMPLETED'], // Allowed statuses
  },
});

/**
 * List orders
 * @param {Object} options
 * @returns {Promise<Array>}
 */
async function list(options = {}) {
  const { offset = 0, limit = 25, productId, status } = options;

  const productQuery = productId ? { products: productId } : {};
  const statusQuery = status ? { status: status } : {};
  const query = { ...productQuery, ...statusQuery };

  return await Order.find(query)
    .sort({ _id: 1 })
    .skip(offset)
    .limit(limit);
}

/**
 * Get an order
 * @param {String} _id
 * @returns {Promise<Object>}
 */
async function get(_id) {
  return await Order.findById(_id)
    .populate('products') // Fetch associated products
    .exec();
}

/**
 * Create an order
 * @param {Object} fields
 * @returns {Promise<Object>}
 */
async function create(fields) {
  const order = await new Order(fields).save();
  await order.populate('products'); // Populate associated products
  return order;
}

/**
 * Edit an order
 * @param {String} _id
 * @param {Object} change
 * @returns {Promise<Object>}
 */
async function edit(_id, change) {
  const order = await get(_id); // Fetch the order

  if (!order) {
    throw new Error('Order not found');
  }

  // Apply changes
  Object.keys(change).forEach((key) => {
    order[key] = change[key];
  });

  await order.save(); // Save changes to the database
  return order;
}

/**
 * Delete an order
 * @param {String} _id
 * @returns {Promise<void>}
 */
async function destroy(_id) {
  await Order.deleteOne({ _id }); // Delete the order
}

module.exports = {
  list,
  get,
  create,
  edit,
  destroy,
};
