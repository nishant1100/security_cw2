const mongoose = require('mongoose');
const Order = require('../model/Order');
const Product = require('../model/Product');

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost/test-db', { useNewUrlParser: true, useUnifiedTopology: true });
});

afterEach(async () => {
  await Order.deleteMany({});
  await Product.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Order Model Test', () => {
    it('should create & save an order successfully', async () => {
        const product = new Product({
          title: 'Test Product',
          artistName: 'Test Artist',
          description: 'A sample product description',
          category: 'Music',
          old_price: 150,
          new_price: 100,
          productImage: '/images/sample.jpg',
          productFile: '/files/sample.mp3',
        });
      
        const savedProduct = await product.save();
      
        const orderData = {
          name: 'John Doe',
          email: 'john@example.com',
          address: { city: 'New York', country: 'USA', state: 'NY', zipcode: '10001' },
          phone: 1234567890,
          productIds: [savedProduct._id],
          totalPrice: 100
        };
      
        const order = new Order(orderData);
        const savedOrder = await order.save();
      
        expect(savedOrder._id).toBeDefined();
        expect(savedOrder.name).toBe(orderData.name);
        expect(savedOrder.email).toBe(orderData.email);
        expect(savedOrder.address.city).toBe(orderData.address.city);
        expect(savedOrder.totalPrice).toBe(orderData.totalPrice);
      });
      

  it('should retrieve orders by email', async () => {
    const orderData = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      address: { city: 'Los Angeles', country: 'USA', state: 'CA', zipcode: '90001' },
      phone: 9876543210,
      productIds: [],
      totalPrice: 50
    };

    await new Order(orderData).save();

    const retrievedOrders = await Order.find({ email: 'jane@example.com' });

    expect(retrievedOrders.length).toBe(1);
    expect(retrievedOrders[0].email).toBe(orderData.email);
  });

  it('should retrieve all orders', async () => {
    await new Order({
      name: 'Alice',
      email: 'alice@example.com',
      address: { city: 'San Francisco', country: 'USA', state: 'CA', zipcode: '94101' },
      phone: 1122334455,
      productIds: [],
      totalPrice: 75
    }).save();

    const orders = await Order.find();
    expect(orders.length).toBeGreaterThan(0);
  });
});
