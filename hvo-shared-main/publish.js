const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

// Function to increment the version
function incrementVersion(version) {
  const parts = version.split(".").map(Number);
  parts[2] += 1; // Increment the patch version (e.g., 1.0.22 -> 1.0.23)
  return parts.join(".");
}

// Path to the package.json file
const packageJsonPath = __dirname + "/package.json";

// Read package.json
fs.readFile(packageJsonPath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading package.json:", err);
    return;
  }

  const packageJson = JSON.parse(data);

  // Increment the version
  const newVersion = incrementVersion(packageJson.version);
  packageJson.version = newVersion;

  // Write the updated package.json back to disk
  fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), "utf8", (err) => {
    if (err) {
      console.error("Error writing package.json:", err);
      return;
    }

    const npmToken = process.env.NPM_TOKEN;

    if (!npmToken) {
      console.error("NPM_TOKEN environment variable is not set. Please set it before running the script.");
      return;
    }

    // Create a temporary .npmrc file for authentication
    const npmrcPath = path.join(__dirname, ".npmrc");
    fs.writeFileSync(npmrcPath, `//registry.yarnpkg.com/:_authToken=${npmToken}`);

    // Run npm publish
    exec("npm publish", (err, stdout, stderr) => {
      // Remove the temporary .npmrc file
      fs.unlinkSync(npmrcPath);

      if (err) {
        console.error("Error publishing package:", err);
        console.error(stderr);
        return;
      }

      console.log(stdout);
      console.log("Package published successfully.");
    });
  });
});
