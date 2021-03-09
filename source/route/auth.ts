import { Request, Response } from "express";
import { validateLogin, validateReg } from "../validation";
import { handleResponse } from "../error";
import { error as errors, success } from "../utility";
import { User } from "../models";
import { firebase } from "../firebase/firebase";

const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    const { error, valid } = validateLogin({
      email,
      password,
    });

    if (!valid) handleResponse(res, errors, 400, error);

    const authResponse: any = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    const token = await authResponse.user.getIdToken();
    return res.status(200).json({
      status: success,
      message: "Successfully signed in.",
      token,
    });
  } catch (err) {
    console.log(err);
    if (
      err.code === "auth/wrong-password" ||
      err.code === "auth/user-not-found"
    ) {
      return handleResponse(
        res,
        errors,
        404,
        "Wrong credentials! Please, try again."
      );
    } else {
      return handleResponse(res, errors, 500, "Something went wrong");
    }
  }
};

const registerUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const { error, valid } = validateReg({
      email,
      password,
      lastName,
      firstName,
    });

    if (!valid) handleResponse(res, errors, 400, error);

    const authResponse: any = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
    });
    await newUser.save();
    const token = await authResponse.user.getIdToken();
    return res.status(200).json({
      status: success,
      message: "Registered successfully.",
      token,
    });
  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      return handleResponse(res, errors, 404, `User already exist.`);
    } else {
      return handleResponse(res, errors, 500, "Something went wrong");
    }
  }
};

export { loginUser, registerUser };
