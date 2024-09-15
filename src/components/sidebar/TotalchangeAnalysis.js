import React from 'react';

const TotalchangeAnalysis = ({
    wcsfilename,
    setWcsfilename,
    FilenameOptions,
    setCampaignAnalysis,
    setClearWCS,
    setCleargeoraster2
}) => {
    return (
        <div>
            <h3>Analyze the degree of the change</h3>

            <p>Please choose the file name:</p>
            <select value={wcsfilename} onChange={(e) => setWcsfilename(e.target.value)}>
                {FilenameOptions.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            <button onClick={() => setCampaignAnalysis(true)}>Analysis</button>
            <button onClick={() => {
                setClearWCS(true);
                setCleargeoraster2(true);
            }}>
                Clear
            </button>
        </div>
    );
};

export default TotalchangeAnalysis;
