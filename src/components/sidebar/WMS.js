import React from 'react';
import Slider from './Slider';

const WMS = ({
    wmsfilename,
    setWmsfilename,
    FilenameOptions,
    sliderValue,
    setSliderValue,
    setClearWMS
}) => {
    return (
        <div>
            <h3>Load by WMS</h3>
            <p>Please choose the file name:</p>
            <select value={wmsfilename} onChange={(e) => setWmsfilename(e.target.value)}>
                {FilenameOptions.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <p>Please move the slider</p>
            <Slider sliderValue={sliderValue} setSliderValue={setSliderValue}/>
            <button onClick={() => setClearWMS(true)}>Clear</button>
        </div>
    );
};

export default WMS;
