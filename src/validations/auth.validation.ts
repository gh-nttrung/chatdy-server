import { check } from "express-validator";

// Validation rules
export const loginRules = [
  check("user_name")
    .isLength({ min: 5, max: 50 })
    .withMessage("This field must be between 5 and 20 characters"),
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];
