const fs = require("fs");
// targetPath should reflect where the .env file should go
const targetPath = "./src/environments/environment.prod.ts";
const envConfigFile = `
export const environment = {
  production: true,
  // name should match Netlify env key/keys
  apiUrl: '${process.env["API_URL"]}'
};
`;
fs.writeFileSync(targetPath, envConfigFile);
console.log(`Output generated at ${targetPath}`);
