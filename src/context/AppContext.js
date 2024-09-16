import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [ALS_1, setALS_1] = useState(false);
  const [ALS_2, setALS_2] = useState(false);
  const [ALS_3, setALS_3] = useState(false);
  const [queryDate, setQueryDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [clearDate, setClearDate] = useState(false);
  const [pointQuery, setPointQuery] = useState(false);
  const [polygonQuery, setPolygonQuery] = useState(false);
  const [elevationname, setElevationname] = useState('');
  const [als_name1, setAls_name1] = useState('');
  const [als_name2, setAls_name2] = useState('');
  const [analysis, setAnalysis] = useState(false);
  const [exportname, setExportname] = useState('');
  const [format, setFormat] = useState('');
  const [tilesize, setTilesize] = useState('');
  const [resolution, setResolution] = useState('');
  const [savepath, setSavepath] = useState('');
  const [exportfile, setExportfile] = useState(false);
  const [sliderValue, setSliderValue] = useState('1');
  const [loadWMS, setLoadWMS] = useState(false);
   const [loadWCS, setLoadWCS] = useState(false);
  const [campaignAnalysis, setCampaignAnalysis] = useState(false);
  const [resamplefile, setResamplefile] = useState('');
  const [resampleALS, setResampleALS] = useState('');
  const [resamplesize, setResamplesize] = useState('');
  const [wmsfilename,setWmsfilename] = useState('');
  const [wcsfilename,setWcsfilename] = useState('');
   const [wcsalsname,setWcsalsname] = useState('');
   const [wcsalsname2,setWcsalsname2] = useState('');
   const [als_1data,setAls_1data] = useState('');
   const [als_1boundary,setAls_1boundary] = useState('');
   const [wcsdraw, setWcsdraw] = useState(false);
  const [minimumresample, setMinimumresample] = useState(false);
  const [maximumresample, setMaximumresample] = useState(false);
  const [meanresample, setMeanresample] = useState(false);
  const [clearPoint, setClearPoint]= useState(false)
  const [clearPolygon, setClearPolygon]= useState(false)
  const [ALS_pop ,setALS_pop]=useState('')
  const [clearWMS, setClearWMS] = useState(false)
  const [clearWCS, setClearWCS] = useState(false)
  const [cleargeoraster, setCleargeoraster] = useState(false)
  const [cleargeoraster2, setCleargeoraster2] = useState(false)
  const [specificvalue,setSpecificvalue]=useState('')
  const [clearResample, setClearResample] = useState(false)
   const [exportresamplemethod,setExportresamplemethod]=useState('')
   const [exportALS,setExportALS]=useState('')
  const [aLS_1update, setALS_1update] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0);
  const [analysisALS1,setAnalysisALS1]=useState('')
    const [analysisALS2,setAnalysisALS2]=useState('')
    const [analysisfile,setAnalysisfile]=useState('')
    const [clearAnalysis,setClearAnalysis]=useState(false)
     const [clearTotalchange,setClearTotalchange]=useState(false)
     const [totalchangeanalysisfile,setTotalchangeanalysisfile]=useState('')

  

  return (
    <AppContext.Provider value={{
      ALS_1, setALS_1, ALS_2, setALS_2, ALS_3, setALS_3,
      queryDate, setQueryDate, startDate, setStartDate, endDate, setEndDate,
      clearDate, setClearDate, pointQuery, setPointQuery, polygonQuery, setPolygonQuery,
      elevationname, setElevationname, als_name1, setAls_name1, als_name2, setAls_name2,
      analysis, setAnalysis, exportname, setExportname, format, setFormat,
      tilesize, setTilesize, resolution, setResolution, savepath, setSavepath,
      exportfile, setExportfile, sliderValue, setSliderValue, loadWMS, setLoadWMS, loadWCS, setLoadWCS,
      campaignAnalysis, setCampaignAnalysis, resamplefile, setResamplefile,
      resampleALS, setResampleALS, resamplesize, setResamplesize, minimumresample, setMinimumresample,
      maximumresample, setMaximumresample, meanresample, setMeanresample,wmsfilename,setWmsfilename,wcsfilename,setWcsfilename,wcsalsname,setWcsalsname,
      wcsdraw, setWcsdraw,als_1data,setAls_1data,als_1boundary,setAls_1boundary,clearPoint, setClearPoint,clearPolygon, setClearPolygon,ALS_pop ,setALS_pop,
      clearWMS, setClearWMS,clearWCS, setClearWCS,wcsalsname2,setWcsalsname2,cleargeoraster, setCleargeoraster,cleargeoraster, setCleargeoraster,cleargeoraster2, setCleargeoraster2,
      specificvalue,setSpecificvalue,clearResample, setClearResample,exportresamplemethod,setExportresamplemethod,exportALS,setExportALS,aLS_1update, setALS_1update,refreshKey, setRefreshKey,
      analysisALS1,setAnalysisALS1,setAnalysisALS2,analysisALS2,analysisfile,setAnalysisfile,clearAnalysis,setClearAnalysis,clearTotalchange,setClearTotalchange,totalchangeanalysisfile,setTotalchangeanalysisfile
    }}>
      {children}
    </AppContext.Provider>
  );
};
