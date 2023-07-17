import React from 'react';
import PriceItem from './PriceItem';

function HomePriceTable(props) {

    return (
      <>
        <div className="">
          <div className="flex flex-row rounded-t-xl mx-auto max-w-5xl py-6 font-bold text-white bg-gradient-to-r from-blue-700 to-blue-600 xs:px-4">
            <h5 className="xs:basis-1/12 pl-2">#</h5>
            <h5 className="xs:basis-3/12 text-left">Coin</h5>
            <h5 className="xs:basis-2/12 xs:text-right lg:text-left">Price</h5>
            <h5 className="xs:basis-2/12 xs:text-right lg:text-left">24hr</h5>
            <h5 className="xs:basis-2/12 xs:text-right lg:text-left">7d</h5>
            <h5 className="xs:basis-2/12 xs:text-right lg:text-left">30d</h5>
          </div>
          { props.coins.map((item, index) => <PriceItem key={index} id={item.id} image={item.image} name={item.name} rank={item.market_cap_rank} price={item.current_price} change30={item.price_change_percentage_30d_in_currency.toFixed(2)} change7={item.price_change_percentage_7d_in_currency.toFixed(2)} change={item.price_change_percentage_24h.toFixed(2)} />) }
        </div>
        </>
    )
}

export default HomePriceTable;