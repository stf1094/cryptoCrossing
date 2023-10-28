const PercentageBar = (props) => {
    const { bgColor, percent } = props;
  
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