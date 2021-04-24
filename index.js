const express = require("express");
const multer = require("multer");
const ImageUploadHelper = require("./helpers/helpers");
const imageUploadHelper = new ImageUploadHelper();
const app = express();
const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

app.disable("x-powered-by");
app.use(multerMid.single("file"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/uploads", async (req, res, next) => {
  try {
    const myFile = req.file;
    const imageUrl = await imageUploadHelper.uploadImage(myFile);
    res.status(200).json({
      message: "Upload was successful",
      imageUrl,
    });
  } catch (error) {
    console.log("error===>", error);
    next(error);
  }
});

app.post("/delete/uploads", async (req, res, next) => {
  try {
    const { body } = req;
    const imageUrl = await imageUploadHelper.deleteUploadedImage(body.imageUrl);
    res.status(200).json({
      message: "Image deleted was successful",
      imageUrl,
    });
  } catch (error) {
    console.log("error===>", error);
    next(error);
  }
});

app.use((err, req, res, next) => {
  res.status(500).json({
    error: err,
    message: "Internal server error!",
  });
  next();
});

app.get("/", () => {
  res.send("server running at post : 9001 ", new Date());
});

app.listen(9001, () => {
  console.log("app now listening for requests!!!");
});
