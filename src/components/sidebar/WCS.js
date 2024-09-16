import React from 'react';
//WCS panel
const WCS = ({
    wcsalsname,
    setWcsalsname,
    wcsfilename,
    setWcsfilename,
    FilenameOptions,
    ALSnameOptions,
    setWcsdraw,
    setClearWCS,
    setCleargeoraster
}) => {
    const WCSdrawHandler = () => {
        setWcsdraw(true);
    };

    return (
        <div>
            <h3>Load by WCS</h3>
            <p>Please choose the ALS name:</p>
            <select value={wcsalsname} onChange={(e) => setWcsalsname(e.target.value)}>
                {ALSnameOptions.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <p>Please choose the file name:</p>
            <select value={wcsfilename} onChange={(e) => setWcsfilename(e.target.value)}>
                {FilenameOptions.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <p>Please draw the envelope</p>
            <button onClick={WCSdrawHandler}>Draw</button>
            <button onClick={() => {
                setClearWCS(true);
            }}>
                Clear
            </button>
        </div>
    );
};

export default WCS;
