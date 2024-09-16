import React, {
	useState,
	useEffect
} from 'react';
import $ from 'jquery';
//The DTM data management panel
const PopupContent2 = ({
	als_1data,
	setAls_1boundary,
	ALS_pop,
	setAls_1data,
	setALS_1update,
	ALS_1,
	setALS_1,
	setRefreshKey
}) => {
	const [showImportRow, setShowImportRow] = useState(false);
	const [filepath, setFilepath] = useState('');
	const [updatefilepath, setUpdatefilepath] = useState('');
	const [newgenerationdate, setNewgenerationdate] = useState('');
	const [newimportdate, setNewimportdate] = useState('');
	const [updatedate, setUpdatedate] = useState('');
	const [updatingRowIndex, setUpdatingRowIndex] = useState(null);
	const [selectedRow, setSelectedRow] = useState(null);
	const [updatefilename, setUpdatefilename] = useState('');
	const [updategenerationdate, setUpdategenerationdate] = useState('');
	const [updateimportdate, setUpdateimportdate] = useState('');

	const getRowStyle = (row) => {
		return row === selectedRow ? {
			backgroundColor: 'red'
		} : {};
	};

	const handleUpdatetotalClick = () => {
		$.ajax({
			url: 'http://localhost:3000/update',
			method: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({
				updatefilepath,
				updatefilename,
				updatedate,
				updategenerationdate,
				updateimportdate
			}),
			success: function() {
				alert('Update successfully');
				setRefreshKey(prevKey => prevKey + 1);
				setUpdatingRowIndex(null)
				setUpdatefilepath('')
			},
			error: function(xhr, status, error) {
				console.error('Error Import file:', error);
			}
		});
	};

	const handleRowClick = (row) => {
		setAls_1boundary(row.raster_extent_geojson);
		setSelectedRow(row);
	};

	const handleImportClick = () => {
		setShowImportRow(true);
	};

	const handleAddClick = () => {
		$.ajax({
			url: 'http://localhost:3000/add',
			method: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({
				filepath,
				newgenerationdate,
				newimportdate
			}),
			success: function() {
				alert('Import the DTM data successfully!');
				setRefreshKey(prevKey => prevKey + 1);
				setShowImportRow(false);
			},
			error: function(xhr, status, error) {
				console.error('Error Import file:', error);
			}
		});
	};

	const handleChooseFileClick = () => {
		$.ajax({
			url: 'http://localhost:3000/select-file',
			method: 'GET',
			success: function(data) {
				setFilepath(data.filePath);
				alert(`You have selected the file: ${data.filePath}`)
			},
			error: function(xhr, status, error) {
				console.error('Error fetching file path:', error);
			}
		});
	};

	useEffect(() => {
		if(updategenerationdate && updatefilepath) {
			handleUpdatetotalClick();
		}
	}, [updategenerationdate, updatefilepath]);

	const handleUpdateFileClick = () => {
		$.ajax({
			url: 'http://localhost:3000/select-file',
			method: 'GET',
			success: function(data) {
				const userConfirmed = window.confirm(`You have selected the file: ${data.filePath}. Do you want to proceed?`);

				if(userConfirmed) {
					setUpdatefilepath(data.filePath);
				} else {
					console.log("File selection canceled by the user.");
				}
			},
			error: function(xhr, status, error) {
				console.error('Error fetching file path:', error);
			}
		});
	};

	const handleDeleteClick = (index) => {
		const rowToDelete = als_1data[index];
		const filenameToDelete = rowToDelete.filename;

		$.ajax({
			url: 'http://localhost:3000/delete-file',
			method: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({
				filename: filenameToDelete
			}),
			success: function(response) {
				alert('Delete the DTM data successfully!')
				setRefreshKey(prevKey => prevKey + 1);
			},
			error: function(xhr, status, error) {
				console.error('Error deleting file:', error);
			}
		});
	};

	const formatDateToYYYYMMDD = (date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	};

	const handleUpdateClick = (index) => {
		setUpdatingRowIndex(index);
		const filename = als_1data[index].filename
		const generationdate = formatDateToYYYYMMDD(new Date(als_1data[index].date));
		const importdate = formatDateToYYYYMMDD(new Date(als_1data[index].importdate));
		const currentDate = formatDateToYYYYMMDD(new Date());

		setUpdatedate(currentDate);
		setUpdatefilename(filename);
		als_1data[index].updatedate = currentDate;
		setUpdateimportdate(importdate);

	};

	const handleRefreshClick = () => {
		setRefreshKey(prevKey => prevKey + 1);
	};

	return(
		<div>
      <h2>{ALS_pop} Information</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Timestamp</th>
            <th>Filename</th>
            <th>Generation date</th>
            <th>Import date</th>
            <th>Update date</th>
            <th>Action</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(als_1data) && als_1data.length > 0 ? (
            als_1data.map((row, index) => (
              <tr key={index} style={getRowStyle(row)} onClick={() => handleRowClick(row)}>
                <td>{index + 1}</td>
                <td>{row.timestamp}</td>
                <td>
                  {updatingRowIndex === index ? (
                    <button onClick={handleUpdateFileClick}>Please choose the file</button>
                  ) : (
                    row.filename
                  )}
                </td>
                 <td>
                  {updatingRowIndex === index ? (
                     <input
                  type="date"
                  value={updategenerationdate}
                  onChange={(e) => {
                    const updatedValue = e.target.value;
                    setUpdategenerationdate(updatedValue);
                  }}
                />
                  ) : (
                    new Date(row.date).toLocaleDateString()
                  )}
                </td>
                <td>{new Date(row.importdate).toLocaleDateString()}</td>
               <td>
  {row.updatedate ? new Date(row.updatedate).toLocaleDateString() : ' '}
</td>
                <td>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(index); }}>Delete</button>
                </td>
                <td>
                  <button onClick={(e) => { e.stopPropagation(); handleUpdateClick(index); }}>Update</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">Please wait...</td>
            </tr>
          )}

          {showImportRow && (
            <tr>
              <td>{als_1data.length + 1}</td>
              <td>ALS_1</td>
              <td>
                <button onClick={handleChooseFileClick}>Please choose the file</button>
              </td>
              <td>
                <input
                  type="date"
                  value={newgenerationdate}
                  onChange={(e) => {
                    const updatedValue = e.target.value;
                    setNewgenerationdate(updatedValue);
                    console.log(updatedValue, 'generationdate');
                  }}
                />
              </td>
              <td>
                <input
                  type="date"
                  value={newimportdate}
                  onChange={(e) => {
                    const updatedValue = e.target.value;
                    setNewimportdate(updatedValue);
                    console.log(updatedValue, 'generationdate');
                  }}
                />
              </td>
              <td>
                <button onClick={handleAddClick}>Add</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={handleImportClick}>Import</button>
    </div>
	);
};

export default PopupContent2;