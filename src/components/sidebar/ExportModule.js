import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const ExportModule = ({
   setPopupType,setIsPopupVisible,setIsPopupVisible3
}) => {
	    const loadExportComponent = () => {
        setPopupType('export');
        setIsPopupVisible3(true);
    };



    const loadResampleComponent = () => {
        setPopupType('resample');
        setIsPopupVisible(true);
    };
     const [isAModuleExpanded4, setIsAModuleExpanded4] = useState(false);
     const toggleAModule4 = () => setIsAModuleExpanded4(!isAModuleExpanded4);
	
	
    return (

 <div className="module" >
                <div className="module-header" onClick={toggleAModule4}>Export module</div>
                {isAModuleExpanded4 && (
                    <div className="module-content">
                     <div className="sub-module">
                    	<button onClick={loadResampleComponent}>Resample</button>
                        <button onClick={loadExportComponent}>Export module</button>
                    </div>
                    </div>
                )}
            </div>
    );
};

export default ExportModule;
