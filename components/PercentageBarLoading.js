import React from 'react';
const PercentageBarLoading = () => {
    // const { bgColor, percent } = props;
  
    const containerStyles = {
      height: 24,
      width: '100%',
      backgroundColor: "#e0e0de",
      borderRadius: 5,
    }
  
    const fillerStyles = {
      height: '100%',
      width: '100%',
      backgroundColor: '#e0e0de',
      textAlign: 'right',
    }
  
    const labelStyles = {
      color: 'white',
      fontWeight: 'bold',
    }
  
    return (
      <div style={containerStyles}>
        <div className="animate-bar">
        {/* style={fillerStyles} */}
         {/*  <span style={labelStyles}>{`${percent}%`}</span> */}
        </div>
      </div>  
    );
  };
  
  export default PercentageBarLoading;