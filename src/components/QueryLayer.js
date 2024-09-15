import React, {
	useEffect,
	useRef
} from 'react';
import $ from 'jquery';
import L from 'leaflet';
import proj4 from 'proj4';

const QueryLayer = ({
	map,
	queryDate,
	startDate,
	endDate,
	clearDate,
	setClearDate,
	circle,
	pointQuery,
	clearPoint,
	setPointQuery,
	polygonQuery,
	clearPolygon
}) => {
	const geoJsonLayerRef = useRef(null); // Use useRef for geoJsonLayer
	const combinedLayerRef = useRef(null); // Use useRef for combinedLayer
	const pointLayerRef = useRef(null);

	// Query by a single date
	useEffect(() => {
		const isValidDate = /^(\d{4})-(\d{2})-(\d{2})$/.test(queryDate);
		if(isValidDate && map) {
			console.log(queryDate, 'querydate');
			const url = `http://localhost:3000/query_by_time?querydate=${queryDate}`;

			$.ajax({
				url: url,
				type: 'GET',
				success: function(response) {
					const geojsonObject = JSON.parse(response[0].raster_extent_geojson);
					const generationDate = new Date(response[0].generation_date).toLocaleDateString();
					const coordinates = geojsonObject.coordinates[0];
					console.log(response, 'response');

					// Reproject coordinates
					for(let i = 0; i < coordinates.length; i++) {
						const Geocoord = proj4('EPSG:25832', 'EPSG:4326', coordinates[i]);
						coordinates[i] = Geocoord;
					}

					// Remove previous geoJsonLayer if exists
					if(geoJsonLayerRef.current) {
						map.removeLayer(geoJsonLayerRef.current);
					}

					const geoJsonLayer = L.geoJSON(geojsonObject).addTo(map);
					map.fitBounds(geoJsonLayer.getBounds());

					geoJsonLayer.on('click', function(e) {
						const latlng = e.latlng;
						const popup = L.popup()
							.setLatLng(latlng)
							.setContent(`<p>filename: ${response[0].filename}</p>
              						 <p>generation date: ${generationDate}</p>`)
							.openOn(map);
					});

					geoJsonLayerRef.current = geoJsonLayer; // Store the layer in useRef
				},
				error: function(error) {
					console.error(error);
				}
			});
		}
	}, [queryDate, map]);

	// Query by start and end date
	useEffect(() => {
		const isValidStartDate = /^(\d{4})-(\d{2})-(\d{2})$/.test(startDate);
		const isValidEndDate = /^(\d{4})-(\d{2})-(\d{2})$/.test(endDate);

		if(isValidStartDate && isValidEndDate && map) {
			console.log(startDate, endDate, 'Time period');
			const url = `http://localhost:3000/query_by_time_period?startdate=${startDate}&enddate=${endDate}`;

			$.ajax({
				url: url,
				type: 'GET',
				success: function(response) {
					const geoJsonArray = [];
					for(let i = 0; i < response.length; i++) {
						const geoJson = JSON.parse(response[i].raster_extent_geojson);
						console.log(response[i], 'response[i]');
						const name = response[i].filename;
						const generationdate = response[i].generation_date;

						if(!geoJson.properties) {
							geoJson.properties = {};
						}
						geoJson.properties.name = name;
						geoJson.properties.generationdate = generationdate;
						const coordinates = geoJson.coordinates;

						for(let j = 0; j < coordinates.length; j++) {
							const ring = coordinates[j];

							for(let k = 0; k < ring.length; k++) {
								const coord = ring[k];
								const Geocoord = proj4('EPSG:25832', 'EPSG:4326', coord);
								ring[k] = Geocoord;
							}
						}
						geoJsonArray.push(geoJson);
					}

					// Remove previous combinedLayer if exists
					if(combinedLayerRef.current) {
						map.removeLayer(combinedLayerRef.current);
					}

					const combinedLayer = L.geoJSON(geoJsonArray, {
						onEachFeature: function(feature, layer) {
							const name = feature.properties.name || 'Unknown';
							const generationDate = new Date(feature.properties.generationdate).toLocaleDateString();

							layer.on('click', function() {
								L.popup()
									.setLatLng(layer.getBounds().getCenter())
									.setContent(`<p>filename: ${name}</p>
                    				 <p>generation date: ${generationDate}</p>`)
									.openOn(map);
							});
						}
					});

					console.log(combinedLayer, 'combinedLayer');
					combinedLayer.addTo(map);
					combinedLayerRef.current = combinedLayer; // Store the layer in useRef
				},
				error: function(error) {
					console.error(error);
				}
			});
		}
	}, [startDate, endDate, map]);

	// Clear layers when clearDate is true
	useEffect(() => {
		if(clearDate === true) {
			if(geoJsonLayerRef.current) {
				map.removeLayer(geoJsonLayerRef.current); // Clear single date query layer
			}
			if(combinedLayerRef.current) {
				map.removeLayer(combinedLayerRef.current); // Clear period query layer
			}

			setClearDate(false); // Reset the clearDate state
		}
	}, [clearDate, map, setClearDate]);

	useEffect(() => {
		const handleClick = async(e) => {
			if(pointLayerRef.current) {
				map.removeLayer(pointLayerRef.current); // Clear single date query layer
			}
			var latlng = e.latlng;
			console.log(latlng, 'latlng');

			var pointcoords = [e.latlng.lng, e.latlng.lat];
			pointcoords = proj4('EPSG:4326', 'EPSG:25832', pointcoords);

			const pointLayer = L.circle([e.latlng.lat, e.latlng.lng], {
				color: 'red',
				fillColor: '#f03',
				fillOpacity: 0.5,
				radius: 10,
			}).addTo(map);

			const url = `http://localhost:3000/query_by_coordinates?pointcoords=${pointcoords}`;

			$.ajax({
				url: url,
				type: 'GET',
				success: function(response) {
					response = JSON.parse(response[0].st_value);
					console.log(response, 'response');
					let popupContent = `<p>DTM value:${response} m</p>`;
					pointLayer.bindPopup(popupContent).openPopup();
					pointLayerRef.current = pointLayer;
				},

				error: function(error) {
					console.error(error);
				},
			});
		};

		if(pointQuery === true) {
			map.on('click', handleClick);
		}

		if(clearPoint === true) {
			console.log(pointQuery, 'pointQuery');
			if(pointLayerRef.current) {
				map.removeLayer(pointLayerRef.current); // Clear single date query layer
			}
			map.off('click', handleClick);
			setPointQuery(false);
		}

		return() => {
			if(map) {
				map.off('click', handleClick);
			}
		};
	}, [map, pointQuery, clearPoint]);

	useEffect(() => {
		if(polygonQuery) {

			const drawnItems = new L.FeatureGroup();
			map.addLayer(drawnItems);
			const drawControl = new L.Control.Draw({
				draw: {
					polygon: true,
					polyline: false,
					rectangle: false,
					circle: false,
					marker: false,
					circlemarker: false
				},
				edit: {
					featureGroup: drawnItems,
					remove: true
				}
			});
			map.addControl(drawControl);

			map.on('draw:created', function(e) {
				const layer = e.layer;
				drawnItems.clearLayers();
				drawnItems.addLayer(layer);

				const coordinates = layer.toGeoJSON().geometry.coordinates;
				console.log(coordinates, 'coordinates');
				const polygonarray = coordinates[0].map(mercatorCoord => {
					const utmCoord = proj4('EPSG:4326', 'EPSG:25832', mercatorCoord);
					return utmCoord;
				});
				console.log(polygonarray, 'array');

				const test = JSON.stringify(polygonarray);

				const url = `http://localhost:3000/query_by_polygon?polygonarray=${test}`;
				$.ajax({
					url: url,
					type: 'GET',
					success: function(response) {
						console.log(response, 'response11111');
						layer.on('click', function() {
							layer.bindPopup(`
                <p>DTM min value: ${response.min_value} m</p>
                <p>DTM max value: ${response.max_value} m</p>
                <p>DTM average value: ${response.avg_value} m</p>
              `).openPopup();
						});
					},
					error: function(error) {
						console.log(error, 'error');
					}
				});
			});

			return() => {
				map.removeControl(drawControl);
				map.off('draw:created');
				map.removeLayer(drawnItems);
			};
		}
	}, [map, polygonQuery, clearPolygon]);

	return null;
};

export default QueryLayer;