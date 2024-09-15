import React, { useState } from 'react';

function Slider({ sliderValue, setSliderValue }) {
  const [value, setValue] = useState(sliderValue);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue); 
    setSliderValue(newValue); 
  };

  return (
    <div>
      <input type="range" min="1" max="3" value={value} onChange={handleChange} />
      <p>ALS_name: {value}</p>
    </div>
  );
}

export default Slider;
