"use client";
import React from 'react';
import PriceItem from './PriceItem';
import { useState } from 'react';
import { ArrowLongDownIcon, ArrowLongUpIcon } from '@heroicons/react/24/solid';

function PriceTable(props) {
  const [tableData, setTableData] = useState(props.coins);
  const [sortField, setSortField] = useState("market_cap");
  const [sortOrder, setSortOrder] = useState("asc");
  const data = props.coins;

  const handleSort = (field) => {
   const newdata = [...data].sort((a, b) => 
   // a[field].
    a[field] > b[field] ? 1 * (sortOrder === "asc" ? 1 : -1) : -1 * (sortOrder === "asc" ? 1 : -1));
    setSortField(field);
    setSortOrder((sortOrder === "asc" ? "desc" : "asc")); 
    console.log(sortOrder);
    setTableData(newdata);
  }

    return (
      <>
        <div className="xs:mx-3 md:m-0">
          <div className="price-table-header xs:px-4">
            <h5 onClick={() => handleSort("market_cap_rank")} 
                className="xs:basis-1/12 pl-2 hover:cursor-pointer">
              {sortField === "market_cap_rank" && sortOrder === "asc" ? 
               <>
               <ArrowLongUpIcon className="h-5 w-5 inline-block -ml-5" aria-hidden="true" />#
              </>
              :
              sortField === "market_cap_rank" && sortOrder === "desc" ? 
              <>
               <ArrowLongDownIcon className="h-5 w-5 -ml-5 inline-block" aria-hidden="true" />#
              </>
              : 
              <>
                #
              </>
              }
            </h5>
            <h5 className="xs:basis-3/12 text-left">Coin</h5>
            <h5 className="xs:basis-2/12 xs:text-right lg:text-left">Price</h5>
            <h5 onClick={() => handleSort("price_change_percentage_24h")} 
                className="xs:basis-2/12 xs:text-right lg:text-left hover:cursor-pointer">
              {sortField === "price_change_percentage_24h" && sortOrder === "asc" ? 
               <>
               <ArrowLongUpIcon className="h-5 w-5 inline-block -ml-4" aria-hidden="true" />24hr
              </>
              :
              sortField === "price_change_percentage_24h" && sortOrder === "desc" ? 
              <>
               <ArrowLongDownIcon className="h-5 w-5 -ml-4 inline-block" aria-hidden="true" />24hr
              </>
              : 
              <>
                24hr
              </>
              }
            </h5>
            <h5 onClick={() => handleSort("price_change_percentage_7d_in_currency")} 
                className="xs:basis-2/12 xs:text-right lg:text-left hover:cursor-pointer">
              {sortField === "price_change_percentage_7d_in_currency" && sortOrder === "asc" ? 
               <>
               <ArrowLongUpIcon className="h-5 w-5 inline-block -ml-4" aria-hidden="true" />7d
              </>
              :
              sortField === "price_change_percentage_7d_in_currency" && sortOrder === "desc" ? 
              <>
               <ArrowLongDownIcon className="h-5 w-5 -ml-4 inline-block" aria-hidden="true" />7d
              </>
              : 
              <>
                7d
              </>
              }
            </h5>
            <h5 onClick={() => handleSort("price_change_percentage_30d_in_currency")} 
                className="xs:basis-2/12 xs:text-right lg:text-left hover:cursor-pointer">
              {sortField === "price_change_percentage_30d_in_currency" && sortOrder === "asc" ? 
               <>
               <ArrowLongUpIcon className="h-5 w-5 inline-block -ml-4" aria-hidden="true" />30d
              </>
              :
              sortField === "price_change_percentage_30d_in_currency" && sortOrder === "desc" ? 
              <>
               <ArrowLongDownIcon className="h-5 w-5 -ml-4 inline-block" aria-hidden="true" />30d
              </>
              : 
              <>
                30d
              </>
              }
            </h5>
          </div>
          { tableData && tableData.map((item, index) => <PriceItem key={index} id={item.id} image={item.image} name={item.name} rank={item.market_cap_rank} price={item.current_price} change30={item.price_change_percentage_30d_in_currency.toFixed(2)} change7={item.price_change_percentage_7d_in_currency.toFixed(2)} change={item.price_change_percentage_24h.toFixed(2)} />) }
        </div>
        </>
    )
}

export default PriceTable;