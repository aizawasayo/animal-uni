const TokenKey = "animal_token";

export function getToken() {
	return uni.getStorageSync(TokenKey);
}

export function setToken(token) {
	return uni.setStorageSync(TokenKey, token);
}

export function removeToken() {
	return uni.removeStorageSync(TokenKey);
}

export function getUserId() {
	return uni.getStorageSync("userId");
}

export function setUserId(userId) {
	return uni.setStorageSync("userId", userId);
}

export function removeUserId() {
	return uni.removeStorageSync("userId");
}
