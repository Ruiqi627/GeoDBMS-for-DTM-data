import React, { useState } from 'react';

const TemporalQuery = ({
    queryDate,
    setQueryDate,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    setClearDate
}) => {
    const [queryMode, setQueryMode] = useState('');

    return (
        <div>
            <h3>Temporal queries</h3>
            <p>Select query mode:</p>
            <button onClick={() => setQueryMode('single')}>Query by single time</button>
            <button onClick={() => setQueryMode('period')}>Query by time period</button>

            {queryMode === 'single' && (
                <div>
                    <p>Please enter the query date</p>
                    <input
                        placeholder="Please enter the query date"
                        value={queryDate}
                        onChange={(e) => setQueryDate(e.target.value)}
                    />
                </div>
            )}

            {queryMode === 'period' && (
                <div>
                    <p>Please enter the start date</p>
                    <input
                        placeholder="Please enter the start date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <p>Please enter the end date</p>
                    <input
                        placeholder="Please enter the end date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            )}

            <button
                onClick={() => {
                    setQueryDate(''); 
                    setStartDate('');   
                    setEndDate('');    
                    setClearDate(true); 
                }}
            >
                Clear
            </button>
        </div>
    );
};

export default TemporalQuery;
