export interface UserAccount {
	name: { value?: string; valid: boolean; invalidMsg?: string };
	phone: { value?: string; valid: boolean; invalidMsg?: string };
	address: { value?: string; valid: boolean; invalidMsg?: string };
	email: { value: string; valid: boolean; invalidMsg?: string };
}

export enum UserCountSettingFeild {
	EMAIL = "email",
	NAME = "name",
	PHONE = "phone",
	ADDRESS = "address",
}
