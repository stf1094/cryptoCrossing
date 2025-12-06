import React from 'react'

function PriceItem(props) {
    return (
        <div className="price-item lg:py-4 sm:py-3 xs:py-2 xs:text-base xs:px-4">
          <div className="xs:basis-1/12">
            <span className="pl-2">{props.rank}</span>
          </div>
          <div className="flex-row xs:basis-3/12">
             <img className="price-table-coin-image" alt="coin-logo" src={props.image} />
             <span>{props.name}</span>
          </div>
            <div className="xs:basis-2/12 xs:text-right lg:text-left">
                <span>${
                  props.price > 1
                  ? props.price.toFixed(2)
                  : props.price < 1
                  ? props.price.toFixed(3)
                  : props.price < 0.001 
                  ? props.price.toFixed(7)
                  : props.price
                }</span>
            </div>
            <div className="xs:basis-2/12 xs:text-right lg:text-left">
               <span className={props.change > 0 ? 'green' : 'red'}>{props.change} %</span>
           </div>
           <div className="xs:basis-2/12 xs:text-right lg:text-left">
            <span className={props.change7 > 0 ? 'green' : 'red'}>{props.change7} %</span>
          </div>
          <div className="xs:basis-2/12 xs:text-right lg:text-left">
            <span className={props.change30 > 0 ? 'green' : 'red'}>{props.change30} %</span>
          </div>
        </div>
        
    )
}

export default PriceItem;