const util = require("util");
const gc = require("../config");
const bucket = gc.bucket("your bucket name"); // should be your bucket name

class ImageUploadHelper {
  constructor() {}

  uploadImage = (file) => {
    const { originalname, buffer } = file;
    return new Promise((resolve, reject) => {
      const blob = bucket.file(originalname.replace(/ /g, "_"));
      const blobStream = blob.createWriteStream({
        resumable: false,
      });
      blobStream
        .on("finish", () => {
          const publicUrl = util.format(
            `https://storage.googleapis.com/${bucket.name}/${blob.name}`
          );
          resolve(publicUrl);
        })
        .on("error", () => {
          reject(`Unable to upload image, something went wrong`);
        })
        .end(buffer);
    });
  };

  deleteUploadedImage = async (imageUrl) => {
    try {
      let imgUrl = imageUrl.split("/");
      imgUrl = imgUrl.slice(4, imgUrl.length + 1).join("/");
      return await bucket.file(imgUrl).delete();
    } catch (error) {
      console.log("error while deleting image===>");
      throw error;
    }
  };
}

module.exports = ImageUploadHelper;
