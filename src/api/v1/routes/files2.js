const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const bucket_Name = process.env.BUCKET_NAME;
const bucket_Region = process.env.BUCKET_REGION;
const access_Key = process.env.ACCESS_KEY;
const secret_Access = process.env.SECRET_ACCESS;

const s3 = new S3Client({
  credentials: {
    accessKeyId: access_Key,
    secretAccessKey: secret_Access,
  },
  region: bucket_Region,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/files", upload.single("images"), async (req, res) => {
  const fileExtention = path.extname(req.file.originalname);
  const fileName =
    req.file.originalname
      .replace(fileExtention, "")
      .toLowerCase()
      .split(" ")
      .join("-") +
    "-" +
    Date.now();

  const params = {
    Bucket: bucket_Name,
    Key: fileName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };
  const command = new PutObjectCommand(params);

  await s3.send(command);

  const getObjectParams = {
    Bucket: bucket_Name,
    Key: fileName,
  };
  const command2 = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(s3, command2, { expiresIn: 600 });

  res.send({ url: url });
});
module.exports = router;
