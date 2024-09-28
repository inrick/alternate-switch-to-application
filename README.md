Alternate Switch To Application
===============================

This GNOME Shell extension offers an alternate implementation of "switch to
application". It cycles through the application's windows instead of activating
all of them at once (much like the difference between GNOME's own
`switch-applications` and `switch-windows`). If the application does not have
any windows, a new instance is started.

By default, the keybinding is `<Super>1`, ..., `<Super>9`, `<Super>0` to
activate the next window (or start the application) of application 1 to 10. See
the XML file in the schemas subdirectory.

Before enabling the extension, make sure to disable the default switch to
application bindings:

```
gsettings set org.gnome.shell.keybindings switch-to-application-1 "[]"
gsettings set org.gnome.shell.keybindings switch-to-application-2 "[]"
gsettings set org.gnome.shell.keybindings switch-to-application-3 "[]"
gsettings set org.gnome.shell.keybindings switch-to-application-4 "[]"
gsettings set org.gnome.shell.keybindings switch-to-application-5 "[]"
gsettings set org.gnome.shell.keybindings switch-to-application-6 "[]"
gsettings set org.gnome.shell.keybindings switch-to-application-7 "[]"
gsettings set org.gnome.shell.keybindings switch-to-application-8 "[]"
gsettings set org.gnome.shell.keybindings switch-to-application-9 "[]"
```
