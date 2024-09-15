import React from 'react';

const ElevationchangeComparison = ({
    wcsalsname,
    setWcsalsname,
    wcsalsname2,
    setWcsalsname2,
    wcsfilename,
    setWcsfilename,
    FilenameOptions,
    ALSnameOptions,
    setAnalysis,
    setClearWCS,
    setCleargeoraster,
    analysisALS1,
    setAnalysisALS1,
    setAnalysisALS2,
    analysisALS2,
    analysisfile,
    setAnalysisfile,
    setClearAnalysis
    
}) => {
    return (
        <div>
            <h3>Elevation change analysis</h3>

            <p>Please choose the first ALS name</p>
            <select value={analysisALS1} onChange={(e) => setAnalysisALS1(e.target.value)}>
                {ALSnameOptions.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            <p>Please choose the second ALS name</p>
            <select value={analysisALS2} onChange={(e) => setAnalysisALS2(e.target.value)}>
                {ALSnameOptions.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            <p>Please choose the file name:</p>
            <select value={analysisfile} onChange={(e) => setAnalysisfile(e.target.value)}>
                {FilenameOptions.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            <button onClick={() => setAnalysis(true)}>Analysis</button>
            <button onClick={() => {
                setClearAnalysis(true);
                setCleargeoraster(true);
            }}>
                Clear
            </button>
        </div>
    );
};

export default ElevationchangeComparison;
