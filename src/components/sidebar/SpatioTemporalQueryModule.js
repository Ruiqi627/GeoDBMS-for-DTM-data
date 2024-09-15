import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const SpatioTemporalQueryModule = ({
   setPopupType,setIsPopupVisible
}) => {
	 const loadTimeComponent = () => {
        setPopupType('time');
        setIsPopupVisible(true);
    };

    const loadGeometryComponent = () => {
        setPopupType('geometry');
        setIsPopupVisible(true);
    };
	
	const [isAModuleExpanded2, setIsAModuleExpanded2] = useState(false);
	const toggleAModule2 = () => setIsAModuleExpanded2(!isAModuleExpanded2);
	
	
	
    return (
        <div className="module">
            <div className="module-header" onClick={toggleAModule2}>Spatio-temporal query module</div>
            {isAModuleExpanded2 && (
                <div className="module-content">
                 <div className="sub-module">
                    <button onClick={loadTimeComponent}>Temporal queries</button>
                    <button onClick={loadGeometryComponent}>Spatial queries</button>
                </div>
                </div>
            )}
        </div>
    );
};

export default SpatioTemporalQueryModule;
