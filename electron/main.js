import { app, BrowserWindow, dialog, shell } from 'electron';
import pkg from 'electron-updater';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { autoUpdater } = pkg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mainWindow = null;
let serverInstance = null;

let updateState = {
  status: 'idle',
  message: 'Versão atualizada',
  version: app.getVersion(),
};

function setupAutoUpdater() {
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('checking-for-update', () => {
    updateState = {
      status: 'checking',
      message: 'Verificando atualizações...',
      version: app.getVersion(),
    };
  });

  autoUpdater.on('update-available', (info) => {
    updateState = {
      status: 'downloading',
      message: `Baixando nova versão v${info.version}...`,
      version: app.getVersion(),
    };
  });

  autoUpdater.on('update-not-available', () => {
    updateState = {
      status: 'up-to-date',
      message: `Você está na versão mais recente (v${app.getVersion()})`,
      version: app.getVersion(),
    };
  });

  autoUpdater.on('error', (err) => {
    updateState = {
      status: 'idle',
      message: `v${app.getVersion()} (Pronto para GitHub Releases)`,
      version: app.getVersion(),
      detail: err?.message,
    };
  });

  autoUpdater.on('update-downloaded', (info) => {
    const rawNotes =
      typeof info.releaseNotes === 'string'
        ? info.releaseNotes.replace(/<[^>]*>?/gm, '').trim()
        : '';

    updateState = {
      status: 'ready',
      message: `Nova versão v${info.version} pronta para instalar!`,
      version: app.getVersion(),
      nextVersion: info.version,
      releaseNotes: rawNotes,
    };

    const notesSection = rawNotes
      ? `\n📋 Novidades da versão v${info.version}:\n${rawNotes}\n\n`
      : '\n';

    dialog
      .showMessageBox(mainWindow, {
        type: 'info',
        title: `Novidades da Versão v${info.version} — NeatEat Brasil`,
        message: `A nova versão v${info.version} foi baixada automaticamente!`,
        detail: `${notesSection}Seus dados, cardápio e geladeira continuarão salvos. Ao reiniciar, você também verá o resumo completo de novidades na tela.`,
        buttons: ['Reiniciar e Ver Novidades', 'Mais Tarde'],
        defaultId: 0,
      })
      .then(({ response }) => {
        if (response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
  });
}

async function checkForUpdatesSafe() {
  if (!app.isPackaged) {
    updateState = {
      status: 'up-to-date',
      message: `Modo Desenvolvimento (v${app.getVersion()})`,
      version: app.getVersion(),
    };
    return;
  }
  try {
    await autoUpdater.checkForUpdatesAndNotify();
  } catch (err) {
    updateState = {
      status: 'idle',
      message: `v${app.getVersion()} — Configure o repositório GitHub para updates remotos`,
      version: app.getVersion(),
    };
  }
}

async function createWindow() {
  // Store SQLite in OS userData folder so updates never erase user's database
  process.env.NEATEAT_DATA_DIR = app.getPath('userData');

  const { startServer } = await import('../server/index.js');
  const distPath = path.join(__dirname, '..', 'dist');

  const { server, port } = await startServer({
    port: 0, // automatically picks an available port on 127.0.0.1
    isPackaged: true,
    distPath,
    appVersion: app.getVersion(),
    onCheckUpdates: checkForUpdatesSafe,
    getUpdateStatus: () => updateState,
  });

  serverInstance = server;

  mainWindow = new BrowserWindow({
    width: 1360,
    height: 880,
    minWidth: 960,
    minHeight: 640,
    title: 'NeatEat Brasil — Planejador de Refeições & Orçamento',
    backgroundColor: '#F8FAFC',
    titleBarStyle: 'default',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  await mainWindow.loadURL(`http://127.0.0.1:${port}`);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(async () => {
  setupAutoUpdater();
  await createWindow();
  await checkForUpdatesSafe();

  // Check for updates every 30 minutes while open
  setInterval(() => {
    if (app.isPackaged) {
      checkForUpdatesSafe();
    }
  }, 30 * 60 * 1000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (serverInstance) {
    serverInstance.close();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
