const app = document.querySelector("main");
app.parentNode.removeChild(app);

const error = document.createElement("div");
error.style.textAlign = "center";
error.style.color = "red";
error.innerHTML = `
  <p>This browser doesn't support ES Modules.</p>
  <p>Please use modern browsers supporting ES Modules to run Mitty.</p>
`;

document.body.appendChild(error);
