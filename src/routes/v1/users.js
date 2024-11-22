import express from "express";

const router = express.Router();

router.use("/", (req, res) => {
  return res.json({
    message: "All users",
  });
});

export default router;
