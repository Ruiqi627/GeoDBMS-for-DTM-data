import React, {
	useState,
	useContext
} from 'react';
import { AppContext } from '../../context/AppContext';

const ManagementModule = ({
	isPopupVisible2,
	setIsPopupVisible2,
	setPopupType,
	setIsPopupVisible
}) => {
	const {
		setALS_1,
		setALS_2,
		setALS_3,
		setLoadWMS,
		setLoadWCS,
		setALS_pop,
		setAls_1boundary
	} = useContext(AppContext);

	const [isAModuleExpanded, setIsAModuleExpanded] = useState(false);
	const [isALSLoaded, setIsALSLoaded] = useState(false);
	const [checkboxState, setCheckboxState] = useState({
		checkbox1: false,
		checkbox2: false,
		checkbox3: false,
	});

	const toggleAModule = () => setIsAModuleExpanded(!isAModuleExpanded);

	const loadALS = () => setIsALSLoaded(!isALSLoaded);

	const handleCheckboxChange = (checkbox) => {
		const newCheckboxState = {
			...checkboxState,
			[checkbox]: !checkboxState[checkbox],
		};
		setCheckboxState(newCheckboxState);

		const isChecked = !checkboxState[checkbox];

		if(isChecked) {
			setIsPopupVisible2(true);
		} else {
			setIsPopupVisible2(false);
			setAls_1boundary('');
		}

		if(isALSLoaded) {
			if(checkbox === 'checkbox1') {
				setALS_1(isChecked);
				setALS_pop("ALS_1");
			} else if(checkbox === 'checkbox2') {
				setALS_2(isChecked);
				setALS_pop("ALS_2");
			} else if(checkbox === 'checkbox3') {
				setALS_3(isChecked);
				setALS_pop("ALS_3");
			}
		}
	};

	const loadWMSHandler = () => {
		setPopupType('wms');
		setIsPopupVisible(true);
		setLoadWMS(true);
	};

	const loadWCSHandler = () => {
		setPopupType('wcs');
		setIsPopupVisible(true);
	};

	return(
		<div className="module">
            <div className="module-header" onClick={toggleAModule}>
                Management module
            </div>
            {isAModuleExpanded && (
                <div className="module-content">
                    <div className="sub-module">
                        <button onClick={loadALS}>Load ALS</button>
                        {isALSLoaded && (
                            <div>
                                <div className="checkbox">
                                    <input
                                        type="checkbox"
                                        id="checkbox1"
                                        checked={checkboxState.checkbox1}
                                        onChange={() => handleCheckboxChange('checkbox1')}
                                    />
                                    <label htmlFor="checkbox1">ALS_1</label>
                                </div>
                                <div className="checkbox">
                                    <input
                                        type="checkbox"
                                        id="checkbox2"
                                        checked={checkboxState.checkbox2}
                                        onChange={() => handleCheckboxChange('checkbox2')}
                                    />
                                    <label htmlFor="checkbox2">ALS_2</label>
                                </div>
                                <div className="checkbox">
                                    <input
                                        type="checkbox"
                                        id="checkbox3"
                                        checked={checkboxState.checkbox3}
                                        onChange={() => handleCheckboxChange('checkbox3')}
                                    />
                                    <label htmlFor="checkbox3">ALS_3</label>
                                </div>
                            </div>
                        )}
                    </div>
                    <button onClick={loadWMSHandler}>Load by WMS</button>
                    <button onClick={loadWCSHandler}>Load by WCS</button>
                </div>
            )}
        </div>
	);
};

export default ManagementModule;