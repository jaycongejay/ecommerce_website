import { UserAccount, UserCountSettingFeild } from "./ShoppingCartTypes";

export const accountSettingValidation = (
	fieldName: string,
	userAccountSetting: Partial<UserAccount>
) => {
	switch (fieldName) {
		case UserCountSettingFeild.NAME:
			if (
				userAccountSetting[fieldName].value.match(
					/^[a-zA-Z\-\s]{0,20}$/
				) === null
			) {
				userAccountSetting[fieldName].valid = false;
				userAccountSetting[fieldName].invalidMsg =
					"Only alphabets with space up to 20 characters";
				break;
			}
			userAccountSetting[fieldName].valid = true;
			userAccountSetting[fieldName].invalidMsg = "";
			break;
		case UserCountSettingFeild.PHONE:
			if (
				userAccountSetting[fieldName].value.match(/^[0-9]{0,10}$/) ===
				null
			) {
				userAccountSetting[fieldName].valid = false;
				userAccountSetting[fieldName].invalidMsg =
					"Phone number must be of 10 digit";
				break;
			}
			if (userAccountSetting[fieldName].value.includes(" ")) {
				userAccountSetting[fieldName].valid = false;
				userAccountSetting[fieldName].invalidMsg = "No space allowed";
				break;
			}
			userAccountSetting[fieldName].valid = true;
			userAccountSetting[fieldName].invalidMsg = "";
			break;
		case UserCountSettingFeild.ADDRESS:
			if (
				userAccountSetting[fieldName].value.match(
					/^[a-zA-Z0-9\s]{0,20}$/
				) === null
			) {
				userAccountSetting[fieldName].valid = false;
				userAccountSetting[fieldName].invalidMsg =
					"Only alphabets with space between 2 to 20 characters";
				break;
			}
			userAccountSetting[fieldName].valid = true;
			userAccountSetting[fieldName].invalidMsg = "";
			break;
		default:
			break;
	}
};
