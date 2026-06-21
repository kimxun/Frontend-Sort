import api from './api';

export const register = async (
full_name,
username,
email,
password
) => {
try {
const response = await api.post(
'/auth/register',
{
full_name,
username,
email,
password
}
);

return {
  success: true,
  message: response.data.message,
  user: response.data.user
};

} catch (error) {
return {
success: false,
message:
error.response?.data?.message ||
'Đăng ký thất bại'
};
}
};
