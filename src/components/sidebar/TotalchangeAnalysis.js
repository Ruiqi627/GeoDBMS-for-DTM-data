import React from 'react';
//Calculate the total change
const TotalchangeAnalysis = ({
    totalchangeanalysisfile,
    setTotalchangeanalysisfile,
    FilenameOptions,
    setCampaignAnalysis,
    setClearTotalchange,
    setCleargeoraster2
}) => {
    return (
        <div>
            <h3>Analyze the total change</h3>

            <p>Please choose the file name:</p>
            <select value={totalchangeanalysisfile} onChange={(e) => setTotalchangeanalysisfile(e.target.value)}>
                {FilenameOptions.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            <button onClick={() => setCampaignAnalysis(true)}>Analysis</button>
            <button onClick={() => {
                setClearTotalchange(true);
                setCleargeoraster2(true);
            }}>
                Clear
            </button>
        </div>
    );
};

export default TotalchangeAnalysis;
