import axios from 'axios';
import React, { useRef, useState, useEffect, useContext } from 'react';
import { useController } from 'react-hook-form';
import { SocketContext } from '../../context';
import { AxiosJwt } from '../../hooks';

export function Collection() {

	const [selectedFile, setSelectedFile] = useState(null);

	const handleSubmit = async (event) => {
		event.preventDefault()
		const formData = new FormData();
		formData.append("selectedFile", selectedFile);
		try {
			const response = await axios({
				method: "post",
				url: "/api/upload/file",
				data: formData,
				headers: { "Content-Type": "multipart/form-data" },
			});
		} catch (error) {
			console.log(error)
		}
	}

	const handleFileSelect = (event) => {
		setSelectedFile(event.target.files[0])
	}

	return (
		<form onSubmit={handleSubmit}>
			<input type="file" onChange={handleFileSelect} />
			<input type="submit" value="Upload File" />
		</form>
	)
}