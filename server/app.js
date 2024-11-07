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

app.post("/send-email", async (req, res) => {
  console.log("Received request body:", req.body); // Log to ensure body is parsed
  const { email, subject, Content } = req.body;

  if (!email || !subject || !Content) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const htmlContent = generateTasksTableHTML(Content); // Generate HTML content for the email

  const mailOptions = {
    from: "adedaher6@gmail.com", // Sender email
    to: email, // Recipient email
    subject: subject, // Subject of the email
    html: htmlContent, // HTML body of the email
  };

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "adedaher6@gmail.com",
        pass: "Goshonda123@",
      },
    });

    const info = transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
    res.json({ success: true, message: info.response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
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

function generateTasksTableHTML(tasks) {
  let html = `
    <h2>Tasks List</h2>
    <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
      <thead>
        <tr>
          <th>Task Name</th>
          <th>Task Partners</th>
          <th>Status</th>
          <th>Deadline</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
  `;

  tasks.forEach((task) => {
    html += `
      <tr>
        <td>${task.task_name}</td>
        <td>${task.task_partners}</td>
        <td>${task.task_status}</td>
        <td>${task.task_deadline}</td>
        <td>${task.task_description}</td>
      </tr>
    `;

    // If there are subtasks, include them in the table as well
    if (task.subtasks && task.subtasks.length > 0) {
      task.subtasks.forEach((subtask) => {
        html += `
          <tr style="background-color: #f9f9f9;">
            <td colspan="1"> - ${subtask.subtask_name}</td>
            <td colspan="2">${subtask.subtask_status}</td>
            <td>${subtask.subtask_deadline}</td>
            <td>${subtask.subtask_description}</td>
          </tr>
        `;
      });
    }
  });

  html += `
      </tbody>
    </table>
  `;
  return html;
}
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
