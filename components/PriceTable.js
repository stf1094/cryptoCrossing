"use client";
import React, { useMemo, useState } from 'react';
import PriceItem from './PriceItem';
import { ArrowLongDownIcon, ArrowLongUpIcon } from '@heroicons/react/24/solid';

function PriceTable(props) {
  const [sortField, setSortField] = useState("market_cap");
  const [sortOrder, setSortOrder] = useState("asc");
  const data = props.coins;

  // Derive the sorted view during render from props + sort state, so it
  // always tracks props.coins (e.g. switching pages) without an effect.
  const tableData = useMemo(() => {
    if (!data || sortField === "market_cap") return data;
    const dir = sortOrder === "asc" ? 1 : -1;
    return [...data].sort((a, b) => (a[sortField] > b[sortField] ? dir : -dir));
  }, [data, sortField, sortOrder]);

   const handleSort = (field) => {
      if (sortField === field) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortOrder("asc");
      }
  }

    return (
      <>
        <div className="xs:mx-3 md:m-0">
          <div className="price-table-header xs:px-4">
            <h5 onClick={() => handleSort("rank")} 
                className="xs:basis-1/12 pl-2 hover:cursor-pointer">
              {sortField === "rank" && sortOrder === "asc" ? 
               <>
               <ArrowLongUpIcon className="h-5 w-5 inline-block -ml-5" aria-hidden="true" />#
              </>
              :
              sortField === "rank" && sortOrder === "desc" ? 
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
            <h5 onClick={() => handleSort("change")} 
                className="xs:basis-2/12 xs:text-right lg:text-left hover:cursor-pointer">
              {sortField === "change" && sortOrder === "asc" ? 
               <>
               <ArrowLongUpIcon className="h-5 w-5 inline-block -ml-4" aria-hidden="true" />24hr
              </>
              :
              sortField === "change" && sortOrder === "desc" ? 
              <>
               <ArrowLongDownIcon className="h-5 w-5 -ml-4 inline-block" aria-hidden="true" />24hr
              </>
              : 
              <>
                24hr
              </>
              }
            </h5>
            <h5 onClick={() => handleSort("change7")} 
                className="xs:basis-2/12 xs:text-right lg:text-left hover:cursor-pointer">
              {sortField === "change7" && sortOrder === "asc" ? 
               <>
               <ArrowLongUpIcon className="h-5 w-5 inline-block -ml-4" aria-hidden="true" />7d
              </>
              :
              sortField === "change7" && sortOrder === "desc" ? 
              <>
               <ArrowLongDownIcon className="h-5 w-5 -ml-4 inline-block" aria-hidden="true" />7d
              </>
              : 
              <>
                7d
              </>
              }
            </h5>
            <h5 onClick={() => handleSort("change30")} 
                className="xs:basis-2/12 xs:text-right lg:text-left hover:cursor-pointer">
              {sortField === "change30" && sortOrder === "asc" ? 
               <>
               <ArrowLongUpIcon className="h-5 w-5 inline-block -ml-4" aria-hidden="true" />30d
              </>
              :
              sortField === "change30" && sortOrder === "desc" ? 
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
          { tableData && tableData.map((item, index) => <PriceItem key={index} id={item.id} image={item.image} name={item.name} rank={item.rank} price={item.price} change30={item.change30.toFixed(2)} change7={item.change7.toFixed(2)} change={item.change.toFixed(2)} />)}
          </div>
        </>
    )
}

export default PriceTable;