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
app.get("/files", (req, res) => {
  const directoryPath = "C:\\react"; // Change this to your directory path
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    // Array to store file information
    const fileInfo = [];

    // Iterate through each file
    files.forEach((file) => {
      const filePath = path.join(directoryPath, file); // Use path.join to concatenate directory path and file name

      // Get file stats
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error("Error getting file stats:", err);
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

        // Push file information to fileInfo array
        fileInfo.push({
          name: file,
          path: filePath,
          size: stats.size, // Size of the file in bytes
          fileType: fileType,
        });

        // If all files have been processed, send the fileInfo array as JSON response
        if (fileInfo.length === files.length) {
          res.json(fileInfo);
        }
      });
    });
  });
});

app.get("/openFile", (req, res) => {
  const { filePath } = req.query;

  if (!filePath) {
    res.status(400).json({ error: "Missing filePath parameter" });
    return;
  }

  // Execute system command to open file explorer with the specified file path
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

app.listen(3000, () => console.log("GraphQL server running on localhost:3000"));
