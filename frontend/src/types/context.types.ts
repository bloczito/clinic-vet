
export interface UserContextState {
	token: string | null;
	isDoctor: boolean | null;
	logIn: (token: string, isDoctor: string) => void;
	logOut: () => void;
}
