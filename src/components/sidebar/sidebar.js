import React, {
	useState,
	useContext,
	useEffect
} from 'react';
import './sidebar.css';
import { AppContext } from '../../context/AppContext';
import ManagementModule from './ManagementModule';
import SpatioTemporalQueryModule from './SpatioTemporalQueryModule';
import SpatioTemporalAnalysisModule from './SpatioTemporalAnalysisModule';

import ExportModule from './ExportModule';
import PopupContent2 from './PopupContent2';

import WMS from './WMS'; 
import WCS from './WCS'; 
import TemporalQuery from './TemporalQuery';
import SpatialQuery from './SpatialQuery';
import ElevationchangeComparison from './ElevationchangeComparison';
import TotalchangeAnalysis from './TotalchangeAnalysis'; 
import Resample from './Resample';
import Export from './Export';

//Define the sidebar which includes ManagementModule,SpatioTemporalQueryModule,SpatioTemporalAnalysisModule,ExportModule
const Sidebar = () => {
 const {
        // Temporal Query Parameters
        queryDate,
        startDate,
        endDate,
        setQueryDate,
        setStartDate,
        setEndDate,
        setClearDate,

        // Spatial Query Parameters
        pointQuery,
        setPointQuery,
        setClearPoint,
        polygonQuery,
        setPolygonQuery,
        setClearPolygon,
        setElevationname,

        // Analysis Parameters
        setAls_name1,
        setAls_name2,
        setAnalysis,
        ALS_pop,
        setALS_pop,
        setAls_1boundary,
        als_1data,
        setAls_1data,
        setALS_1update,
        setRefreshKey,
        analysisALS1,
    	setAnalysisALS1,
    	setAnalysisALS2,
    	analysisALS2,
    	analysisfile,
    	setAnalysisfile,

        // Export Parameters
        exportname,
        setExportname,
        format,
        setFormat,
        tilesize,
        setTilesize,
        exportresamplemethod,
        setExportresamplemethod,
        exportALS,
        setExportALS,
        setResolution,
        setSavepath,
        setExportfile,

        // Resample Parameters
        resamplesize,
        resamplefile,
        setResamplefile,
        resampleALS,
        setResampleALS,
        setResamplesize,
        setMinimumresample,
        setMaximumresample,
        setMeanresample,
        specificvalue,
        setSpecificvalue,
        setClearResample,

        // File Management Parameters
        wmsfilename,
        setWmsfilename,
        wcsfilename,
        setWcsfilename,
        wcsalsname,
        setWcsalsname,
        wcsalsname2,
        setWcsalsname2,
        setWcsdraw,

        // General Parameters
        ALS_1,
        setALS_1,
        setALS_2,
        setALS_3,
        setLoadWMS,
        setLoadWCS,
        setCampaignAnalysis,
        sliderValue,
        setSliderValue,
        setClearWMS,
        setClearWCS,
        setCleargeoraster,
        setCleargeoraster2,
        
        setClearAnalysis,
        setClearTotalchange,
        totalchangeanalysisfile,
        setTotalchangeanalysisfile
    } = useContext(AppContext);


	const [isPopupVisible, setIsPopupVisible] = useState(false);
	const [isPopupVisible2, setIsPopupVisible2] = useState(false);
	const [popupType, setPopupType] = useState('');

	const closePopup = () => {
		setIsPopupVisible(false);
		setPopupType('');
	};
	const closePopup2 = () => {
		setIsPopupVisible2(false);
		setPopupType('');
	};


	const FilenameOptions = [
		'--Please choose--',
		'32457_5427.tif',
		'32457_5428.tif',
		'32457_5429.tif',
		'32458_5427.tif',
		'32458_5428.tif',
		'32458_5429.tif'
	];
	const ALSnameOptions = [
		'--Please choose--',
		'ALS_1',
		'ALS_2',
		'ALS_3'
	];
	const ResamplesizeOptions = [
		'--Please choose--',
		'0.25x0.25 m',
		'1x1 m',
		'5x5 m'
	];
	const ResamplespecificvalueOptions = [
		'--Please choose--',
		'min',
		'mean',
		'max'
	];

	const ResamplemethodOptions = [
		'--Please choose--',
		'NearestNeighbor ',
		'Bilinear',
		'min',
		'mean',
		'max'
	];

	const ExportformatOptions = [
		'--Please choose--',
		'GeoTIFF',
		'XYZ',
		'LAZ'
	];

	const ExporttileOptions = [
		'--Please choose--',
		'1',
		'4',
		'16'
	];

	return(
		<div className="sidebar">
            <img src="/KIT.png" className="sidebar-image" alt="KIT" />
            <ManagementModule 
                isPopupVisible2={isPopupVisible2} 
                setIsPopupVisible2={setIsPopupVisible2}
                setPopupType={setPopupType}
                setIsPopupVisible={setIsPopupVisible}
            />
           <SpatioTemporalQueryModule 
                setPopupType={setPopupType}
                setIsPopupVisible={setIsPopupVisible}
            />
             <SpatioTemporalAnalysisModule 
                setPopupType={setPopupType}
                setIsPopupVisible={setIsPopupVisible}
            />
              <ExportModule 
                setPopupType={setPopupType}
                setIsPopupVisible={setIsPopupVisible}
                setIsPopupVisible3={setIsPopupVisible}
            />
           
            {isPopupVisible && (
               <div className={`popup ${popupType === 'export' ? 'popup3' : ''}`}>
                    <div className="popup-content">
                        <span className="close" onClick={closePopup}>&times;</span>
						 {popupType === 'time' && (
                <TemporalQuery
                    queryDate={queryDate}
                    setQueryDate={setQueryDate}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    setClearDate={setClearDate}
                />
            )}
						 
			 {popupType === 'geometry' && (
                  <SpatialQuery
                    pointQuery={pointQuery} setPointQuery={setPointQuery}
                    setClearPoint={setClearPoint}
                    polygonQuery={polygonQuery} setPolygonQuery={setPolygonQuery}
                    setClearPolygon={setClearPolygon}
                />
            )}
			 
			 
			  {popupType === 'elevation' && (
                   <ElevationchangeComparison
                    wcsalsname={wcsalsname} setWcsalsname={setWcsalsname}
                    wcsalsname2={wcsalsname2} setWcsalsname2={setWcsalsname2}
                    wcsfilename={wcsfilename} setWcsfilename={setWcsfilename}
                    FilenameOptions={FilenameOptions} ALSnameOptions={ALSnameOptions}
                    setAnalysis={setAnalysis} setClearWCS={setClearWCS}
                    setCleargeoraster={setCleargeoraster}
                    analysisALS1={analysisALS1}
                    analysisALS2={analysisALS2}
					setAnalysisALS1={setAnalysisALS1}
					setAnalysisALS2={setAnalysisALS2}
					analysisfile={analysisfile}
    				setAnalysisfile={setAnalysisfile}
    				setClearAnalysis={setClearAnalysis}
                />
            )}
			  
			   {popupType === 'export' && (
                  <Export
                    exportALS={exportALS} setExportALS={setExportALS}
                    exportname={exportname} setExportname={setExportname}
                    format={format} setFormat={setFormat}
                    exportresamplemethod={exportresamplemethod} setExportresamplemethod={setExportresamplemethod}
                    resamplesize={resamplesize} setResamplesize={setResamplesize}
                    tilesize={tilesize} setTilesize={setTilesize}
                    setSavepath={setSavepath} setExportfile={setExportfile}
                    ALSnameOptions={ALSnameOptions} FilenameOptions={FilenameOptions}
                    ExportformatOptions={ExportformatOptions}
                    ResamplemethodOptions={ResamplemethodOptions}
                    ResamplesizeOptions={ResamplesizeOptions}
                    ExporttileOptions={ExporttileOptions}
                />
            )}
			   
			    {popupType === 'campaign' && (
                  <TotalchangeAnalysis
                    totalchangeanalysisfile={totalchangeanalysisfile} setTotalchangeanalysisfile={setTotalchangeanalysisfile}
                    FilenameOptions={FilenameOptions}
                    setCampaignAnalysis={setCampaignAnalysis}
                    setClearTotalchange={setClearTotalchange} setCleargeoraster2={setCleargeoraster2}
                />
            )}
			    
			     {popupType === 'resample' && (
                 <Resample
                    resampleALS={resampleALS} setResampleALS={setResampleALS}
                    resamplefile={resamplefile} setResamplefile={setResamplefile}
                    FilenameOptions={FilenameOptions} ALSnameOptions={ALSnameOptions}
                    specificvalue={specificvalue} setSpecificvalue={setSpecificvalue}
                    ResamplespecificvalueOptions={ResamplespecificvalueOptions}
                    setClearResample={setClearResample}
                />
            )}
			     
			     {popupType === 'wms' && (
                <WMS
                    wmsfilename={wmsfilename} setWmsfilename={setWmsfilename}
                    FilenameOptions={FilenameOptions}
                    sliderValue={sliderValue} setSliderValue={setSliderValue}
                    setClearWMS={setClearWMS}
                />
            )}
			     
			       {popupType === 'wcs' && (
               <WCS
                    wcsalsname={wcsalsname} setWcsalsname={setWcsalsname}
                    wcsfilename={wcsfilename} setWcsfilename={setWcsfilename}
                    FilenameOptions={FilenameOptions} ALSnameOptions={ALSnameOptions}
                    setWcsdraw={setWcsdraw} setClearWCS={setClearWCS}
                    setCleargeoraster={setCleargeoraster}
                />
            )}
   
                    </div>
                </div>
            )}
              {isPopupVisible2 && (
                <div className="popup2">
                    <div className="popup-content">
                        <span className="close" onClick={closePopup2}>&times;</span>
                        <PopupContent2 
                            als_1data={als_1data}
                            setAls_1boundary={setAls_1boundary}
                            ALS_pop={ALS_pop} 
                             setALS_1update={setALS_1update}
                             setALS_1={setALS_1}
                             ALS_1={ALS_1}
                             setRefreshKey={setRefreshKey}
                        />
                    </div>
                </div>
            )}
        </div>
	);
};

export default Sidebar;