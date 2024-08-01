const router = require('express').Router();
let Product = require('../../models/Inventory_Management/product');
const cloudinary = require('../../Utils/cloudinary');


//add product
router.route('/add').post(async (req, res) => {
  try {
    const uploadImage = (image) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(image, (error, result) => {
          if (result && result.secure_url) {
            resolve(result.secure_url);
          } else {
            console.log(error && error.message);
            reject({ message: error && error.message });
          }
        });
      });
    };

    const uploadMultipleImages = async (images) => {
      try {
        const imageUrls = await Promise.all(images.map(uploadImage));
        return imageUrls;
      } catch (error) {
        throw error;
      }
    };

    const { name, category, brand, price, countInStock, description, image } =
      req.body;

    if (!Array.isArray(image)) {
      // If only one image is provided, upload it directly
      const imageUrl = await uploadImage(image);

      const newProduct = new Product({
        name,
        image: imageUrl,
        category,
        brand,
        price,
        countInStock,
        description,
      });

      await newProduct.save();
      res.json('Product added successfully');
    } else {
      // If multiple images are provided, upload them concurrently
      const imageUrls = await uploadMultipleImages(image);

      const newProduct = new Product({
        name,
        image: imageUrls, // Use the array of image URLs obtained from uploadMultipleImages
        category,
        brand,
        price,
        countInStock,
        description,
      });

      await newProduct.save();
      res.json('Product added successfully');
    }
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});


//Get All products
router.route('/').get((req, res) => {
  Product.find()
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      console.log(err);
    });
});

//update product
router.route('/update/:id').put(async (req, res) => {
  //get product id
  let productId = req.params.id;
  const { name, image, category, brand, price, countInStock, description } =
    req.body;

  try {
    const uploadRes = await cloudinary.uploader.upload(image, {
      upload_preset: 'Online-Mobile-Shop',
    });
  } catch (error) {
    console.log(error);
  }

  const updateProduct = {
    name,
    image,
    category,
    brand,
    price,
    countInStock,
    description,
  };

  const update = await Product.findByIdAndUpdate(productId, updateProduct)
    .then((product) => {
      res.status(200).send({ status: 'Product update', product });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ status: 'Error with updatind data' });
    });
});

//Delete product
router.route('/delete/:id').delete(async (req, res) => {
  let productId = req.params.id;

  await Product.findByIdAndDelete(productId)
    .then(() => {
      res.status(200).send({ status: 'Product Delete' });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .send({ status: 'Error with delete product', error: err.message });
    });
});

//get one product data
router.route('/getProduct/:id').get(async (req, res) => {
  try {
    let productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({ status: 'Product not found' });
    }
    res.status(200).send({ status: 'Product fetched', product });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .send({ status: 'Error with fetching product', error: err.message });
  }
});

module.exports = router;
