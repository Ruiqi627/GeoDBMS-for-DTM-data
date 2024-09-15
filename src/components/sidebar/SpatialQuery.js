import React from 'react';

const SpatialQuery = ({
    pointQuery,
    setPointQuery,
    setClearPoint,
    polygonQuery,
    setPolygonQuery,
    setClearPolygon
}) => {
    return (
        <div>
            <h3>Spatial queries</h3>
            <button onClick={() => setPointQuery(true)}>Query by point</button>
            <button onClick={() => {
                setPointQuery(false);
                setClearPoint(true);
            }}>
                Clear point
            </button>
            <button onClick={() => setPolygonQuery(true)}>Query by polygon</button>
            <button onClick={() => {
                setPolygonQuery(false);
                setClearPolygon(true);
            }}>
                Clear polygon
            </button>
        </div>
    );
};

export default SpatialQuery;
