import React from 'react';
//the panel of exporting DTM data
const Export = ({
	exportALS,
	setExportALS,
	exportname,
	setExportname,
	format,
	setFormat,
	exportresamplemethod,
	setExportresamplemethod,
	resamplesize,
	setResamplesize,
	tilesize,
	setTilesize,
	setSavepath,
	setExportfile,
	ALSnameOptions,
	FilenameOptions,
	ExportformatOptions,
	ResamplemethodOptions,
	ResamplesizeOptions,
	ExporttileOptions
}) => {
	return(
		<div>
            <h3>Export</h3>

            <p>Please choose the ALS</p>
            <select value={exportALS} onChange={(e) => setExportALS(e.target.value)}>
                {ALSnameOptions.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            <p>Please choose the filename</p>
            <select value={exportname} onChange={(e) => setExportname(e.target.value)}>
                {FilenameOptions.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            <p>Please set the export format</p>
            <select value={format} onChange={(e) => setFormat(e.target.value)}>
                {ExportformatOptions.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            <p>Please set the resample method</p>
            <select value={exportresamplemethod} onChange={(e) => setExportresamplemethod(e.target.value)}>
                {ResamplemethodOptions.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            <p>Please set the resolution size</p>
            <select value={resamplesize} onChange={(e) => setResamplesize(e.target.value)}>
                {ResamplesizeOptions.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            <p>Please set the tile number</p>
            <select value={tilesize} onChange={(e) => setTilesize(e.target.value)}>
                {ExporttileOptions.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            <p>Please set the save path</p>
            <input
                placeholder="The path"
                onChange={(e) => setSavepath(e.target.value)}
            />

            <button onClick={() => setExportfile(true)}>Export</button>
        </div>
	);
};

export default Export;