import axiosFactory from "axios";
import { HOST } from "../constant";

const axios = axiosFactory.create({
	baseURL: HOST,
});

// axios.interceptors.response.use(response => response.data);

export default axios;
