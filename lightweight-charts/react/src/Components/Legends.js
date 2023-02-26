import { useImperativeHandle, useState, forwardRef } from 'react';
import './Legends.css';

const Legends = forwardRef((_, ref) => {
  const [priceFormatted, setPriceFormatted] = useState();

  const changePrice = (price) => {
    setPriceFormatted(price);
  };

  useImperativeHandle(ref, () => ({
    changePrice: changePrice,
  }));

  return (
    <div className="legends">
      <div className="legends-title">
        ETC USD 7D VWAP <strong>{priceFormatted}</strong>
      </div>
    </div>
  );
});

export default Legends;
