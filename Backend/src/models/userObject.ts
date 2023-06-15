export default function userObject(user: any, token: any) {
  const userObject = {
    token: token,
    id: user.id,
    name: user.name,
    lastName: user.lastName,
    profilePhoto: user.profilePhoto,
    nickname: user.nickname,
    email: user.email,
    roleLevel: user.roleLevel,
    phone: user.phone,
    createdDate: user.createdDate,
  };
  return userObject;
}
