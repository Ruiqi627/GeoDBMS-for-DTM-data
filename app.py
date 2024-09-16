from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from osgeo import gdal
import numpy as np

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  

def raster_subtraction(raster1_path, raster2_path, output_path):
    raster1 = gdal.Open(raster1_path)
    raster2 = gdal.Open(raster2_path)
    geo_transform2 = raster2.GetGeoTransform()
    projection2 = raster2.GetProjection()
    width2 = raster2.RasterXSize
    height2 = raster2.RasterYSize

    #Resample the first DTM data to the same as the second DTM data
    raster1_resampled_path = "resampled_raster1.tif"
    resampled = gdal.Warp(raster1_resampled_path, raster1, format="GTiff",width=width2, height=height2,dstSRS=projection2,resampleAlg=gdal.GRA_Bilinear)
    

    raster1_resampled = gdal.Open(raster1_resampled_path)  
    width = raster1_resampled.RasterXSize
    height = raster1_resampled.RasterYSize
    bands = raster1_resampled.RasterCount

    # Export the resampled first DTM data
    driver = gdal.GetDriverByName("GTiff")
    output_raster = driver.Create(output_path, width, height, bands, gdal.GDT_Float32)
    

    # Transform the coordinate system
    geo_transform = raster1_resampled.GetGeoTransform()
    projection = raster1_resampled.GetProjection()
    output_raster.SetGeoTransform(geo_transform)
    output_raster.SetProjection(projection)
    band1 = raster1_resampled.GetRasterBand(1)
    band2 = raster2.GetRasterBand(1)
    data1 = band1.ReadAsArray()
    data2 = band2.ReadAsArray()
    subtracted_data = data1 - data2
    output_band = output_raster.GetRasterBand(1)
    output_band.WriteArray(subtracted_data)

    output_band = None
    output_raster = None
    raster1 = None
    raster1_resampled = None
    raster2 = None

    return "Success"

def raster_absolute_addition(raster1_path, raster2_path, output_path):
    raster1 = gdal.Open(raster1_path)
    raster2 = gdal.Open(raster2_path)
    geo_transform2 = raster2.GetGeoTransform()
    projection2 = raster2.GetProjection()
    width2 = raster2.RasterXSize
    height2 = raster2.RasterYSize

    #Resample the first DTM data to the same as the second DTM data
    raster1_resampled_path = "resampled_raster1.tif"
    resampled = gdal.Warp(raster1_resampled_path, raster1, format="GTiff",
                          width=width2, height=height2,
                          dstSRS=projection2,
                          resampleAlg=gdal.GRA_Bilinear)

    raster1_resampled = gdal.Open(raster1_resampled_path)
    width = raster1_resampled.RasterXSize
    height = raster1_resampled.RasterYSize
    bands = raster1_resampled.RasterCount
    driver = gdal.GetDriverByName("GTiff")
    output_raster = driver.Create(output_path, width, height, bands, gdal.GDT_Float32)
    
    # Set the output result a coordinate system
    geo_transform = raster1_resampled.GetGeoTransform()
    projection = raster1_resampled.GetProjection()
    output_raster.SetGeoTransform(geo_transform)
    output_raster.SetProjection(projection)

    # Addition
    band1 = raster1_resampled.GetRasterBand(1)
    band2 = raster2.GetRasterBand(1)
    data1 = band1.ReadAsArray()
    data2 = band2.ReadAsArray()
    absolute_data1 = np.abs(data1)
    absolute_data2 = np.abs(data2)
    added_data = absolute_data1 + absolute_data2
    output_band = output_raster.GetRasterBand(1)
    output_band.WriteArray(added_data)
    output_band = None
    output_raster = None
    raster1 = None
    raster1_resampled = None
    raster2 = None

    return "Success"

@app.route('/subtract_rasters', methods=['POST'])
def subtract_rasters():
    try:
        data = request.json
        raster1_path = data['raster1_path']
        raster2_path = data['raster2_path']
        output_path = data['output_path']
        
        message = raster_subtraction(raster1_path, raster2_path, output_path)
        return jsonify({"message": message})
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/add_absolute_rasters', methods=['POST'])
def add_absolute_rasters():
    try:
        data = request.json
        raster1_path = data['raster1_path']
        raster2_path = data['raster2_path']
        output_path = data['output_path']
        
        message = raster_absolute_addition(raster1_path, raster2_path, output_path)
        return jsonify({"message": message})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
    
