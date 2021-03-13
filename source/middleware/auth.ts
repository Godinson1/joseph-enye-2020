import { Request, Response, NextFunction } from "express";
import { handleResponse } from "../error";
import { error as errors, success } from "../utility";
import { User } from "../models";
import { admin } from "../firebase/firebase";

// function to check if user is an admin
const Auth = async (req: Request, res: Response, next: NextFunction) => {
  // check if a token is present in the request
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    const Token: string = req.headers.authorization.split("Bearer ")[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(Token);
      req.user = decodedToken;
      const data = await User.findOne({ email: decodedToken.email });
      if (data) {
        req.user.userId = data.id;
        req.user.email = data.email;
        req.user.firstName = data.firstName;
        req.user.lastName = data.lastName;
        return next();
      } else {
        console.log("NO USER FOUND");
        handleResponse(
          res,
          errors,
          403,
          "You are not authorized to carry out this action."
        );
      }
    } catch (error) {
      console.log("AUG-ERROR");
      if (error.code === "auth/argument-error") {
        handleResponse(
          res,
          errors,
          403,
          "You are not authorized to carry out this action."
        );
      } else if (error.code === "auth/id-token-expired") {
        handleResponse(res, errors, 403, "Token expired!");
      } else {
        res.status(500).json({
          status: "error",
          message: "Something went wrong",
          error,
        });
      }
    }
  } else {
    console.log("FORMAT WRONG");
    handleResponse(
      res,
      errors,
      403,
      "You are not authorized to carry out this action."
    );
  }
};

export { Auth };
