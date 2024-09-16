import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
//Spatio-Temporal Analysis Module
const SpatioTemporalAnalysisModule = ({
   setPopupType,setIsPopupVisible
}) => {
	const loadElevationChangeComponent = () => {
        setPopupType('elevation');
        setIsPopupVisible(true);
    };
	
	    const loadCampaignComponent = () => {
        setPopupType('campaign');
        setIsPopupVisible(true);
    };
    
     const [isAModuleExpanded3, setIsAModuleExpanded3] = useState(false);
     const toggleAModule3 = () => setIsAModuleExpanded3(!isAModuleExpanded3);
	
	
	
    return (
       <div className="module" >
                <div className="module-header" onClick={toggleAModule3}>Spatio-temporal analysis module</div>
                {isAModuleExpanded3 && (
                    <div className="module-content">
                     <div className="sub-module">
                        <button onClick={loadElevationChangeComponent}>Elevation change comparison</button>
                        <button onClick={loadCampaignComponent}>Total change</button>
                      </div>  
                    </div>
                )}
            </div>
    );
};

export default SpatioTemporalAnalysisModule;
