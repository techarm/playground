import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import './Product.css';

const ProductPage = ({ onError }) => {
  const params = useParams();

  const productId = params.id;
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:3100/products/' + productId)
      .then((productResponse) => {
        setIsLoading(false);
        setProduct(productResponse.data);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
        onError('Loading the product failed. Please try again later');
      });
  }, [productId]);

  let content = <p>Is loading...</p>;
  if (!isLoading && product) {
    content = (
      <main className="product-page">
        <h1>{product.name}</h1>
        <h2>{product.price}</h2>
        <div
          className="product-page__image"
          style={{
            backgroundImage: "url('" + product.image + "')",
          }}
        />
        <p>{product.description}</p>
      </main>
    );
  }
  if (!isLoading && !product) {
    content = (
      <main>
        <p>Found no product. Try again later.</p>
      </main>
    );
  }
  return content;
};

export default ProductPage;
