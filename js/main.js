/*
Author      : Sherebiah Tisbi & Vincent L
Date Modified: 3/14/22
Goal        : Main js for electron app for sermon downloader
Change Log  : CustomMenu3/11
*/

//Lets App Open Browser Menu
const {shell} = require('electron')
const os = require('os');
const fs = require('fs');
const {dialog} = require('electron')
const { remote } = require('electron')
var sermonbasepath = fs.readFileSync("download_directory.txt").toString('utf-8');


 //handle setupevents as quickly as possible
 const setupEvents = require('../js/setupEvents');
 if (setupEvents.handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
 }

const { app, BrowserWindow, screen, Menu } = require('electron');
var path = require('path');
var window;

//create main GUI window
function createWindow() {
    var display = screen.getPrimaryDisplay();
    window = new BrowserWindow({
        width: display.bounds.width - 500,
        height: display.bounds.height - 200,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true,
        },
        icon:'../images/sermonindex-logo1.png'
    });

    //Custom App Menu
     var menu = Menu.buildFromTemplate([
    {
        label: 'Menu',
            submenu: [
            {
                label:'Sermonindex.net',
                click() { 
                    shell.openExternal('https://sermonindex.net')
                } 
            },
            {
                label:'Open Sermon Folder',
                click(){
                    shell.openPath(sermonbasepath) 
                }
            },
            {
                label:'Change Download Directory',
                click(){
                    dialog.showOpenDialog({
                   properties: ['openDirectory']
                    }).then(result => {
                    console.log(result.filePaths)
                    fs.writeFile('download_directory.txt', result.filePaths.join() + "\\", (error) => {
                    // In case of a error throw err exception.
                    if (error) throw err;
                        });
                     dialog.showMessageBox(window, {
                        message: 'Please restart program to take effect.',
                    });

                   })
                }

            },
            {type:'separator'}, 
            {
                label:'Dev Tools',
                click(){
                    window.webContents.openDevTools();
                }
            },
            {type:'separator'}, 
            {
                label:'Close App', 
                click() { 
                    app.quit()  
                } 
            }
        ]
    }
  ]) 
  Menu.setApplicationMenu(menu); 
    // window.setMenu(null);
    window.loadFile('index2.html');
    //console.log(screen.getPrimaryDisplay());
    //console.log(os.platform());
}



app.on('ready',createWindow);

//Quit the app (main process) when all windows are closed
app.on('window-all-closed', () => {
    app.quit();
    // if (process.platform != 'darwin'){
    //     app.quit();
    // }
});

/* DEPRECATED CODE
// ipcMain.handle('showdialog', async (event, args) => {
//     console.log(args);
//     var options = args;
//     dialog.showOpenDialog(window, options);
// });

// ipcMain.handle('openthesite', async (event, args) => {
//     console.log(args);
//     console.log(args['url']);
//     switch (process.platform) {
//         case 'darwin':
//             machine.execSync('open ' + args['url']);
//             break;
//         case 'win32':
//             machine.execSync('start ' + args['url']);
//             break;
//         case 'linux':
//             machine.execSync('xdg-open www.sermonindex.com');
//             break;
//     }
// });
*/