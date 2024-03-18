DROP TABLE IF EXISTS `Products`;

CREATE TABLE Products (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  slogan TEXT,
  description TEXT,
  category VARCHAR(255),
  default_price VARCHAR(20)
);

CREATE TABLE ProductStyles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT,
  name VARCHAR(255),
  original_price VARCHAR(20),
  sale_price VARCHAR(20),
  is_default TINYINT(1),
  FOREIGN KEY (product_id) REFERENCES Products(id)
);

CREATE TABLE StylePhotos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  style-id INT,
  thumbnail_url VARCHAR(255),
  url VARCHAR(255),
  FOREIGN KEY (style_id) REFERENCES ProductStyles(id)
);

CREATE TABLE Skus (
  id INT AUTO_INCREMENT PRIMARY KEY,
  style_id INT,
  quantity INT,
  size VARCHAR(10),
  FOREIGN KEY (style_id) REFERENCES ProductStyles(id)
);

CREATE TABLE RelatedProducts (
  product_id INT,
  related_products_id INT,
  FOREIGN KEY (product_id) REFERENCES Products(id),
  FOREIGN KEY (releated_product_id) REFERENCES Products(id)
)