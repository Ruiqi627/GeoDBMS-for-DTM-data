import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

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
                        <button onClick={loadElevationChangeComponent}>Elevation change analysis</button>
                        <button onClick={loadCampaignComponent}>Campaign analysis</button>
                      </div>  
                    </div>
                )}
            </div>
    );
};

export default SpatioTemporalAnalysisModule;
