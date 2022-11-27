import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import './EditProduct.css';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

const ProductEditPage = (props) => {
  const params = useParams();
  const { mode, id: productId } = params;

  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    imageUrl: '',
    description: '',
  });

  useEffect(() => {
    // Will be "edit" or "add"
    if (mode === 'edit') {
      axios
        .get('http://localhost:3100/products/' + productId)
        .then((productResponse) => {
          const product = productResponse.data;
          setFormData({
            title: product.name,
            price: product.price.toString(),
            imageUrl: product.image,
            description: product.description,
          });
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err);
        });
    } else {
      setIsLoading(false);
    }
  }, [mode, productId]);

  const editProductHandler = (event) => {
    event.preventDefault();
    if (
      formData.title.trim() === '' ||
      formData.price.trim() === '' ||
      formData.imageUrl.trim() === '' ||
      formData.description.trim() === ''
    ) {
      return;
    }

    setIsLoading(false);
    const productData = {
      name: formData.title,
      price: parseFloat(formData.price),
      image: formData.imageUrl,
      description: formData.description,
    };

    let request;
    if (mode === 'edit') {
      request = axios.patch(
        'http://localhost:3100/products/' + productId,
        productData
      );
    } else {
      request = axios.post('http://localhost:3100/products', productData);
    }

    request
      .then((result) => {
        setIsLoading(false);
        props.history.replace('/products');
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
        props.onError(
          'Editing or adding the product failed. Please try again later'
        );
      });
  };

  const inputChangeHandler = (event, input) => {
    setFormData((preState) => {
      return { ...preState, [input]: event.target.value };
    });
  };

  let content = (
    <form className="edit-product__form" onSubmit={editProductHandler}>
      <Input
        label="Title"
        config={{ type: 'text', value: formData.title }}
        onChange={(event) => inputChangeHandler(event, 'title')}
      />
      <Input
        label="Price"
        config={{ type: 'number', value: formData.price }}
        onChange={(event) => inputChangeHandler(event, 'price')}
      />
      <Input
        label="Image URL"
        config={{ type: 'text', value: formData.imageUrl }}
        onChange={(event) => inputChangeHandler(event, 'imageUrl')}
      />
      <Input
        label="Description"
        elType="textarea"
        config={{ rows: '5', value: formData.description }}
        onChange={(event) => inputChangeHandler(event, 'description')}
      />
      <Button type="submit">
        {mode === 'add' ? 'Create Product' : 'Update Product'}
      </Button>
    </form>
  );
  if (isLoading) {
    content = <p>Is loading...</p>;
  }

  return <main>{content}</main>;
};

export default ProductEditPage;
