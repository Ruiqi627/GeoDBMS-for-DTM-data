import React from 'react';

const Resample = ({
    resampleALS,
    setResampleALS,
    resamplefile,
    setResamplefile,
    FilenameOptions,
    ALSnameOptions,
    specificvalue,
    setSpecificvalue,
    ResamplespecificvalueOptions,
    setClearResample
}) => {
    return (
        <div>
            <h3>Specific value resampling</h3>

            <p>Please choose the ALS name</p>
            <select value={resampleALS} onChange={(e) => setResampleALS(e.target.value)}>
                {ALSnameOptions.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            <p>Please choose the file name</p>
            <select value={resamplefile} onChange={(e) => setResamplefile(e.target.value)}>
                {FilenameOptions.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            <p>Please choose the specific value resampling method</p>
            <select value={specificvalue} onChange={(e) => setSpecificvalue(e.target.value)}>
                {ResamplespecificvalueOptions.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            <button onClick={() => setClearResample(true)}>Clear</button>
        </div>
    );
};

export default Resample;
