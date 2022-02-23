import express from "express";

const router = express.Router();

router.get("/login", (req, res, next) => {
  res.send("login");
});

export default router;
