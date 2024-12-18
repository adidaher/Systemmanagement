const graphql = require("graphql");
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { GraphQLSchema } = graphql;
const { query } = require("./schemas/query");
const { mutation } = require("./schemas/mutation");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const nodemailer = require("nodemailer");

const schema = new GraphQLSchema({
  query,
  mutation,
});

const app = express();
app.use(
  cors({
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);
app.use(express.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

/*
app.get("/files", (req, res) => {
  const directoryPath = "C:\\react"; // Change this to your directory path
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(files);
  });
});
*/

app.get("/", (req, res) => {
  return res.status(200).json("app is running");
});

app.get("/files", (req, res) => {
  const directoryPath = "C:\\cpalink"; // Specify the path to the directory
  if (!fs.existsSync(directoryPath)) {
    console.error(`Directory does not exist: ${directoryPath}`);
    res.status(404).json({ error: "Directory not found" });
    return;
  }

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    // Create an array of promises for getting file stats
    const statPromises = files.map((file) => {
      const filePath = path.join(directoryPath, file);

      return new Promise((resolve, reject) => {
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.error("Error getting file stats:", err);
            reject(err);
            return;
          }

          // Determine file type based on file extension
          let fileType = "file";
          const fileExtension = path.extname(file).toLowerCase();
          if (stats.isDirectory()) {
            fileType = "directory";
          } else if (fileExtension === ".pdf") {
            fileType = "pdf";
          } else if (fileExtension === ".txt") {
            fileType = "txt";
          }

          // Resolve the promise with the file information
          resolve({
            name: file,
            path: filePath,
            size: stats.size, // Size of the file in bytes
            fileType: fileType,
          });
        });
      });
    });

    // Wait for all promises to be resolved
    Promise.all(statPromises)
      .then((fileInfo) => {
        res.json(fileInfo);
      })
      .catch((err) => {
        res.status(500).json({ error: "Internal server error" });
      });
  });
});

app.get("/openFile", (req, res) => {
  const { filePath } = req.query;

  if (!filePath) {
    res.status(400).json({ error: "Missing filePath parameter" });
    return;
  }

  exec(`start explorer "${filePath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error("Error opening file explorer:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    console.log("File explorer opened successfully");
    res.json({ success: true });
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
