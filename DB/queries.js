const {Product, Style, SKU, StylePhoto, RelatedProduct} = require('./models.js')
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
  getStyle: function(id) {
  id = parseInt(id);
  return Style.aggregate([
    {
      $match: {
        product_id: id
      }
    },
    {
      $lookup: {
        from: "stylephotos",
        localField: "style_id",
        foreignField: "style_id",
        as: "photos"
      }
    },
    {
      $addFields: {
        photos: {
          $cond: {
            if: { $eq: [{ $size: "$photos" }, 0] },
            then: [],
            else: { $arrayElemAt: ["$photos.photos", 0] }
          }
        }
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
      $addFields: {
        skus: {
          $cond: {
            if: { $eq: [{ $size: "$skus" }, 0] },
            then: [],
            else: { $arrayElemAt: ["$skus.skus", 0] }
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        product_id: 1,
        style_id: 1,
        name: 1,
        sale_price: 1,
        original_price: 1,
        default_style: 1,
        photos: 1,
        skus: 1
      }
    },
    {
      $group: {
        _id: "$product_id",
        results: {
          $push: "$$ROOT"
        }
      }
    },
    {
      $project: {
        _id: 0,
        product_id: "$_id",
        results: 1
      }
    }
  ]);
},
  getAllProductInfo: function(productId) {
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
  getRelatedIds: function(id) {
    return RelatedProduct.findOne({product_id:id})
    .then((result) => {
      return result;
    })
    .catch((error) => {
      return error;
    });
  }
}
