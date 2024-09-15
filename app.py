from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from osgeo import gdal
import numpy as np
import matplotlib.pyplot as plt

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # 允许所有的跨域请求

def raster_subtraction(raster1_path, raster2_path, output_path):
    # 打开第一个栅格文件
    raster1 = gdal.Open(raster1_path)
    if raster1 is None:
        return "无法打开文件: {}".format(raster1_path)

    # 打开第二个栅格文件
    raster2 = gdal.Open(raster2_path)
    if raster2 is None:
        return "无法打开文件: {}".format(raster2_path)

    # 获取第二个栅格文件的地理参考信息
    geo_transform2 = raster2.GetGeoTransform()
    projection2 = raster2.GetProjection()
    width2 = raster2.RasterXSize
    height2 = raster2.RasterYSize

    # 重采样第一个栅格文件以匹配第二个栅格文件的分辨率
    raster1_resampled_path = "resampled_raster1.tif"
    resampled = gdal.Warp(raster1_resampled_path, raster1, format="GTiff",
                          width=width2, height=height2,
                          dstSRS=projection2,
                          resampleAlg=gdal.GRA_Bilinear)
    
    # 确保重采样成功
    if resampled is None:
        return "重采样第一个栅格文件失败"

    # 打开重采样后的第一个栅格文件
    raster1_resampled = gdal.Open(raster1_resampled_path)
    if raster1_resampled is None:
        return "无法打开重采样后的第一个栅格文件"

    # 获取重采样后的栅格文件的基本信息
    width = raster1_resampled.RasterXSize
    height = raster1_resampled.RasterYSize
    bands = raster1_resampled.RasterCount

    # 创建输出栅格文件
    driver = gdal.GetDriverByName("GTiff")
    output_raster = driver.Create(output_path, width, height, bands, gdal.GDT_Float32)
    
    if output_raster is None:
        return "创建输出栅格文件失败"

    # 设置输出栅格文件的地理参考信息
    geo_transform = raster1_resampled.GetGeoTransform()
    projection = raster1_resampled.GetProjection()
    output_raster.SetGeoTransform(geo_transform)
    output_raster.SetProjection(projection)

    # 执行栅格相减操作
    for band_num in range(1, bands + 1):
        band1 = raster1_resampled.GetRasterBand(band_num)
        band2 = raster2.GetRasterBand(band_num)

        data1 = band1.ReadAsArray()
        data2 = band2.ReadAsArray()

        # 相减操作
        subtracted_data = data1 - data2

        # 将结果写入输出栅格文件
        output_band = output_raster.GetRasterBand(band_num)
        output_band.WriteArray(subtracted_data)
        output_band.SetNoDataValue(-9999)

        # 可视化结果
        plt.imshow(subtracted_data, cmap='RdBu')  # 使用红蓝颜色映射将负值表示为蓝色，正值表示为红色
        plt.colorbar()

    # 关闭文件
    output_band = None
    output_raster = None
    raster1 = None
    raster1_resampled = None
    raster2 = None

    return "栅格相减完成"

def raster_absolute_addition(raster1_path, raster2_path, output_path):
    # 打开第一个栅格文件
    raster1 = gdal.Open(raster1_path)
    if raster1 is None:
        return "无法打开文件: {}".format(raster1_path)

    # 打开第二个栅格文件
    raster2 = gdal.Open(raster2_path)
    if raster2 is None:
        return "无法打开文件: {}".format(raster2_path)

    # 获取第二个栅格文件的地理参考信息
    geo_transform2 = raster2.GetGeoTransform()
    projection2 = raster2.GetProjection()
    width2 = raster2.RasterXSize
    height2 = raster2.RasterYSize

    # 重采样第一个栅格文件以匹配第二个栅格文件的分辨率
    raster1_resampled_path = "resampled_raster1.tif"
    resampled = gdal.Warp(raster1_resampled_path, raster1, format="GTiff",
                          width=width2, height=height2,
                          dstSRS=projection2,
                          resampleAlg=gdal.GRA_Bilinear)
    
    # 确保重采样成功
    if resampled is None:
        return "重采样第一个栅格文件失败"

    # 打开重采样后的第一个栅格文件
    raster1_resampled = gdal.Open(raster1_resampled_path)
    if raster1_resampled is None:
        return "无法打开重采样后的第一个栅格文件"

    # 获取重采样后的栅格文件的基本信息
    width = raster1_resampled.RasterXSize
    height = raster1_resampled.RasterYSize
    bands = raster1_resampled.RasterCount

    # 创建输出栅格文件
    driver = gdal.GetDriverByName("GTiff")
    output_raster = driver.Create(output_path, width, height, bands, gdal.GDT_Float32)
    
    if output_raster is None:
        return "创建输出栅格文件失败"

    # 设置输出栅格文件的地理参考信息
    geo_transform = raster1_resampled.GetGeoTransform()
    projection = raster1_resampled.GetProjection()
    output_raster.SetGeoTransform(geo_transform)
    output_raster.SetProjection(projection)

    # 执行栅格绝对值相加操作
    for band_num in range(1, bands + 1):
        band1 = raster1_resampled.GetRasterBand(band_num)
        band2 = raster2.GetRasterBand(band_num)

        data1 = band1.ReadAsArray()
        data2 = band2.ReadAsArray()

        # 绝对值相加操作
        absolute_data1 = np.abs(data1)
        absolute_data2 = np.abs(data2)
        added_data = absolute_data1 + absolute_data2

        # 将结果写入输出栅格文件
        output_band = output_raster.GetRasterBand(band_num)
        output_band.WriteArray(added_data)
        output_band.SetNoDataValue(-9999)

        # 可视化结果
        plt.imshow(added_data, cmap='hot')  # 使用热颜色映射表示值的大小
        plt.colorbar()
        plt.title(f"Band {band_num} Absolute Addition Result")


    # 关闭文件
    output_band = None
    output_raster = None
    raster1 = None
    raster1_resampled = None
    raster2 = None

    return "栅格绝对值相加完成"

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
    

# 是不是只用读取一个波段，就不用循环？