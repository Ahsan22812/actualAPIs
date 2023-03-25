const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();

const Item = require('../models/item')

router.get('/', (req, res, next) => {
  Item.find()
  .select()
  .exec()
  .then(docs => {
    const response = {
      count : docs.length,
      products : docs.map( doc => {
        return {
          name: doc.name,
          description: doc.description,
          price: doc.price,
          category: doc.category,
          _id: doc._id,
          request : {
            type: this.get,
            url: 'http://localhost:3000/products/' + doc._id

          }
        }
      })
    }
    res.status(200).json(response)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    })
  })
})

router.post('/', (req, res, next) => {
  const item = new Item({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category
  });
  item.save()
  .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created item successfully",
        createdItem: {
          name: result.name,
          description: result.description,
          price: result.price,
          category: result.category,
          _id: result._id,
          request: {
            type: this.get,
            url: 'http://localhost:3000/products/' + result._id
          }
        }
      })
    })
    .catch(err => {
      console.log(err);
  res.status(500).json({error: err })
})
});

router.get('/:itemId', (req, res, next) => {
  const id = req.params.itemId;
  Item.findById(id)
  .select('name description price category _id')
  .exec()
  .then(doc => {
    console.log("From database", doc);
    if (doc){
    res.status(200).json({
      item: doc,
      request: {
        type: this.get,
        description: "Get all items",
        url: 'http://localhost:3000/products/'
      }
    }); }
    else {
      res.status(404).json({ message: "No valid entry found for provided ID"})
    }
  })
  .catch(err =>
    {
      console.log(err);
      res.status(500).json({error: err})
    })
    })


/*router.patch('/:productId', (req, res, next) => {
  const id = req.params.productId;
  const updateOps= {};
  for (const ops of req.body){
    updateOps[ops.propName] = ops.value;
  }
  Product.update({_id: id}, {$set: updateOps})
  .exec()
  .then(result => {
    res.status(200).json({
      message: 'Product Updated',
      request: {
        type: this.get,
        url: 'http://localhost:3000/products/' + id
      }
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error : err
    });
  });
}); */

router.delete('/:itemId', (req, res, next) => {
  const id = req.params.productId;
  Item.remove({_id: id})
  .exec()
  .then(result => {
    res.status(200).json({
      message: 'Item deleted',
      request: {
        type: this.post,
        url: 'http://localhost:3000/products/',
        body: {name: 'String', price: 'Number'}
      }
    })
  })
    .catch(err => {
      console.log(err);
      res.status(500).json({
      error: err
    }) 
  })
});





module.exports = router;