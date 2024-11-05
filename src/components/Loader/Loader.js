import React from 'react';
import './Loader.css'; // Make sure to import the CSS file

const Loader = () => {
  return (
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Loader;
