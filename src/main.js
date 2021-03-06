// Modules to control application life and create native browser window
const { app, BrowserWindow, dialog, Menu } = require("electron");
const fs = require("fs");
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    titleBarStyle: "hidden"
  });

  // and load the index.html of the app.
  mainWindow.loadURL("http://localhost:3000");

  // Replace our top default menu with a template we created.
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Open Folder",
          accelerator: "CmdOrCtrl + F",
          click() {
            openDir();
          }
        },
        {
          label: "Open File",
          accelerator: "CmdOrCtrl + O",
          click() {
            openFile();
          }
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "pasteandmatchstyle" },
        { role: "delete" },
        { role: "selectall" }
      ]
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forcereload" },
        { role: "toggledevtools" },
        { type: "separator" },
        { role: "resetzoom" },
        { role: "zoomin" },
        { role: "zoomout" },
        { type: "separator" },
        { role: "togglefullscreen" }
      ]
    },
    {
      role: "window",
      submenu: [{ role: "minimize" }, { role: "close" }]
    },
    {
      label: "Developer",
      submenu: [
        {
          label: "Toggle Dev Tools",
          // accelerators are just keyboard shortcuts
          accelerator:
            process.platform === "darwin" ? "Alt+Command+I" : "Ctrl+Shift+I",
          click() {
            // allows us to use dev tools in the project
            mainWindow.webContents.toggleDevTools();
          }
        }
      ]
    }
  ];

  // if the platform is MacOS
  if (process.platform === "darwin") {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideothers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" }
      ]
    });

    // Edit menu
    template[2].submenu.push(
      { type: "separator" },
      {
        label: "Speech",
        submenu: [{ role: "startspeaking" }, { role: "stopspeaking" }]
      }
    );

    // Window menu
    template[4].submenu = [
      { role: "close" },
      { role: "minimize" },
      { role: "zoom" },
      { type: "separator" },
      { role: "front" }
    ];
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Opens file
function openFile() {
  // look for markdown files
  const files = dialog.showOpenDialog(mainWindow, {
    properties: ["openFile"],
    filters: [
      {
        name: "Markdown",
        extensions: ["mdx", "md", "markdown", "txt", "docx"]
      }
    ]
  });

  // if no files are found, quit.
  if (!files) return;

  // Since showOpenDialog returns an array, we want only the first file.
  const file = files[0];

  // Import fs to read the file and convert it to string
  const fileContent = fs.readFileSync(file).toString();

  // Send file content to a renderer
  mainWindow.webContents.send("new-file", fileContent);
}
// Opens Directory
function openDir() {
  const directory = dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
    extensions: ["mdx", "md", "markdown", "txt", "docx"]
  });

  if (!directory) return;
  const dir = directory[0];

  fs.readdir(dir, (err, files) => {
    const filteredFiles = files.filter(file => file.includes(".md"));
    const filePaths = filteredFiles.map(file => `${dir}/${file}`);

    mainWindow.webContents.send("new-dir", filePaths, dir);
  });
}
