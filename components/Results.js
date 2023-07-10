import React, {useRef, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteACoin } from '../store/actions/portfolioAction';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import DeleteCoinModal from './DeleteCoinModal';


function Results({setModalAmount, setModalCoin, setModalCoinId, openUpdateModal}) {
  const {portfolio, total} = useSelector((state) => state.portfolio);
  const [showDeleteCoinModal, setShowDeleteCoinModal] = useState(false);
  const [coinToDeleteId, setCoinToDeleteId] = useState('');
  const [coinToDeleteName, setCoinToDeleteName] = useState('');
  const [coinToDeleteAmount, setCoinToDeleteAmount] = useState('');
  const dispatch = useDispatch();
  const inputAmount = useRef();

  const openDeleteModal = (id, name, amount) => {
    setCoinToDeleteId(id);
    setCoinToDeleteName(name);
    setCoinToDeleteAmount(amount);
    setShowDeleteCoinModal(prev => !prev);
    console.log('clicked');
  }
  const handleUpdateClick = (amount, name, id) => {
     //console.log(e.target.parentElement.parentElement.id);
     // console.log(inputAmount);
     //console.log(e.target.parentElement.previousSibling.previousSibling.previousSibling.innerHTML);
    // const id = e.target.parentElement.parentElement.id;
     //const amount = e.target.parentElement.previousSibling.previousSibling.previousSibling.firstChild.nextSibling.firstChild.nextSibling.firstChild.innerHTML;
     //const coin = e.target.parentElement.previousSibling.previousSibling.previousSibling.firstChild.nextSibling.firstChild.innerHTML;
     setModalAmount(amount);
     setModalCoin(name);
     setModalCoinId(id);
     openUpdateModal();
  }
  const handleRemove = (id) => {
    console.log("remove coin");
    dispatch(deleteACoin(id))
  }
    return (
      <>
        <div className="">
        <DeleteCoinModal showDeleteCoinModal={showDeleteCoinModal} 
          setShowDeleteCoinModal={setShowDeleteCoinModal} 
          coinToDeleteId={coinToDeleteId} 
          coinToDeleteName={coinToDeleteName} 
          coinToDeleteAmount={coinToDeleteAmount} 
        />
        { portfolio && portfolio.map((item, index) => 
             <div id={item.id} className="coin-row border border-slate-400 hover:border-sky-300 hover:bg-sky-50" key={item.id}>
                <div className="coin-title-group">
                    <img src={item.img} alt="coin-logo" className="coin-image" />
                    <div className="coin-title-amount">
                      <span className="coin-title">{item.name}</span>
                      <div>
                         <span ref={inputAmount} className="coin-amount">{item.amount}</span>
                         <span className="coin-symbol">{item.symbol.toUpperCase()}</span>
                      </div>
                   </div>
                </div>
                <span className="coin-price">${item.currentPrice}</span>
                <span className="coin-total-amount">${item.value.toFixed(2)}</span>
                <div className="button-group mt-q flex flex-row">
                  <PencilSquareIcon className="h-8 w-8 mr-3 hover:cursor-pointer hover:text-sky-400" aria-hidden="true" onClick={() => handleUpdateClick(item.amount, item.name, item.id)} />
                  <TrashIcon className="h-8 w-8 hover:cursor-pointer hover:text-red-400" aria-hidden="true" onClick={() => openDeleteModal(item.id, item.name, item.amount)} />
                  {/*  <span className="" onClick={handleUpdateClick}>edit</span>
                   <span className="" onClick={() => deleteACoin(item.id)}>cancel</span> */}
                </div>
             </div>
        )}
         {/*    <div className="total-container">
                <div className="flex-row justify-content-center light-blue-text">
                  {total ? 
                 <></> : 
                  <div className="flex-column">
                    <h1>Create your Portfolio</h1>
                    <button className="btn btn-gradient mb-2" onClick={openAddCoinModal}>Let's Go</button>
                  </div> 
                  }  
                </div>
            </div> */}
            </div>
        </>
    )
}

export default Results;