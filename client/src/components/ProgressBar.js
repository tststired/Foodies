const ProgressBar = ({ completed }) => {

  const containerStyles = {
    height: 20,
    width: 200,
    backgroundColor: "#e0e0de",
    borderRadius: 50,
    margin: 10
  }

  const fillerStyles = {
    height: '100%',
    width: `${completed}%`,
    backgroundColor: "#b9ce38",
    borderRadius: 'inherit',
    textAlign: 'right',
    transition: 'width 1s ease-in-out',
  }

  const labelStyles = {
    padding: 5,
    color: 'white',
    fontWeight: 'bold'
  }

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        <span style={labelStyles}>{`${completed}%`}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
