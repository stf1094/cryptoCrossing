import React, {useRef, useState, Suspense} from 'react';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { deleteACoin } from '../store/actions/portfolioAction';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import DeleteCoinModal from './DeleteCoinModal';
import PercentageBar from './PercentageBar';
import PercentageBarLoading from './PercentageBarLoading';
import { ArrowLongDownIcon, ArrowLongUpIcon } from '@heroicons/react/24/solid';
import LoadingState from './LoadingState';

function Results({setModalAmount, setModalCoin, setModalCoinId, openUpdateModal, overallTotal}) {
  const {portfolio, total} = useSelector((state) => state.portfolio);
  const {market} = useSelector((state) => state.market);
  const [showDeleteCoinModal, setShowDeleteCoinModal] = useState(false);
  const [coinToDeleteId, setCoinToDeleteId] = useState('');
  const [coinToDeleteName, setCoinToDeleteName] = useState('');
  const [coinToDeleteAmount, setCoinToDeleteAmount] = useState('');
  const dispatch = useDispatch();
  const portfolioLoading = !portfolio && !market && !total;
  const inputAmount = useRef();
  let newPortfolio = [];

  market && portfolio && portfolio.forEach((pItem) => {
    market.forEach((mItem) => {
      if (mItem.name === pItem.name) {
        newPortfolio.push({ change24h: mItem.change, coin: pItem});
      }
    })
  });
  const openDeleteModal = (id, name, amount) => {
    setCoinToDeleteId(id);
    setCoinToDeleteName(name);
    setCoinToDeleteAmount(amount);
    setShowDeleteCoinModal(prev => !prev);
  }
  const handleUpdateClick = (amount, name, id) => {
     setModalAmount(amount);
     setModalCoin(name);
     setModalCoinId(id);
     openUpdateModal();
  }
  const handleRemove = (id) => {
    dispatch(deleteACoin(id))
  }
  /* if (portfolioLoading) {
    return <LoadingState />;
  } */
    return (
      <>
        <div className="">
        <DeleteCoinModal showDeleteCoinModal={showDeleteCoinModal} 
          setShowDeleteCoinModal={setShowDeleteCoinModal} 
          coinToDeleteId={coinToDeleteId} 
          coinToDeleteName={coinToDeleteName} 
          coinToDeleteAmount={coinToDeleteAmount} 
        />
       
        {newPortfolio.length > 0 &&
        <div className="flex-row justify-between mx-2 mt-4 mb-1 px-6 py-3 bg-ink text-white items-center text-left rounded-t-xl font-mono text-xs uppercase tracking-[0.12em]">
            <span className="xs:basis-2/12">Coin</span>
            <div className="xs:basis-2/12 sm:text-left">
              <span className="md:ml-10 lg:ml-8">Price</span>
            </div>
            <div className="xs:basis-2/12 sm:text-left">
              <span className="md:ml-6">24h%</span>
            </div>
            <div className="xs:basis-4/12 sm:text-left">
              <span className="md:ml-6">Value</span>
            </div>
           <span className="xs:basis-1/12"></span>
        </div>
        }
         { newPortfolio && newPortfolio.map((item, index) => 
             <div id={item.coin.id} className="coin-row border border-slate-200 hover:border-teal hover:bg-teal/5" key={item.coin.id}>
                <div className="coin-title-group">
                    <Image src={item.coin.img} alt="coin-logo" className="h-12 w-12 mt-1" width={48} height={48} />
                    <div className="coin-title-amount">
                      <span className="coin-title">{item.coin.name}</span>
                      <div>
                         <span ref={inputAmount} className="coin-amount">{item.coin.amount}</span>
                         <span className="coin-symbol">{item.coin.symbol.toUpperCase()}</span>
                      </div>
                   </div>
                </div>
                <div className="xs:basis-2/12 sm:text-left">
                  <span className="coin-price ml-4 font-mono tabular-nums">${item.coin.currentPrice}</span>
                </div>
                <div className="xs:basis-2/12 sm:text-left">
                  <span className={item.change24h > 0 ? 'green' : 'red'}>
                    {item.change24h > 0 ? <ArrowLongUpIcon className="h-5 w-5 inline-block"/> : <ArrowLongDownIcon className="h-5 w-5 inline-block"/>}
                    {item.change24h.toFixed(2)}%
                    </span>
                </div>
                <div className="xs:basis-4/12 sm:text-left">
                  <span className="coin-total-amount font-mono tabular-nums">${item.coin.value.toFixed(2)}</span>
                  {item && Number(item.coin.value / total * 100).toFixed(1) <= 100 ? <PercentageBar bgColor='orange' percent={Number(item.coin.value / total * 100).toFixed(1)} /> : <PercentageBarLoading />}
                </div>
                <div className="button-group mt-q flex flex-row">
                  <PencilSquareIcon className="xs:h-6 xs:w-6 sm:h-8 sm:w-8 mr-3 hover:cursor-pointer hover:text-sky-400" aria-hidden="true" onClick={() => handleUpdateClick(item.coin.amount, item.coin.name, item.coin.id)} />
                  <TrashIcon className="xs:h-6 xs:w-6 sm:h-8 sm:w-8 hover:cursor-pointer hover:text-red-400" aria-hidden="true" onClick={() => openDeleteModal(item.coin.id, item.coin.name, item.coin.amount)} />
                </div>
             </div>
        )}
    
        </div>
        </>
    )
}

export default Results;