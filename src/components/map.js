import React, {
	useEffect,
	useState,
	useContext,
	useRef
} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import $ from 'jquery';
import parseGeoraster from 'georaster';
import GeoRasterLayer from 'georaster-layer-for-leaflet';
import proj4 from 'proj4';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import chroma from 'chroma-js';
import { AppContext } from '../context/AppContext';
import QueryLayer from './QueryLayer';
import WebLayer from './WebLayer';

let map = null;
let georaster;
let georaster2;
var georasterlayer;
var georasterlayer2;
var clickListener1;
var clickListener2;
var Resamplelayer;
proj4.defs("EPSG:3857", "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs");
proj4.defs("EPSG:25832", "+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs");
var boundarylayer;
//var geoJsonLayer;
//var combinedLayer;
var wmsLayer;
var wmsLayer2;
var wmsLayer3;
var WCSLayer;
var polygonarray = [];
var wcsarray = [];
let circle = null;
var drawControlwcs;
var handleDrawCreated;
var handleDrawStop;

const MapComponent = ({}) => {
	const {
		ALS_1,
		ALS_2,
		ALS_3,
		queryDate,
		startDate,
		endDate,
		clearDate,
		pointQuery,
		polygonQuery,
		elevationname,
		als_name1,
		als_name2,
		analysis,
		exportname,
		format,
		tilesize,
		resolution,
		savepath,
		exportfile,
		sliderValue,
		loadWMS,
		campaignAnalysis,
		resamplefile,
		resampleALS,
		resamplesize,
		minimumresample,
		maximumresample,
		meanresample,
		wmsfilename,
		wcsfilename,
		setWcsfilename,
		wcsdraw,
		setAls_1data,
		als_1boundary,
		clearPoint,
		setPointQuery,
		clearPolygon,
		clearWMS,
		clearWCS,
		cleargeoraster,
		cleargeoraster2,
		specificvalue,
		clearResample,
		exportresamplemethod,
		exportALS,
		aLS_1update,
		setClearDate,
		refreshKey,
		analysisALS1,
    analysisALS2,
    analysisfile,
    setAnalysis,
    setClearWMS,
    setWmsfilename,
    setWcsdraw,
    clearAnalysis,
    setClearAnalysis,
    setExportfile,
    clearTotalchange,setClearTotalchange,
    totalchangeanalysisfile
	} = useContext(AppContext);

	const wmsLayerRef = useRef(null);
	const wmsLayer2Ref = useRef(null);
	const wmsLayer3Ref = useRef(null);
	const [layerAls1, setLayerAls1] = useState(null);
	const [layerAls2, setLayerAls2] = useState(null);
	const [layerAls3, setLayerAls3] = useState(null);

	useEffect(() => {

		if(!map) {
			map = L.map('map').setView([49.0, 8.42], 13);

			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(map);
		}

		return() => {
			if(map) {
				map.remove();
				map = null;
			}
		};
	}, []);

useEffect(() => {
  console.log(ALS_1, 'ALS_1的状态有没有变');
  console.log(refreshKey, '有没有refresh');

  // 先移除图层（如果已经存在）
  if (layerAls1) {
    map.removeLayer(layerAls1);
    setLayerAls1(null); // 重置图层状态
  }
  if(boundarylayer) {
			map.removeLayer(boundarylayer)
	}

  // 重新加载图层
  if (ALS_1) {
    const url = `http://localhost:3000/ALS_1`;
    $.ajax({
      url: url,
      type: 'GET',
      success: function (response) {
        console.log(response, '响应是啥');
        setAls_1data(response);

        const geotiffFilePath = 'http://localhost:3000/static/' + 'als_1' + '.tiff';
        fetch(geotiffFilePath)
          .then(response => {
            if (!response.ok) { 
              throw new Error('Network response was not ok');
            }
            return response.arrayBuffer();
          })
          .then(arrayBuffer => {
            parseGeoraster(arrayBuffer)
              .then(georaster => {
                georaster.projection = 25832;
                const newLayer = new GeoRasterLayer({
                  georaster: georaster,
                  opacity: 1,
                  resolution: 256,
                });
                newLayer.addTo(map);
                map.fitBounds(newLayer.getBounds());
                setLayerAls1(newLayer); // 设置新的图层状态
              })
              .catch(error => {
                console.error('Error parsing GeoRaster:', error);
              });
          })
          .catch(error => {
            console.error('Fetch error:', error);
          });
      },
      error: function (error) {
        console.log('error.', error);
      }
    });
  }

  // 当 ALS_1 或 refreshKey 改变时触发
}, [ALS_1, refreshKey]);

	useEffect(() => {
		if(boundarylayer) {
			map.removeLayer(boundarylayer)
		}

		if(als_1boundary) {
			const geojsonObject = JSON.parse(als_1boundary);
			const coordinates = geojsonObject.coordinates[0];

			for(let i = 0; i < coordinates.length; i++) {
				const Geocoord = proj4('EPSG:25832', 'EPSG:4326', coordinates[i]);
				coordinates[i] = Geocoord;
			}

			boundarylayer = L.geoJSON(geojsonObject).addTo(map);
			map.fitBounds(boundarylayer.getBounds());
		} else {
			if(boundarylayer) {
				map.removeLayer(boundarylayer)
			}
		}
	}, [als_1boundary]);

	useEffect(() => {
		if(ALS_2) {
			const url = `http://localhost:3000/ALS_2`;
			$.ajax({
				url: url,
				type: 'GET',
				success: function(response) {
					setAls_1data(response)
					const geotiffFilePath = process.env.PUBLIC_URL + '/data/' + 'als_2' + '.tiff';
					fetch(geotiffFilePath)
						.then(response => {
							if(!response.ok) {
								throw new Error('Network response was not ok');
							}
							return response.arrayBuffer();
						})
						.then(arrayBuffer => {
							parseGeoraster(arrayBuffer)
								.then(georaster => {
									georaster.projection = 25832;
									const newLayer = new GeoRasterLayer({
										georaster: georaster,
										opacity: 1,
										resolution: 256,
									});
									newLayer.addTo(map);
									map.fitBounds(newLayer.getBounds());
									setLayerAls2(newLayer);
								})
								.catch(error => {
									console.error('Error parsing GeoRaster:', error);
								});
						})
						.catch(error => {
							console.error('Fetch error:', error);
						});
				},
				error: function(error) {
					console.log('error.', error);
				}
			});
		} else if(!ALS_2 && layerAls2) {
			map.removeLayer(layerAls2);
			setLayerAls2(null);
		}
	}, [ALS_2]);

	useEffect(() => {
		if(ALS_3) {
			const url = `http://localhost:3000/ALS_3`;
			$.ajax({
				url: url,
				type: 'GET',
				success: function(response) {
					setAls_1data(response)
					console.log(response, 'als_3')
					const geotiffFilePath = process.env.PUBLIC_URL + '/data/' + 'als_3' + '.tiff';
					fetch(geotiffFilePath)
						.then(response => {
							if(!response.ok) {
								throw new Error('Network response was not ok');
							}
							return response.arrayBuffer();
						})
						.then(arrayBuffer => {
							parseGeoraster(arrayBuffer)
								.then(georaster => {
									georaster.projection = 25832;
									const newLayer = new GeoRasterLayer({
										georaster: georaster,
										opacity: 1,
										resolution: 256,
									});
									newLayer.addTo(map);
									map.fitBounds(newLayer.getBounds());
									setLayerAls3(newLayer);
								})
								.catch(error => {
									console.error('Error parsing GeoRaster:', error);
								});
						})
						.catch(error => {
							console.error('Fetch error:', error);
						});
				},
				error: function(error) {
					console.log('error.', error);
				}
			});
		} else if(!ALS_3 && layerAls3) {
			map.removeLayer(layerAls3);
			setLayerAls3(null);
		}
	}, [ALS_3]);



if(clearPoint === true) {
			console.log(pointQuery, 'pointQuery');
			setPointQuery(false);
			if(circle) {
				map.removeLayer(circle);
			}
//			map.off('click', handleClick); 
		}


	useEffect(() => {

		if(analysis === true) {
			if (georasterlayer2) {
      map.removeLayer(georasterlayer2);
    }
			console.log(analysisALS1, analysisALS2,analysisfile, 'analysis')
			const url = `http://localhost:3000/analysis?analysisALS1=${analysisALS1}&analysisALS2=${analysisALS2}&analysisfile=${analysisfile}`;

			$.ajax({
				url: url,
				type: 'GET',
				success: function(response) {
				console.log(response, 'response');
        const raster1Path = response.paths.analysis1;  
        const raster2Path = response.paths.analysis2; 
        const outputPath = 'E:/output_difference.tiff'; 

        const postData = {
            raster1_path: raster1Path,
            raster2_path: raster2Path,
            output_path: outputPath
        };

        $.ajax({
            url: 'http://localhost:5000/subtract_rasters', 
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(postData),
            success: function(result) {
                if(result.message){
                  var url_to_geotiff_file = 'http://localhost:3000/static/' + 'output_difference' + '.tiff';

			fetch(url_to_geotiff_file)
				.then(response => response.arrayBuffer())
				.then(arrayBuffer => {
					console.log(arrayBuffer, 'arrayBuffer')
					parseGeoraster(arrayBuffer).then(parsedGeoraster2 => {
						georaster2 = parsedGeoraster2
						const min = georaster2.mins[0];
						const max = georaster2.maxs[0];
						const range = max - min;

						var scale = chroma.scale(['blue', 'white', 'red'])
							.domain([-range, 0, range])
							.classes(30);

						georasterlayer2 = new GeoRasterLayer({
							georaster: georaster2,
							opacity: 1,
							pixelValuesToColorFn: function(pixelValues) {
								var pixelValue = pixelValues[0]; 

								var color = scale(pixelValue).hex();

								return color;
							},
							resolution: 256
						});

						georasterlayer2.addTo(map);
						map.fitBounds(georasterlayer2.getBounds());
					});

					clickListener1 = function(e) {
						if(circle) {
							map.removeLayer(circle);
						}
						const latlng = e.latlng;
						var coord = [e.latlng.lng, e.latlng.lat];
						var transformlatlng = proj4('EPSG:4326', 'EPSG:25832', coord);

						const x = Math.floor((transformlatlng[0] - georaster2.xmin) / georaster2.pixelWidth);
						const y = Math.floor((georaster2.ymax - transformlatlng[1]) / georaster2.pixelHeight);

						let popupContent;

						if(x >= 0 && x < georaster2.width && y >= 0 && y < georaster2.height) {
							const pixelValue = georaster2.values[0][y][x];
							popupContent = `Here the elevation change is: ${pixelValue} m`;
						} else {
							popupContent = `No data at (${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)})`;
						}

						L.popup()
							.setLatLng(latlng)
							.setContent(popupContent)
							.openOn(map); 
						circle = L.circle(latlng, {
							radius: 5, 
							color: 'red', 
							fillColor: '#f03', 
							fillOpacity: 0.5 
						}).addTo(map);
					};

					map.on('click', clickListener1);
				})
				.catch(error => {
					console.error('Error loading GeoTIFF file:', error);
				});
                }
            },
            error: function(error) {
                console.error('Error:', error);
            }
        });
				},
				error: function(error) {
					console.error(error);
				}
			});
			 setAnalysis(false);
		}
		
	
		if(clearAnalysis==true){
			map.removeLayer(circle);
			map.off('click', clickListener1);
			map.removeLayer(georasterlayer2);
			setClearAnalysis(false);
		}
		
		if(clearTotalchange==true){
			map.removeLayer(circle);
			map.off('click', clickListener2);
			map.removeLayer(georasterlayer);
			setClearTotalchange(false);
		}

	}, [analysis, analysisALS1, analysisALS2,analysisfile,clearTotalchange]);
	
	
	

useEffect(() => {
    if (clickListener1) {
        map.off('click', clickListener1);
    }

    if (campaignAnalysis === true) {
    		if (georasterlayer) {
      map.removeLayer(georasterlayer);
    }
        const url = `http://localhost:3000/totalchangeanalysis?totalchangeanalysisfile=${totalchangeanalysisfile}`;
		console.log(url,'url')
        $.ajax({
            url: url,
            type: 'GET',
            success: function(response) {
                console.log(response, 'response');
                const raster1Path = response.paths.analysis1;
                const raster2Path = response.paths.analysis2;
                const raster3Path = response.paths.analysis3;
                const output_path = 'E:/Totalchange.tiff';

                const postData = {
                    raster1_path: raster1Path,
                    raster2_path: raster2Path,
                    raster3_path: raster3Path,
                    output_path: output_path
                };

                $.ajax({
                    url: 'http://localhost:5000/totalchange',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(postData),
                    success: function(result) {
                        var url_to_geotiff_file = 'http://localhost:3000/static/' + 'Totalchange' + '.tiff';
                        fetch(url_to_geotiff_file)
                            .then(response => response.arrayBuffer())
                            .then(arrayBuffer => {
                                parseGeoraster(arrayBuffer).then(parsedGeoraster => {
                                    georaster = parsedGeoraster;
                                    const min = georaster.mins[0];
                                    const max = georaster.maxs[0];
                                    const range = max - min;

                                    var scale = chroma.scale(['black', 'red', 'yellow'])
                                        .domain([0, 12])
                                        .classes(10);

                                    georasterlayer = new GeoRasterLayer({
                                        georaster: georaster,
                                        opacity: 1,
                                        pixelValuesToColorFn: function(pixelValues) {
                                            var pixelValue = pixelValues[0];
                                            var color = scale(pixelValue).hex();
                                            return color;
                                        },
                                        resolution: 256,
                                        interactive: true
                                    });
                                    georasterlayer.addTo(map);
                                    map.fitBounds(georasterlayer.getBounds());
                                });

                                clickListener2 = function(e) {
                                    if (circle) {
                                        map.removeLayer(circle);
                                    }
                                    const latlng = e.latlng;
                                    var coord = [e.latlng.lng, e.latlng.lat];
                                    var transformlatlng = proj4('EPSG:4326', 'EPSG:25832', coord);

                                    const x = Math.floor((transformlatlng[0] - georaster.xmin) / georaster.pixelWidth);
                                    const y = Math.floor((georaster.ymax - transformlatlng[1]) / georaster.pixelHeight);

                                    let popupContent;

                                    if (x >= 0 && x < georaster.width && y >= 0 && y < georaster.height) {
                                        const pixelValue = georaster.values[0][y][x];
                                        popupContent = `Here the degree of change is: ${pixelValue} m`;
                                    } else {
                                        popupContent = `No data at (${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)})`;
                                    }

                                    L.popup()
                                        .setLatLng(latlng)
                                        .setContent(popupContent)
                                        .openOn(map);

                                    circle = L.circle(latlng, {
                                        radius: 5,
                                        color: 'red',
                                        fillColor: '#f03',
                                        fillOpacity: 0.5
                                    }).addTo(map);
                                };

                                map.on('click', clickListener2);
                            })
                            .catch(error => {
                                console.error('Error loading GeoTIFF file:', error);
                            });
                    }
                });
            }
        });
    }
}, [campaignAnalysis,totalchangeanalysisfile]);

	useEffect(() => {
		if(cleargeoraster == true) {
			if(georasterlayer2) {
				map.removeLayer(georasterlayer2)
			}
		}

	}, [cleargeoraster])

	useEffect(() => {
		if(cleargeoraster2 == true) {
			if(georasterlayer) {
				console.log('test')
				map.removeLayer(georasterlayer)
			}
		}

	}, [cleargeoraster2])

	useEffect(() => {

		if(exportfile == true) {
			console.log(exportALS, exportname, format, exportresamplemethod, resamplesize, tilesize, savepath, 'elevationame')

			const url = `http://localhost:3000/export?exportALS=${exportALS}&exportname=${exportname}&format=${format}&exportresamplemethod=${exportresamplemethod}&resamplesize=${resamplesize}&tilesize=${tilesize}&savepath=${savepath}`;
			console.log(url, 'urllll')

			$.ajax({
				url: url,
				type: 'GET',
				success: function(response) {
					alert('succesfully export!')
					setExportfile(false)

				},
				error: function(error) {
					console.log('11111111111')
					console.log('error.', error);
				}
			});
		}

	}, [exportfile, exportALS, exportname, format, exportresamplemethod, resamplesize, tilesize, savepath]);


	useEffect(() => {
		if(Resamplelayer) {
			map.removeLayer(Resamplelayer)
		}

		if(specificvalue) {
			const resamplefile2 = resamplefile.split('.')[0]

			const url = 'http://localhost:3000/resample';

			$.ajax({
				url: url,
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({
					resamplefile: resamplefile,
					resampleALS: resampleALS,
					specificvalue: specificvalue
				}),
				success: function(response) {
					const geotiffFilePath = `http://localhost:3000/static/${resampleALS}${resamplefile2}${specificvalue}.tiff`;
					fetch(geotiffFilePath)
						.then(response => {
							if(!response.ok) {
								throw new Error('Network response was not ok');
							}
							return response.arrayBuffer();
						})
						.then(arrayBuffer => {
							parseGeoraster(arrayBuffer)
								.then(georaster => {
									georaster.projection = 25832; 
									Resamplelayer = new GeoRasterLayer({
										georaster: georaster,
										opacity: 1,
										resolution: 256,
									});
									Resamplelayer.addTo(map); 
									map.fitBounds(Resamplelayer.getBounds()); 
								})
								.catch(error => {
									console.error('Error parsing GeoRaster:', error);
								});
						})
						.catch(error => {
							console.error('Fetch error:', error);
						});
				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.error('AJAX request failed:', textStatus, errorThrown);
				}
			});

		}
	}, [minimumresample, resamplefile, resampleALS, specificvalue])

	useEffect(() => {
		if(clearResample == true) {
			map.removeLayer(Resamplelayer)

		}

	}, [clearResample])

	return(
		<div>
      <div id="map" style={{ height: "900px", width: "100%" }}></div>
      {map && <QueryLayer 
      map={map} 
      queryDate={queryDate} 
      startDate={startDate}
      endDate={endDate} 
      clearDate={clearDate} 
      setClearDate={setClearDate}
      circle={circle}
      pointQuery={pointQuery}
      clearPoint={clearPoint}
      setPointQuery={setPointQuery}
      polygonQuery={polygonQuery}
      clearPolygon={clearPolygon}
      />}
      {map && <WebLayer 
      map={map} 
      wmsfilename={wmsfilename} 
      setWmsfilename={setWmsfilename}
      sliderValue={sliderValue} 
      clearWMS={clearWMS} 
      wcsfilename={wcsfilename}
      clearWCS={clearWCS}
      loadWMS={loadWMS}
      wcsdraw={wcsdraw}
      setWcsdraw={setWcsdraw}
      />}
    </div>
	);
};

export default MapComponent;