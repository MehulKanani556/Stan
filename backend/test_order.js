import mongoose from 'mongoose';
import Order from './src/models/Order.model.js';
mongoose.connect('mongodb://127.0.0.1:27017/stan').then(async () => {
  try {
    const order = new Order({
      user: new mongoose.Types.ObjectId(),
      items: [{
        game: new mongoose.Types.ObjectId(),
        platform: 'android',
        price: 50
      }],
      amount: 50,
      originalAmount: 50
    });
    await order.validate();
    console.log('Validation passed!');
  } catch (err) {
    console.error('Validation Error:', err);
  }
  process.exit();
})
