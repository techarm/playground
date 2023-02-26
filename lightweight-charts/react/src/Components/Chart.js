import { createChart, CrosshairMode, LineStyle } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';
import Legends from './Legends';
import './Chart.css';

import CandleData from '../data/candle';
import VolumeData from '../data/volume';
import MarkerData from '../data/marker';

const Chart = (props) => {
  // const { data } = props;
  const candledata = CandleData;
  const volumeData = VolumeData;
  const markerData = MarkerData;

  // Generate sample data to use within a candlestick series
  // const candleStickData = generateCandlestickData();
  const candleStickData = candledata.map((datapoint) => {
    // map function is changing the color for the individual
    // candlestick points that close above 205
    if (datapoint.close < 205) {
      return datapoint;
    }
    // we are adding 'color' and 'wickColor' properties to the datapoint.
    // Using spread syntax: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals
    return { ...datapoint, color: 'orange', wickColor: 'orange' };
  });

  const chartContainerRef = useRef();
  const legendRef = useRef();

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#222' },
        textColor: '#DDD',
        fontFamily: "'Roboto', sans-serif",
      },
      grid: {
        vertLines: { color: '#444' },
        horzLines: { color: '#444' },
      },
      watermark: {
        visible: true,
        fontSize: 64,
        horzAlign: 'center',
        vertAlign: 'center',
        color: 'rgba(255, 255, 255, 0.06)',
        text: 'TradingView',
      },
    });

    // Setting the border color for the vertical axis
    // chart.priceScale().applyOptions({
    //   borderColor: '#71649C',
    // });

    chart.timeScale().applyOptions({
      borderColor: '#71649C', // Setting the border color for the horizontal axis
      barSpacing: 10, // Adjust the starting bar width (essentially the horizontal zoom)
    });

    // Get the current users primary locale
    const currentLocale = window.navigator.languages[0];
    // Create a number format using Intl.NumberFormat
    const myPriceFormatter = Intl.NumberFormat(currentLocale, {
      style: 'currency',
      currency: 'USD', // Currency for data points
    }).format;

    // Apply the custom priceFormatter to the chart
    chart.applyOptions({
      localization: {
        priceFormatter: myPriceFormatter,
      },
      crosshair: {
        // Change mode from default 'magnet' to 'normal'.
        // Allows the crosshair to move freely without snapping to datapoints
        mode: CrosshairMode.Normal,

        // Vertical crosshair line (showing Date in Label)
        vertLine: {
          width: 8,
          color: '#C3BCDB44',
          style: LineStyle.Solid,
          labelBackgroundColor: '#9B7DFF',
        },

        // Horizontal crosshair line (showing Price in Label)
        horzLine: {
          color: '#9B7DFF',
          labelBackgroundColor: '#9B7DFF',
        },
      },
    });

    chart.timeScale().fitContent();

    // Convert the candlestick data for use with a line series
    const lineData = candleStickData.map((datapoint) => ({
      time: datapoint.time,
      value: (datapoint.close + datapoint.open) / 2,
    }));

    // Add an area series to the chart,
    // Adding this before we add the candlestick chart
    // so that it will appear beneath the candlesticks
    const areaSeries = chart.addAreaSeries({
      lastValueVisible: false, // hide the last value marker for this series
      crosshairMarkerVisible: false, // hide the crosshair marker for this series
      lineColor: 'transparent', // hide the line
      topColor: 'rgba(56, 33, 110,0.6)',
      bottomColor: 'rgba(56, 33, 110, 0.1)',
    });
    // Set the data for the Area Series
    areaSeries.setData(lineData);

    // Create the Main Series (Candlesticks)
    const mainSeries = chart.addCandlestickSeries();

    // Adjust the options for the priceScale of the mainSeries
    mainSeries.priceScale().applyOptions({
      autoScale: false, // disables auto scaling based on visible content
      scaleMargins: {
        top: 0.1,
        bottom: 0.4,
      },
    });

    // Set the data for the Main Series
    mainSeries.setData(candleStickData);
    // Changing the Candlestick colors
    mainSeries.applyOptions({
      wickUpColor: 'rgb(54, 116, 217)',
      upColor: 'rgb(54, 116, 217)',
      wickDownColor: 'rgb(225, 50, 85)',
      downColor: 'rgb(225, 50, 85)',
      borderVisible: false,

      lineWidth: 2,
      // disabling built-in price lines
      lastValueVisible: false,
      priceLineVisible: false,
    });

    // Add VOLUME Series
    const volumeSeries = chart.addHistogramSeries({
      color: '#26a69a',
      lastValueVisible: false, // hide the last value marker for this series
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '', // set as an overlay by setting a blank priceScaleId
      // set the positioning of the volume series
      scaleMargins: {
        top: 0.7, // highest point of the series will be 70% away from the top
        bottom: 0,
      },
    });
    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.7, // highest point of the series will be 70% away from the top
        bottom: 0,
      },
    });
    volumeSeries.setData(volumeData);

    // PRICE Lines
    let minimumPrice = candleStickData[0].close;
    let maximumPrice = minimumPrice;
    for (let i = 1; i < candleStickData.length; i++) {
      const price = candleStickData[i].close;
      if (price > maximumPrice) {
        maximumPrice = price;
      }
      if (price < minimumPrice) {
        minimumPrice = price;
      }
    }
    const lineWidth = 1;
    const minPriceLine = {
      price: minimumPrice,
      color: '#ef5350',
      lineWidth: lineWidth,
      lineStyle: LineStyle.Dashed,
      axisLabelVisible: true,
      title: 'min price',
    };
    const maxPriceLine = {
      price: maximumPrice,
      color: '#26a69a',
      lineWidth: lineWidth,
      lineStyle: LineStyle.Dashed,
      axisLabelVisible: true,
      title: 'max price',
    };

    mainSeries.createPriceLine(minPriceLine);
    mainSeries.createPriceLine(maxPriceLine);

    // Add marker
    mainSeries.setMarkers(markerData);

    chart.subscribeCrosshairMove((param) => {
      let priceFormatted = '';
      if (param.time) {
        const data = param.seriesData.get(areaSeries);
        const price = data.value !== undefined ? data.value : data.close;
        priceFormatted = price.toFixed(2);
      }
      legendRef.current.changePrice(priceFormatted);
    });

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      chart.remove();
    };
  }, [candleStickData, volumeData, markerData]);

  return (
    <>
      <div className="container" ref={chartContainerRef} />
      <Legends ref={legendRef} />
    </>
  );
};

export default Chart;
