import React, {
	useEffect,
	useRef
} from 'react';
import $ from 'jquery';
import L from 'leaflet';
import proj4 from 'proj4';
//Load web services on map
const QueryLayer = ({
	map,
	wmsfilename,
	setWmsfilename,
	sliderValue,
	clearWMS,
	wcsfilename,
	clearWCS,
	loadWMS,
	wcsdraw,
	setWcsdraw
	
}) => {
	const wmsLayerRef = useRef(null); // Use useRef for geoJsonLayer
	const wmsLayer2Ref = useRef(null); // Use useRef for combinedLayer
	const wmsLayer3Ref = useRef(null);
	const drawControlwcsRef = useRef(null);
const WCSLayerRef = useRef(null);
	var handleDrawCreated;
	var handleDrawStop;

		useEffect(() => {
		console.log(wmsfilename, 'wmsfilenamemap');

		if(wmsfilename === '32457_5427.tif') {
			if(clearWMS == true) {
				setWmsfilename('');
				if(wmsLayerRef.current) {
					map.removeLayer(wmsLayerRef.current);
					wmsLayerRef.current = null;
				}
				if(wmsLayer2Ref.current) {
					map.removeLayer(wmsLayer2Ref.current);
					wmsLayer2Ref.current = null;
				}
				if(wmsLayer3Ref.current) {
					map.removeLayer(wmsLayer3Ref.current);
					wmsLayer3Ref.current = null;
				}
			} else {
				if(sliderValue == 1) {
					wmsLayerRef.current = L.tileLayer.wms('http://localhost:8090/geoserver/wmstimeformal/wms?', {
						layers: 'wmstimeformal:wmsformal',
						format: 'image/png',
						transparent: true,
						version: '1.1.0',
						time: '2000-01',
						crs: L.CRS.EPSG4326
					}).addTo(map);
				} else if(sliderValue == 2) {
					wmsLayer2Ref.current = L.tileLayer.wms('http://localhost:8090/geoserver/wmstimeformal/wms?', {
						layers: 'wmstimeformal:wmsformal',
						format: 'image/png',
						transparent: true,
						version: '1.1.0',
						time: '2010-01',
						crs: L.CRS.EPSG4326
					}).addTo(map);
				} else if(sliderValue == 3) {
					wmsLayer3Ref.current = L.tileLayer.wms('http://localhost:8090/geoserver/wmstimeformal/wms?', {
						layers: 'wmstimeformal:wmsformal',
						format: 'image/png',
						transparent: true,
						version: '1.1.0',
						time: '2020-01',
						crs: L.CRS.EPSG4326
					}).addTo(map);
				}
			}
		}

	}, [loadWMS, sliderValue, wmsfilename, clearWMS]);
	useEffect(() => {
    if (wcsdraw === true) {
        var test;
        var drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);
        if ( drawControlwcsRef.current) {
            map.removeControl( drawControlwcsRef.current);
        }

         drawControlwcsRef.current = new L.Control.Draw({
            edit: {
                featureGroup: drawnItems
            },
            draw: {
                polygon: false,
                polyline: false,
                circle: false,
                marker: false,
                circlemarker: false,
                rectangle: true
            }
        });

        map.addControl( drawControlwcsRef.current);

       handleDrawCreated = (e) => {
            var layer = e.layer;
            drawnItems.clearLayers(); 
            drawnItems.addLayer(layer);

            var coordinates = layer.toGeoJSON().geometry.coordinates[0];
            var minLng = coordinates[0][0], maxLng = coordinates[0][0];
            var minLat = coordinates[0][1], maxLat = coordinates[0][1];

            for (var i = 0; i < coordinates.length; i++) {
                var lng = coordinates[i][0];
                var lat = coordinates[i][1];

                if (lng < minLng) minLng = lng;
                if (lng > maxLng) maxLng = lng;
                if (lat < minLat) minLat = lat;
                if (lat > maxLat) maxLat = lat;
            }

            var minCoord = [minLng, minLat];
            var maxCoord = [maxLng, maxLat];
            var otherCoord1 = [maxLng, minLat];
            var otherCoord2 = [minLng, maxLat];

            var minUtmCoord = proj4('EPSG:4326', 'EPSG:25832', minCoord);
            var maxUtmCoord = proj4('EPSG:4326', 'EPSG:25832', maxCoord);
            var otherUtmCoord1 = proj4('EPSG:4326', 'EPSG:25832', otherCoord1);
            var otherUtmCoord2 = proj4('EPSG:4326', 'EPSG:25832', otherCoord2);

            var wcsarray = [
                [minUtmCoord[0], minUtmCoord[1]],
                [maxUtmCoord[0], maxUtmCoord[1]],
            ];

            test = JSON.stringify(wcsarray);
        };

        handleDrawStop = () => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `http://localhost:3000/query_by_wcs?wcsarray=${test}`, true);
            xhr.responseType = 'blob';

            xhr.onload = function () {
                if (xhr.status === 200) {
                    const blob = xhr.response;
                    const url = URL.createObjectURL(blob);

                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'wcsexport.tif';
                    document.body.appendChild(a);
                    a.click();
                } else {
                    console.error('Error downloading the file');
                }
            };

            xhr.onerror = function () {
                console.error('Network error');
            };

            xhr.send();
            setWcsdraw(false);

           
        };

        map.on('draw:created', handleDrawCreated);
        map.on('draw:drawstop', handleDrawStop);
    }
}, [wcsdraw]);

	//WCS
	useEffect(() => {
		if(wcsfilename == '32457_5427.tif') {
			if(clearWCS == false) {
				const url = `http://localhost:3000/query_wcsextent?wcsfilename=${wcsfilename}`;

				$.ajax({
					url: url,
					type: 'GET',
					success: function(response) {
						const geojsonObject = JSON.parse(response[0].raster_extent_geojson);
						const coordinates = geojsonObject.coordinates[0];
						console.log(response, 'response')

						for(let i = 0; i < coordinates.length; i++) {
							const Geocoord = proj4('EPSG:25832', 'EPSG:4326', coordinates[i]);
							coordinates[i] = Geocoord;
						}

						WCSLayerRef.current = L.geoJSON(geojsonObject).addTo(map);
						map.fitBounds(WCSLayerRef.current.getBounds());
					},
					error: function(error) {
						console.error(error);
					}

				})
			} else {
		
				map.removeLayer(WCSLayerRef.current)
				 if (drawControlwcsRef.current) {
                map.removeControl(drawControlwcsRef.current);
            map.off('draw:created', handleDrawCreated);
            map.off('draw:drawstop', handleDrawStop);
            }
				setWcsdraw(false);
				
			}

		}

	}, [wcsfilename, clearWCS])

	return null;
};

export default QueryLayer;