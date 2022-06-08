import axios from "../config/axios.config";


const changePassword = (password: string): Promise<void> => {
	return axios.put("/change_password", {
		password
	})
}

export const userApi = {
	changePassword
}
