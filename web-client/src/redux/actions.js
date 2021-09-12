export const loginSuccess = (user) => {
  return { type: "login/success", payload: user };
};

export const loginFail = () => {
  return { type: "login/fail" };
};

export const sendMessage = (data) => {
  return { type: "message/send", payload: data };
};

export const markMessageRead = (id) => {
  return { type: "message/read", payload: id };
};

export const createNewConversation = (data) => {
  return { type: "conversation/new", payload: data };
};

export const modifyConversation = (data) => {
  return { type: "conversation/update", payload: data };
};

export const logout = () => {
  return { type: "logout" };
};
