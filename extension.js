'use strict';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import Gio from 'gi://Gio';
import Meta from 'gi://Meta';
import Shell from 'gi://Shell';

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

export default class AlternateSwitchToApplicationExtension extends Extension {
  constructor(metadata) {
    super(metadata);

    this.appId = '';
    this.windows = [];
    this.windowsHash = 0;
    this.windowIndex = 0;

    this.settings = this.getSettings('org.gnome.shell.extensions.alternate-switch-to-application');
  }

  enable() {
    log(`Enabling ${this.metadata.name}`);
    this._addKeybindings();
  }

  disable() {
    log(`Disabling ${this.metadata.name}`);
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
    const windowsHash = windows.map(w => w.get_id()).reduce((x, y) => x^y, 0);
    // If the last active app was another one or if the window list has been
    // updated, update our state.
    if (this.appId != appId ||
      this.windows.length != windows.length ||
      this.windowsHash != windowsHash
    ) {
      this.appId = appId;
      this.windows = windows;
      this.windowsHash = windowsHash;
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
