const {Product, Feature, Style, StylePhoto, SKU, RelatedProduct, Cart} = require('./dbNotIndexed.js');
//make model functions
module.exports= {
  getProductById: function(id) {
    return Product.findOne({product_id:id})
      .then((product) => {
        return product;
      })
      .catch((error) => {
        return error;
      });
  },
  getAll: function(id) {
    productId = parseInt(id);
    return Promise.all([
        Product.findOne({ product_id: productId }),
        Style.find({ product_id: productId })
    ])
    .then(([product, styleObjs]) => {
        product.styles = [];
        return Promise.all(styleObjs.map(styleObj => {
            return Promise.all([
                StylePhoto.find({ style_id: styleObj.style_id }),
                SKU.find({ style_id: styleObj.style_id })
            ])
            .then(([photoObjs, skuObjs]) => {
                let photosArray = photoObjs.map(photoObj => photoObj.photos);
                let skuArray = skuObjs.map(skuObj => skuObj.skus);
                product.styles.push({
                    style_id: styleObj.style_id,
                    name: styleObj.name,
                    sale_price: styleObj.sale_price,
                    original_price: styleObj.original_price,
                    default_style: styleObj.default_style,
                    photos: photosArray,
                    skus: skuArray
                });
            });
        }))
        .then(() => {
            return product;
        });
    })
    .catch(err => {
        console.error(err);
        throw err;
    });
},
  getAllProductInfo: async function(productId) {
    let id = parseInt(productId)
        return Product.aggregate([
          {
            $match: {
              product_id: id,
            }
          },
          {
            $lookup: {
              from: "styles",
              let: { product_id: "$product_id" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$product_id", "$$product_id"] }
                  }
                },
                {
                  $lookup: {
                    from: "stylephotos",
                    localField: "style_id",
                    foreignField: "style_id",
                    as: "stylephotos"
                  }
                },
                {
                  $lookup: {
                    from: "skus",
                    localField: "style_id",
                    foreignField: "style_id",
                    as: "skus"
                  }
                },
                {
                  $project: {
                    _id: 0,
                    style_id: 1,
                    name: 1,
                    sale_price: 1,
                    original_price: 1,
                    default_style: 1,
                    photos: { $arrayElemAt: ["$stylephotos.photos", 0] },
                    skus: {$arrayElemAt: ["$skus.skus", 0] }
                  }
                }
              ],
              as: "styles"
            }
          },
          {
            $project: {
              _id: 0,
              product_id: 1,
              name: 1,
              slogan: 1,
              description: 1,
              category: 1,
              default_price: 1,
              features: 1,
              styles: {
                $map: {
                  input: "$styles",
                  in: {
                    style_id: "$$this.style_id",
                    name: "$$this.name",
                    sale_price: "$$this.sale_price",
                    original_price: "$$this.original_price",
                    default_style: "$$this.default_style",
                    photos: {
                      $cond: {
                        if: { $isArray: "$$this.photos" },
                        then: "$$this.photos",
                        else: null
                      }
                    },
                    skus: {
                      $cond: {
                        if: { $isArray: "$$this.skus" },
                        then: "$$this.skus",
                        else: null
                      }
                    }
                  }
                }
              }
            }
          }
        ])
  },
  getAllProductInfoByName: async function(name) {
    //let id = parseInt(productId)
        return Product.aggregate([
          {
            $match: {
              name: name,
            }
          },
          {
            $lookup: {
              from: "styles",
              let: { product_id: "$product_id" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$product_id", "$$product_id"] }
                  }
                },
                {
                  $lookup: {
                    from: "stylephotos",
                    localField: "style_id",
                    foreignField: "style_id",
                    as: "stylephotos"
                  }
                },
                {
                  $lookup: {
                    from: "skus",
                    localField: "style_id",
                    foreignField: "style_id",
                    as: "skus"
                  }
                },
                {
                  $project: {
                    _id: 0,
                    style_id: 1,
                    name: 1,
                    sale_price: 1,
                    original_price: 1,
                    default_style: 1,
                    photos: { $arrayElemAt: ["$stylephotos.photos", 0] },
                    skus: {$arrayElemAt: ["$skus.skus", 0] }
                  }
                }
              ],
              as: "styles"
            }
          },
          {
            $project: {
              _id: 0,
              product_id: 1,
              name: 1,
              slogan: 1,
              description: 1,
              category: 1,
              default_price: 1,
              features: 1,
              styles: {
                $map: {
                  input: "$styles",
                  in: {
                    style_id: "$$this.style_id",
                    name: "$$this.name",
                    sale_price: "$$this.sale_price",
                    original_price: "$$this.original_price",
                    default_style: "$$this.default_style",
                    photos: {
                      $cond: {
                        if: { $isArray: "$$this.photos" },
                        then: "$$this.photos",
                        else: null
                      }
                    },
                    skus: {
                      $cond: {
                        if: { $isArray: "$$this.skus" },
                        then: "$$this.skus",
                        else: null
                      }
                    }
                  }
                }
              }
            }
          }
        ])
  },
  getRelatedIds: function(id) {
    id = JSON.parse(id)
    return RelatedProduct.aggregate([
      {
        "$match": { "product_id": id }
      },
      {
        "$unwind": "$related_ids"
      },
      {
        "$group": {
          "_id": "product_id",
          "related_ids": { "$push": "$related_ids" } //push related ids into array
        }
      }
    ]);
  }
}