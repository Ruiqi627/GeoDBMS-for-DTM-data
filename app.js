const express = require('express');
const path = require('path');
const db = require('./db');
const cors = require('cors');
const fetch = require('node-fetch');
const fs = require('fs');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const app = express();


process.env.TZ = 'Europe/Berlin';

app.use(cors());
app.use('/static', express.static(path.join('E:\\')));


app.get('/', async (req, res) => {
try {
    const result = await db.query('SELECT * FROM alt');
    res.json(result.rows);
} catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
}
});

app.get('/ALS_1', async (req, res) => {
try {
   const sql_select_geotiff="SELECT rast FROM public.als_1"
    const sql_export_geotiff="DROP TABLE IF EXISTS tmp_out;CREATE TABLE tmp_out AS SELECT lo_from_bytea(0, ST_AsGDALRaster(ST_Union(rast), 'GTiff', ARRAY['QUALITY=50'])) AS loid FROM ("+sql_select_geotiff+") AS subquery; SELECT lo_export(loid, 'E:/als_1.tiff') FROM tmp_out; SELECT lo_unlink(loid) FROM tmp_out;"
    await db.query(sql_export_geotiff);
    console.log(sql_export_geotiff,'sql_export_geotiff')
    const sql_data = "SELECT updatedate,filename,date,timestamp,importdate, ST_AsGeoJSON(ST_Envelope(rast)) AS raster_extent_geojson FROM public.als_1";
    const result = await db.query(sql_data);
    res.json(result.rows);
console.log('test')
} catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
}

});

app.get('/ALS_2', async (req, res) => {
try {
      const sql_data = "SELECT filename,date,ST_AsGeoJSON(ST_Envelope(ST_Union(envelope))) AS raster_extent_geojson,timestamp,importdate FROM public.als_2 GROUP BY filename, date, timestamp, importdate ORDER BY filename ASC LIMIT 100;"

   const result = await db.query(sql_data);
    res.json(result.rows);
console.log('test')
} catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
}
});

app.get('/ALS_3', async (req, res) => {
 try {
     const sql_data = "SELECT filename,date,ST_AsGeoJSON(ST_Envelope(ST_Union(envelope))) AS raster_extent_geojson,timestamp,importdate FROM public.als_3 GROUP BY filename, date,timestamp,importdate ORDER BY filename ASC LIMIT 100;";
    const result = await db.query(sql_data);

    // 返回查询结果
    res.json(result.rows);
} catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
}
});


