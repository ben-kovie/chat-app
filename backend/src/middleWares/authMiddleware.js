import jwt from "jsonwebtoken";
import { User } from "../model/userModel.js";
import ApiError from "../middleWares/ApiError.js";

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError("Unauthorized user", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.userId || decoded.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return next(new ApiError("User not found", 404));
    }

    req.user = user;

    next();
  } catch (error) {
    return next(new ApiError("Unauthorized user", 401));
  }
};

export default auth;