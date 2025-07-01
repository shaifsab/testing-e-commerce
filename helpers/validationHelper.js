// Validates if the provided email matches a basic email format
const emailValidator = (mail) => {
  let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (regex.test(mail)) {
    return false; // Returns false if email is valid
  } else {
    return true; // Returns true if email is invalid
  }
};

module.exports = { emailValidator };