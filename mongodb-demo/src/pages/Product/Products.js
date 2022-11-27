import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

import Products from '../../components/Products/Products';

const ProductsPage = ({ onError }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const fetchData = useCallback(() => {
    axios
      .get('http://localhost:3100/products?page=1')
      .then((productsResponse) => {
        setIsLoading(false);
        setProducts(productsResponse.data);
      })
      .catch((err) => {
        setIsLoading(false);
        setProducts([]);
        onError('Loading products failed. Please try again later');
        console.log(err);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const productDeleteHandler = (productId) => {
    axios
      .delete('http://localhost:3100/products/' + productId)
      .then((result) => {
        console.log(result);
        fetchData();
      })
      .catch((err) => {
        onError('Deleting the product failed. Please try again later');
        console.log(err);
      });
  };

  let content = <p>Loading products...</p>;
  if (!isLoading && products.length > 0) {
    content = (
      <Products products={products} onDeleteProduct={productDeleteHandler} />
    );
  }
  if (!isLoading && products.length === 0) {
    content = <p>Found no products. Try again later.</p>;
  }
  return <main>{content}</main>;
};

export default ProductsPage;
