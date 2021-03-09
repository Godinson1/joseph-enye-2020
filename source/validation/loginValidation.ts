import { loginData, isEmpty, isEmail, isGreater } from "./index";

const validateLogin = ({
  email,
  password,
}: loginData): { error: string; valid: boolean } => {
  let error = "";

  if (isEmpty(email)) error = "Email must not be empty";
  if (!isEmail(email)) error = "Must be a valid email adddress.";
  if (isEmpty(password)) error = "Password must not be empty";
  if (isGreater(password)) error = "Password must have at least 6 characters";

  return {
    error,
    valid: error === "" ? true : false,
  };
};

export { validateLogin };
