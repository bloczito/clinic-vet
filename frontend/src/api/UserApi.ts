import axios from "../config/axios.config";


const changePassword = (currentPassword: string, password: string): Promise<void> => {
	return axios.put("/change_password", {
		currentPassword,
		password
	})
}

export const userApi = {
	changePassword
}
