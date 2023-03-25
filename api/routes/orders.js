const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order')


router.get('/', (req, res, next) => {
  Order.find()
  .select('_id type status amount')
  .exec()
  .then(docs => {
    res.status(200).json({
      count : docs.length,
      orders: docs.map(doc=> {
        return {
          _id: doc._id,
          customer_id: doc.customer_id,
          date: doc.date,
          CreatedAt: doc.createdAt,
          UpdatedAt: doc.updatedAt,
          type: doc.type,
          status: doc.status,
          amount: doc.amount,
          items: doc.items,
          request: {
            type: this.get,
            url: 'http://localhost:3000/orders/' + doc._id
          }
        }
      })
    })
  })
  .catch(err => {
    res.status(500).json({
      error: err
    })
  })
})

/*router.post('/', (req, res, next) => {
  const order = new Order({
    _id: mongoose.Types.ObjectId(),
    quantity: req.body.quantity,
    product: req.body.productId 
    });
    order
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json(result)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error : err
      })
    })
})*/

router.get('/:orderId', (req, res, next) => {
  res.status(200).json({
    message : "Order details",
    orderId : req.params.orderId
  })
})

router.delete('/:orderId', (req, res, next) => {
  res.status(200).json({
    message : "Order deleted",
    orderId : req.params.orderId
  })
})



module.exports = router;