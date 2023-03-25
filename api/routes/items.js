const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './uploads/');
  },
  filename: function(req, file, cb){
    cb(null, Date.now() + file.originalname);
  },
})

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}
const upload = multer({storage: storage, limits: {
  fileSize: 1024 * 1024 * 5
},
fileFilter: fileFilter
})

const Item = require('../models/item')

/* Get all the items */
router.get('/', (req, res, next) => {
  Item.find()
    .select()
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        items: docs.map(doc => {
          return {
            name: doc.name,
            description: doc.description,
            price: doc.price,
            category: doc.category,
            itemImage: doc.itemImage,
            _id: doc._id,
            request: {
              type: this.get,
              url: 'http://localhost:3000/items/' + doc._id

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

/* Add a new item */
router.post('/', upload.single('itemImage'),(req, res, next) => {
  const item = new Item({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    itemImage: req.file.path
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
          itemImage: req.file.path,
          _id: result._id,
          request: {
            type: this.get,
            url: 'http://localhost:3000/items/' + result._id
          }
        }
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err })
    })
});

/* Get a specific item */
router.get('/:itemId', (req, res, next) => {
  const id = req.params.itemId;
  Item.findById(id)
    .select('name description price category _id itemImage')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          item: doc,
          request: {
            type: this.get,
            description: "Get all items",
            url: 'http://localhost:3000/items/'
          }
        });
      }
      else {
        res.status(404).json({ message: "No valid entry found for provided ID" })
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err })
    })
})

/* Update an item*/
router.put('/:id', upload.single('itemImage'), async (req, res, next) => {
  const foundItem = await Item.findById(req.params.id);
  if (foundItem) {
    foundItem.name = req.body.name || foundItem.name;
    foundItem.description = req.body.description || foundItem.description;
    foundItem.price = req.body.price || foundItem.price;
    foundItem.category = req.body.category || foundItem.category;
    foundItem.itemImage = req.file.path || foundItem.itemImage;
  } else {
    return res.status(404).json({
      message: "Item not found"
    })
  }

  const updatedItem = await foundItem.save();
  if (updatedItem) {
    return res.status(200).json({
      updatedItem,
      message: "Item updated successfully"
    })
  } else {
    return res.status(404).json({
      updatedItem,
      message: "Item cannot be updated"
    })
  }
})

/* Delete an item*/
router.delete('/:itemId', (req, res, next) => {
  const id = req.params.itemId;
  Item.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Item deleted',
        request: {
          type: this.post,
          url: 'http://localhost:3000/items/',
          body: { name: 'String', price: 'Number' }
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