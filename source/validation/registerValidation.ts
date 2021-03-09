import { registerData, isEmpty, isEmail, isGreater } from "./index";

const validateReg = ({
  firstName,
  lastName,
  email,
  password,
}: registerData): { error: string; valid: boolean } => {
  let error = "";
  if (isEmpty(email)) error = "Email must not be empty";
  else if (!isEmail(email)) error = "Must be a valid email address";

  if (isEmpty(password)) error = "Password must not be empty";

  if (isGreater(password)) error = "Password must have at least 6 characters";

  if (isEmpty(firstName)) error = "First Name must not be empty";
  if (isEmpty(lastName)) error = "Last Name must not be empty";

  return {
    error,
    valid: error === "" ? true : false,
  };
};

export { validateReg };
