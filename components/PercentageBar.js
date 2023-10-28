import React from 'react';
const PercentageBar = ({bgColor, percent}) => {
    // const { bgColor, percent } = props;
    let width = false;
    if (percent > 25) {
      width = true;
    }
    const containerStyles = {
      height: 24,
      width: '100%',
      backgroundColor: "#e0e0de",
      borderRadius: 5,
    }
  
    const fillerStyles = {
      height: '100%',
      width: `${percent}%`,
      backgroundColor: bgColor,
      textAlign: 'right'
    }
    
    const labelStyles = {
      color: 'white',
      fontWeight: 'bold',
      position: 'relative',
      bottom: 2,
      marginRight: width ? 5 : 0,
      marginLeft: width ? 0 : 5
    }
  
    return (
      <div style={containerStyles}>
        <div style={fillerStyles}>
          <span style={labelStyles}>{`${percent}%`}</span>
        </div>
      </div>  
    );
  };
  
  export default PercentageBar;