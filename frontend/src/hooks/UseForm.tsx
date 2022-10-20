import { useState } from "react";

export const useForm = ({ form, additionalData, endpointUrl }) => {
	const [status, setStatus] = useState("");
	const [message, setMessage] = useState("");

	const handleSubmit = (e) => {
		if (form) {
			e.preventDefault();
			setStatus("loading");
			setMessage("");
		}
	}
}