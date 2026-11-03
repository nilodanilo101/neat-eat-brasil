import { app, BrowserWindow, dialog, shell } from 'electron';
import pkg from 'electron-updater';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const { autoUpdater } = pkg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mainWindow = null;
let serverInstance = null;
let serverPort = null;
let sessionToken = crypto.randomBytes(32).toString('hex');

function setupAutoUpdater() {
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('error', () => {
    // Silencioso caso esteja sem internet ao abrir
  });

  autoUpdater.on('update-downloaded', (info) => {
    const rawNotes =
      typeof info.releaseNotes === 'string'
        ? info.releaseNotes.replace(/<[^>]*>?/gm, '').trim()
        : '';

    const notesSection = rawNotes
      ? `\n📋 Novidades da versão v${info.version}:\n${rawNotes}\n\n`
      : '\n';

    dialog
      .showMessageBox(mainWindow, {
        type: 'info',
        title: `Nova Atualização Disponível (v${info.version})`,
        message: `A versão v${info.version} do NeatEat Brasil foi baixada automaticamente.`,
        detail: `${notesSection}Seus dados, cardápio e geladeira continuarão salvos. Deseja reiniciar agora para aplicar a atualização?`,
        buttons: ['Reiniciar e Atualizar', 'Mais Tarde'],
        defaultId: 0,
      })
      .then(({ response }) => {
        if (response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
  });
}

async function checkForUpdatesOnStartup() {
  if (!app.isPackaged) return;
  try {
    await autoUpdater.checkForUpdatesAndNotify();
  } catch {
    // Ignora falhas de rede silenciosamente
  }
}

async function createWindow() {
  // Salva o SQLite na pasta segura do sistema operacional para preservar dados em atualizações
  process.env.NEATEAT_DATA_DIR = app.getPath('userData');

  if (!serverInstance) {
    const { startServer } = await import('../server/index.js');
    const distPath = path.join(__dirname, '..', 'dist');

    const { server, port } = await startServer({
      port: 0,
      isPackaged: true,
      distPath,
      appVersion: app.getVersion(),
      sessionToken,
    });

    serverInstance = server;
    serverPort = port;
  }

  const iconPath = path.join(__dirname, '..', 'build', 'icon.png');
  if (process.platform === 'darwin' && app.dock && !app.isPackaged) {
    try {
      app.dock.setIcon(iconPath);
    } catch {
      // Ignore if icon missing
    }
  }

  mainWindow = new BrowserWindow({
    width: 1360,
    height: 880,
    minWidth: 960,
    minHeight: 640,
    icon: iconPath,
    title: 'NeatEat Brasil — Planejador de Refeições & Ficha Técnica',
    backgroundColor: '#020617',
    vibrancy: 'under-window',
    visualEffectState: 'active',
    titleBarStyle: 'default',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
  });

  if (!app.isPackaged) {
    mainWindow.webContents.on('console-message', (_event, level, message, line, sourceId) => {
      if (level >= 2) {
        console.error(`[Renderer Error] ${message} (${sourceId}:${line})`);
      }
    });
  }

  await mainWindow.loadURL(`http://127.0.0.1:${serverPort}/?token=${sessionToken}`);

  // Bloqueia tentativas de navegação da janela principal para domínios remotos (Anti-Phishing/XSS)
  mainWindow.webContents.on('will-navigate', (e, url) => {
    try {
      const parsed = new URL(url);
      if (parsed.origin !== `http://127.0.0.1:${serverPort}`) {
        e.preventDefault();
        shell.openExternal(url);
      }
    } catch {
      e.preventDefault();
    }
  });

  mainWindow.webContents.on('will-redirect', (e, url) => {
    try {
      const parsed = new URL(url);
      if (parsed.origin !== `http://127.0.0.1:${serverPort}`) {
        e.preventDefault();
        shell.openExternal(url);
      }
    } catch {
      e.preventDefault();
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(async () => {
  setupAutoUpdater();
  await createWindow();
  // Verifica atualizações apenas uma única vez ao abrir o aplicativo
  await checkForUpdatesOnStartup();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('before-quit', () => {
  if (serverInstance) {
    serverInstance.close();
    serverInstance = null;
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
