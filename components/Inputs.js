import React from 'react';

function Inputs(props) {
    const [inputValue, setInputValue] = React.useState('');
    const [selectValue, setSelectValue] = React.useState('');
    const [coinIndex, setIndex] = React.useState(0);

    const handleChange = (event) => setInputValue(event.target.value);

    const handleClick = () => {
        //const total = parseInt(inputValue) * selectedPrice
        props.seeValue(inputValue, selectValue, coinIndex);
        setInputValue('');
    
    }
    const handleSelectChange = (event) => {
        setSelectValue(event.target.value);
        const index = event.target.selectedIndex;
        setIndex(index);
    }

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