app.get('/query_by_time', async (req, res) => {
  try {
  	const querydate=req.query.querydate
  	console.log(querydate,'querydate')
  const sql=`SELECT filename, date AT TIME ZONE 'Europe/Berlin' AS generation_date, ST_AsGeoJSON(ST_Envelope(rast)) AS raster_extent_geojson FROM public.als_1 WHERE date = '${querydate}'`
   const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/query_wcsextent', async (req, res) => {
  try {
  	const wcsfilename=req.query.wcsfilename
  	console.log(wcsfilename,'wcsfilename')
  const sql=`SELECT filename, date AT TIME ZONE 'Europe/Berlin' AS generation_date, ST_AsGeoJSON(ST_Envelope(rast)) AS raster_extent_geojson FROM public.als_1 WHERE filename = '${wcsfilename}'`
   const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/query_by_time_period', async (req, res) => {
  try {
  	const startdate=req.query.startdate
  	const enddate=req.query.enddate
  const sql=`SELECT filename, date AT TIME ZONE 'Europe/Berlin' AS generation_date, ST_AsGeoJSON(ST_Envelope(rast)) AS raster_extent_geojson FROM public.als_1 WHERE date between '${startdate}' and '${enddate}'`
   const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/query_by_coordinates', async (req, res) => {
  try {
  	
  	const pointcoords = req.query.pointcoords;
  	 console.log(pointcoords,'点坐标')  const sql=`SELECT ST_Value(rast, ST_SetSRID(ST_MakePoint(${pointcoords}), 25832))FROM public.als_1 WHERE filename = '32457_5427.tif';`
  const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/query_by_polygon', async (req, res) => {
  try {
    // 从 req.query 中获取参数
    const polygonArrayString = req.query.polygonarray;
    const coordinates = JSON.parse(polygonArrayString);
    const convertedCoordinates = coordinates.map(point => point.join(' ')).join(', ');

    // 创建并插入到一个新表中
    const createTempTableQuery = `
      DROP TABLE IF EXISTS temp_table;
      CREATE TABLE temp_table AS
      SELECT ST_Union(ST_Clip(rast, geom)) AS rast
      FROM public.als_1
      CROSS JOIN (SELECT ST_GeomFromText('POLYGON((${convertedCoordinates}))', 25832) AS geom) AS clip_geom
      WHERE ST_Intersects(rast, clip_geom.geom);
    `;

    await db.query(createTempTableQuery);

    const statsQuery = `
      SELECT
        (stats).min AS min_value,
        (stats).max AS max_value,
        (stats).mean AS avg_value
      FROM (
        SELECT ST_SummaryStatsAgg(rast, 1, true) AS stats
        FROM temp_table
      ) AS summary_stats;
    `;

    const statsResult = await db.query(statsQuery);


    const dropTempTableQuery = 'DROP TABLE IF EXISTS temp_table;';
    await db.query(dropTempTableQuery);

    res.json(statsResult.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});



app.get('/analysis', async (req, res) => {
  try {
 
    const analysisALS1 = req.query.analysisALS1;
    const analysisALS2 = req.query.analysisALS2;
    const analysisfile = req.query.analysisfile;

    const sql = `SELECT * FROM public.${analysisALS1} WHERE filename = '${analysisfile}'`;

const sql2="DROP TABLE IF EXISTS tmp_out;CREATE TABLE tmp_out AS SELECT lo_from_bytea(0, ST_AsGDALRaster(ST_Union(rast), 'GTiff', ARRAY['QUALITY=50'])) AS loid FROM ("+sql+") AS subquery; SELECT lo_export(loid, 'E:/analysis1.tiff') FROM tmp_out; SELECT lo_unlink(loid) FROM tmp_out;"
    
 const result1 = await db.query(sql2);
 
 
  const sql3 = `SELECT * FROM public.${analysisALS2} WHERE filename = '${analysisfile}'`;

const sql4="DROP TABLE IF EXISTS tmp_out;CREATE TABLE tmp_out AS SELECT lo_from_bytea(0, ST_AsGDALRaster(ST_Union(rast), 'GTiff', ARRAY['QUALITY=50'])) AS loid FROM ("+sql3+") AS subquery; SELECT lo_export(loid, 'E:/analysis2.tiff') FROM tmp_out; SELECT lo_unlink(loid) FROM tmp_out;"

const result2 = await db.query(sql4);
    const analysisPaths = {
      analysis1: 'E:/analysis1.tiff',
      analysis2: 'E:/analysis2.tiff'
    };


    res.json({
      message: 'Success',
      paths: analysisPaths
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/export', async (req, res) => {
  try {
  	console.log(req.query,'query')
    var exportALS = req.query.exportALS;
    var exportname = req.query.exportname;
    var format = req.query.format;
    var exportresamplemethod = req.query.exportresamplemethod;
    var resamplesize = req.query.resamplesize;
    var tilesize = req.query.tilesize;
    var savepath= req.query.savepath;
    
    let resamplesize2;
    let tile;
    if(exportALS==='ALS_1'){
if (resamplesize==='1x1 m'){
resamplesize2=1000
}
else if (resamplesize==='0.25x0.25 m'){
resamplesize2=4000
}
else if (resamplesize==='5x5 m'){
resamplesize2=20
}
 if (parseInt(tilesize, 10) === 1) {
        tile = resamplesize2;
    } 
 else if (parseInt(tilesize, 10) === 4) {
        tile = resamplesize2 / 2;
    } 
 else if (parseInt(tilesize, 10) === 16) {
        tile = resamplesize2 / 4;
    }
 let query;
 
if(format==='GeoTIFF'){
	 query=`DROP TABLE IF EXISTS temp_resample10;
DROP TABLE IF EXISTS Raster_tile10;

CREATE TEMP TABLE temp_resample10 AS
SELECT
    filename,
    ST_Resample(rast, ${resamplesize2}, ${resamplesize2}, NULL, NULL, 0, 0, '${exportresamplemethod}'::text) AS resample_rast
FROM
    public.${exportALS}
WHERE
    filename = '${exportname}';

CREATE TABLE IF NOT EXISTS Raster_tile10 (
    id SERIAL PRIMARY KEY,
    rast raster,
    filename varchar(256)
);

INSERT INTO Raster_tile10 (rast, filename)
SELECT
    ST_Tile(resample_rast, ${tile}, ${tile}) AS rast,
    filename
FROM
    temp_resample10;

DO $$
DECLARE
    rec RECORD;
    filename TEXT;
    tilesize_range TEXT;
BEGIN
    tilesize_range := (SELECT string_agg(id::TEXT, ',') 
                        FROM generate_series(1, ${tilesize}) AS id);

    FOR rec IN EXECUTE 
        'SELECT id, ST_AsGDALRaster(rast, ''GTiff'', ARRAY[''QUALITY=50'']) AS GeoTIFF_file 
         FROM public.raster_tile10 
         WHERE id IN (' || tilesize_range || ')' 
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS GeoTIFF';
        EXECUTE 'CREATE TEMP TABLE GeoTIFF AS SELECT lo_from_bytea(0, $1) AS loid' USING rec.GeoTIFF_file;

        filename := '${savepath}' || rec.id || '.tiff';

        EXECUTE 'SELECT lo_export(loid, $1) FROM GeoTIFF' USING filename;


        EXECUTE 'SELECT lo_unlink(loid) FROM GeoTIFF';
    END LOOP;
END $$;
`;


    console.log(query,'query')
await db.query(query);
res.json('success')
    


}

else if(format==='XYZ'){
	query=`DROP TABLE IF EXISTS temp_resample10;
DROP TABLE IF EXISTS Raster_tile10;

CREATE TEMP TABLE temp_resample10 AS
SELECT
    filename,
    ST_Resample(rast, ${resamplesize2}, ${resamplesize2}, NULL, NULL, 0, 0, '${exportresamplemethod}'::text) AS resample_rast
FROM
    public.${exportALS}
WHERE
    filename = '${exportname}';

CREATE TABLE IF NOT EXISTS Raster_tile10 (
    id SERIAL PRIMARY KEY,
    rast raster,
    filename varchar(256)
);

INSERT INTO Raster_tile10 (rast, filename)
SELECT
    ST_Tile(resample_rast, ${tile}, ${tile}) AS rast,
    filename
FROM
    temp_resample10;

DO $$
DECLARE
    rec RECORD;
    filename TEXT;
    tilesize_range TEXT;
BEGIN
    tilesize_range := (SELECT string_agg(id::TEXT, ',') 
                        FROM generate_series(1, ${tilesize}) AS id);

    FOR rec IN EXECUTE 
        'SELECT id, ST_AsGDALRaster(rast, ''XYZ'', ARRAY[''QUALITY=50'']) AS GeoTIFF_file 
         FROM public.raster_tile10 
         WHERE id IN (' || tilesize_range || ')' 
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS GeoTIFF';
        EXECUTE 'CREATE TEMP TABLE GeoTIFF AS SELECT lo_from_bytea(0, $1) AS loid' USING rec.GeoTIFF_file;

        filename := '${savepath}' || rec.id || '.xyz';

        EXECUTE 'SELECT lo_export(loid, $1) FROM GeoTIFF' USING filename;

        EXECUTE 'SELECT lo_unlink(loid) FROM GeoTIFF';
    END LOOP;
END $$;
`;

    console.log(query,'query')
await db.query(query);
res.json('success')
    
}

if (format === 'LAZ') {
   
    const inputFolderPath = `${savepath}:\\`;

    fs.readdir(inputFolderPath, (err, files) => {
        if (err) {
            console.error(`Error: ${err.message}`);
            return;
        }

        const xyzFiles = files.filter(file => path.extname(file).toLowerCase() === '.xyz');

        xyzFiles.forEach(file => {
            const inputFilePath = path.join(inputFolderPath, file);
            const outputFilePath = path.join(inputFolderPath, file.replace('.xyz', '.laz'));

            const command = `"C:\\lastools\\bin\\txt2las64.exe" -i "${inputFilePath}" -o "${outputFilePath}"`;

            exec(command);
        });
    });
}

    console.log('Script executed successfully.');
}
    
    console.log(exportALS,exportname,format,exportresamplemethod,resamplesize2,tile,savepath,'export')










  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.use(express.json());

app.post('/resample', async (req, res) => {
  try {
    let { resamplefile, resampleALS, specificvalue } = req.body;
	var resamplesize;
    if (resampleALS == 'ALS_1') {
      resamplesize = 100;
    } else if (resampleALS == 'ALS_2') {
      resamplesize = 4000;
    }
    resamplefile=resamplefile.split('.')[0];
    
    const createTableSQL = `
      DROP TABLE IF EXISTS rast_resample;
      CREATE TEMP TABLE rast_resample (
          id SERIAL PRIMARY KEY,
          rast raster
      );
    `;

    const insertIntoTableSQL = `
      INSERT INTO rast_resample (rast)
      SELECT ST_Tile(rast, ${resamplesize}, ${resamplesize}) AS rast
      FROM public.${resampleALS}
      WHERE filename = '${resamplefile}.tif';
    `;

    const updateRastSQL = `
      UPDATE rast_resample rt
      SET rast = ST_MapAlgebra(
        rt.rast,
        1,
        '32BF',
        format(
          '(%s)',
          (SELECT (ST_SummaryStats(r.rast)).${specificvalue} FROM rast_resample r WHERE r.id = rt.id)
        )
      );
    `;

    const createGeoTIFFSQL = `
       DROP TABLE IF EXISTS GEOTIFF2;
       CREATE TABLE GEOTIFF2 AS
      SELECT lo_from_bytea(0, GeoTIFF_file) AS loid
      FROM (
          SELECT ST_AsGDALRaster(ST_Union(rast), 'GTiff', ARRAY['QUALITY=50']) AS GeoTIFF_file
          FROM rast_resample
      ) AS subquery;
      
      
      DO $$
DECLARE
    export_path text := 'E:/${resampleALS}${resamplefile}${specificvalue}.tiff';
    loid_oid oid;
BEGIN
    SELECT loid INTO loid_oid FROM GeoTIFF2 LIMIT 1;
    PERFORM lo_export(loid_oid, export_path);
    PERFORM lo_unlink(loid_oid);

    
END $$;
    `;

    await db.query(createTableSQL);
    console.log("Temporary table 'rast_resample' created.");

    await db.query(insertIntoTableSQL);
    console.log("Raster data inserted into 'rast_resample'.");
//
    await db.query(updateRastSQL);
    console.log("Raster data updated with specific value.");
//
    await db.query(createGeoTIFFSQL);
    console.log("GeoTIFF2 temporary table created.");
    res.json('success');
  } catch (err) {
    console.error('Error during processing:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/query_by_wcs', async (req, res) => {
  try {
//  const wcsUrl = "http://localhost:8090/geoserver/wcs?request=GetCoverage&service=wcs&version=1.0.0&sourceCoverage=_0201:KA&crs=EPSG:25832&format=geotiff&BBox=457500,5427500,458000,5428000&width=500&height=500";

//  const wcsResponse = await fetch(wcsUrl);

//  const filePath = 'E:\graduation_design\develop1\wcsexport.tif';
//  const fileStream = fs.createWriteStream(filePath);
//
//  wcsResponse.body.pipe(fileStream);
//
//  fileStream.on('finish', () => {
//    console.log(`Geotiff image successfully saved to ${filePath}`);
//    res.status(200).send('Geotiff image saved successfully');
//  });
const polygonArrayString = req.query.wcsarray;
const coordinates = JSON.parse(polygonArrayString);

const convertedCoordinates = coordinates.map(point => point.join(', ')).join(', ');
const wcsUrl = `http://localhost:8090/geoserver/wcs?request=GetCoverage&service=wcs&version=1.0.0&sourceCoverage=_0201:KA&crs=EPSG:25832&format=geotiff&BBox=${convertedCoordinates}&width=500&height=500`;

    const wcsResponse = await fetch(wcsUrl);
    const arrayBuffer = await wcsResponse.arrayBuffer();

    res.setHeader('Content-Disposition', 'attachment; filename=wcsexport.tif');
    res.setHeader('Content-Type', 'image/tiff');
    res.send(Buffer.from(arrayBuffer));

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/export_geotiff', async (req, res) => {
  try {
  	
  const sql="SELECT * FROM public.als_1 WHERE rid = 1"
// const result = await db.query(sql);
//  res.json(result.rows);
    
    const sql3="DROP TABLE IF EXISTS tmp_out;CREATE TABLE tmp_out AS SELECT lo_from_bytea(0, ST_AsGDALRaster(ST_Union(rast), 'GTiff', ARRAY['QUALITY=50'])) AS loid FROM ("+sql+") AS subquery; SELECT lo_export(loid, 'E:/graduation_design/develop1/geotiff1.tiff') FROM tmp_out; SELECT lo_unlink(loid) FROM tmp_out;"
    const result = await db.query(sql3);
    res.json(result.rows);
    

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/export_ascii', async (req, res) => {
  try {
  	
  const sql="SELECT * FROM public.als_1 WHERE rid = 1"
// const result = await db.query(sql);
//  res.json(result.rows);
    
    const sql4="DROP TABLE IF EXISTS tmp_out;CREATE TABLE tmp_out AS SELECT lo_from_bytea(0, ST_AsGDALRaster(ST_Union(rast), 'AAIGrid', ARRAY['QUALITY=50'])) AS loid FROM ("+sql+") AS subquery; SELECT lo_export(loid, 'E:/graduation_design/develop1/ascii.asc') FROM tmp_out; SELECT lo_unlink(loid) FROM tmp_out;"
    const result = await db.query(sql4);
    res.json(result.rows);
    

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/select-file', (req, res) => {
  exec('powershell.exe -Command "Add-Type -AssemblyName System.Windows.Forms; $fileDialog = New-Object System.Windows.Forms.OpenFileDialog; $result = $fileDialog.ShowDialog(); if ($result -eq [System.Windows.Forms.DialogResult]::OK) { $fileDialog.FileName }"', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).send({ error: 'Failed to select file' });
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).send({ error: 'Failed to select file' });
    }

    const filePath = stdout.trim();
    res.send({ filePath });
  });
});


app.post('/delete-file', async (req, res) => {
  const { filename } = req.body;

  if (!filename) {
    return res.status(400).json({ error: 'Filename is required' });
  }

  try {

    const query = `DELETE FROM public.als_1 WHERE filename = '${filename}'`;

    const result = await db.query(query);

    if (result.rowCount > 0) {
      res.json({ message: 'File record deleted successfully' });
    } else {
      res.status(404).json({ message: 'No record found with the provided filename' });
    }
  } catch (err) {
    console.error('Error deleting record:', err);
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

app.post('/add', async (req, res) => {
    console.log(req.body, 'body');
    const filepath = req.body.filepath;
    const newgenerationdate = req.body.newgenerationdate;
    const newimportdate = req.body.newimportdate;
    const filename = path.basename(filepath);

    console.log(filename, 'filename');

    const command = `raster2pgsql -s 25832 -I -M -C -F -a ${filepath} ALS_1 | psql -d master_thesis -h localhost -U postgres -p 5432`;

    try {
        await execPromise(command);
        console.log('Command executed successfully');

        const query = `UPDATE public.als_1 SET timestamp='ALS_1', date='${newgenerationdate}', importdate='${newimportdate}' WHERE filename='${filename}'`;
        console.log(query, 'query');

        await db.query(query);
        res.json('success');
    } catch (error) {
        console.error('Error executing command or query:', error);
        res.status(500).json('Error executing command or query');
    }
});

app.post('/update', async (req, res) => {
    try {
        console.log(req.body, 'body');
        const filepath = req.body.updatefilepath;
        const filename = req.body.updatefilename;
        const FilenameModify = path.basename(filepath); 
        const updatedate = req.body.updatedate;
        const updategenerationdate = req.body.updategenerationdate;
        const updateimportdate = req.body.updateimportdate;
        const deletequery = `DELETE FROM public.als_1 WHERE filename = '${filename}'`;
        console.log(deletequery, 'deletequery');
        await db.query(deletequery); 
        const command = `raster2pgsql -s 25832 -I -M -C -F -a ${filepath} ALS_1 | psql -d master_thesis -h localhost -U postgres -p 5432`;
        console.log(command, 'import command');
        await execPromise(command); 
        const updatequery = `UPDATE public.als_1 SET timestamp='ALS_1', date='${updategenerationdate}', importdate='${updateimportdate}', updatedate='${updatedate}' WHERE filename='${FilenameModify}'`;
        console.log(updatequery, 'updatequery');
        await db.query(updatequery); 
        res.json('success');
    } catch (error) {
        console.error('Error during database operations:', error);
        res.status(500).json({ error: 'An error occurred during the update process.' });
    }
});



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
