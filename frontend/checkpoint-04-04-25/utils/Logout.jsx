// /src/utils/logout.js

export const logout = () => {
  // Perform the logout action, like clearing localStorage or updating state
  console.log("Logging out...");
  localStorage.removeItem("user");
};
