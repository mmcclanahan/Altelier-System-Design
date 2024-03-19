CREATE DATABASE PRODUCTS;
USE PRODUCTS;
DROP TABLE IF EXISTS Features;
DROP TABLE IF EXISTS StylePhotos;
DROP TABLE IF EXISTS SKUs;
DROP TABLE IF EXISTS RelatedProducts;
DROP TABLE IF EXISTS ProductStyles;
DROP TABLE IF EXISTS Products;
CREATE TABLE Products (
  product_id INT PRIMARY KEY,
  name VARCHAR(255),
  slogan TEXT,
  description TEXT,
  category VARCHAR(255),
  default_price VARCHAR(20)
);
Create Table Features (
  product_id INT,
  feature VARCHAR(255),
  value VARCHAR(255),
  PRIMARY KEY (product_id, feature, value),
  FOREIGN KEY (product_id) REFERENCES Products(product_id)
);
CREATE TABLE ProductStyles (
  style_id INT PRIMARY KEY,
  product_id INT,
  name VARCHAR(255),
  original_price VARCHAR(20),
  sale_price VARCHAR(20),
  is_default TINYINT(1),
  FOREIGN KEY (product_id) REFERENCES Products(product_id)
);
CREATE TABLE StylePhotos (
  photo_id INT AUTO_INCREMENT PRIMARY KEY,
  style_id INT,
  thumbnail_url VARCHAR(255),
  url VARCHAR(255),
  FOREIGN KEY (style_id) REFERENCES ProductStyles(style_id)
);
CREATE TABLE SKUs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  style_id INT,
  skuNumber VARCHAR(40),
  quantity INT,
  size VARCHAR(5),
  FOREIGN KEY (style_id) REFERENCES ProductStyles(style_id)
);
CREATE TABLE RelatedProducts (
  product_id INT,
  related_product_id INT,
  FOREIGN KEY (product_id) REFERENCES Products(product_id),
  FOREIGN KEY (related_product_id) REFERENCES Products(product_id)
);