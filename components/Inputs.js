import React from 'react';

function Inputs(props) {
    const [inputValue, setInputValue] = React.useState('');
    const [selectValue, setSelectValue] = React.useState('');
    const [coinIndex, setIndex] = React.useState(0);
    //const [name, setName] = React.useState('');
    
   //const handleName = (e) => console.log(e.target.id);
    const handleChange = (event) => setInputValue(event.target.value);

    const handleClick = () => {
        //const total = parseInt(inputValue) * selectedPrice
        props.seeValue(inputValue, selectValue, coinIndex);
        setInputValue('');
    
    }
    const handleSelectChange = (event) => {
      console.log(selectValue);
        setSelectValue(event.target.value);
        console.log(event.target.selectedIndex);
        const index = event.target.selectedIndex;
        setIndex(index);
        console.log(coinIndex);
       // console.log(props.coinsList[coinIndex]);
       // console.log(event.target[selectedIndex]);
        //console.log(parseInt())
       // setName(event.target.name);
       // console.log(selectValue);
    }
   //console.log(props.coinsList[coinIndex]);
   //console.log(Object.keys(props.coinsList));
   // console.log(props.coinsList);

    return (
        <div style={{display: "flex" }}>
          <select className="select-coin" value={selectValue} onChange={handleSelectChange}>
            { props.coinsList.map(item => <option label={item.id} value={item.current_price} key={item.id}>{item.id}</option>) }  
          </select>
          <input className="input-amount" type="text" value={inputValue} onChange={handleChange} />  
          <button id="button" onClick={handleClick}>Submit</button> 
        </div>
    )
}

export default Inputs;