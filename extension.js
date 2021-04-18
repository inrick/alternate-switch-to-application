'use strict';

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const Gio = imports.gi.Gio;
const Main = imports.ui.main;
const Meta = imports.gi.Meta;
const Shell = imports.gi.Shell;

const KEYBINDINGS = [
  'switch-to-application-window-1',
  'switch-to-application-window-2',
  'switch-to-application-window-3',
  'switch-to-application-window-4',
  'switch-to-application-window-5',
  'switch-to-application-window-6',
  'switch-to-application-window-7',
  'switch-to-application-window-8',
  'switch-to-application-window-9',
  'switch-to-application-window-10',
];

class Extension {
  constructor() {
    this.appId = '';
    this.windows = [];
    this.windowIndex = 0;

    this.settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.alternate-switch-to-application');
  }

  enable() {
    log(`Enabling ${Me.metadata.name}`);
    this._addKeybindings();
  }

  disable() {
    log(`Disabling ${Me.metadata.name}`);
    this._removeKeybindings();
  }

  _addKeybindings() {
    for (let i = 0; i < KEYBINDINGS.length; i++) {
      Main.wm.addKeybinding(
        KEYBINDINGS[i],
        this.settings,
        Meta.KeyBindingFlags.NONE,
        Shell.ActionMode.NORMAL | Shell.ActionMode.OVERVIEW,
        () => this._switchToApplication(i),
      );
    }
  }

  _removeKeybindings() {
    for (let i = 0; i < KEYBINDINGS.length; i++) {
      Main.wm.removeKeybinding(KEYBINDINGS[i]);
    }
  }

  _switchToApplication(i) {
    const apps = Main.overview.dash._box.get_children().filter(actor =>
      actor.child && actor.child.app
    ).map(actor => actor.child.app);

    if (i >= apps.length) {
      return;
    }

    const app = apps[i];
    const windows = app.get_windows().filter(w => !w.skip_taskbar);

    // Otherwise, activate the next not yet focused window of the selected
    // application, or start a new instance if the application has no windows.

    const appId = app.get_id();
    // If the last active app was another one or if the window list has been
    // updated (approximated by length, HACK).
    if (this.appId != appId || this.windows.length != windows.length) {
      this.appId = appId;
      this.windows = windows;
      this.windowIndex = 0;
    }

    // If application has no open windows, start a new instance.
    if (windows.length == 0) {
      app.open_new_window(-1);
      return;
    }

    if (this.windows[this.windowIndex].has_focus()) {
      this.windowIndex = (this.windowIndex + 1) % this.windows.length;
    }

    Main.activateWindow(this.windows[this.windowIndex]);
  }
}

function init() {
  return new Extension();
}
