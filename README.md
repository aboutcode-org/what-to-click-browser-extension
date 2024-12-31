# <img src="https://what-to-click.com/assets/logo.svg" height=36 align="left" alt="What-to-click logo"> What-to-click browser extension

> [!NOTE]
> This is a fork of https://github.com/what-to-click/browser-extension.

Tired of showing your teammates what to click in yet another web-based service added to your project? Worry not, you can now generate a step-by-step documentation of the workflow as you go! Start recording, go through the workflow, and adjust descriptions if necessary.

## Development Setup

Run these commands, starting from a git clone of [https://github.com/aboutcode-org/what-to-click-browser-extension.git](https://github.com/aboutcode-org/what-to-click-browser-extension.git).

- Create a development environment and install dependencies
  ```bash
  make dev
  ```

- Activate the Node virtual environment
  ```bash
  source nenv/bin/activate
  ```
- Run the extension in Firefox
  ```bash
  web-ext run -s src/
  ```
> [!IMPORTANT]
> This will not work with Firefox installed through Snap. Make sure you have a standard Firefox installation.

## How to use

1. Visit the page you want to document.
1. Click the "red circle" browser action to start recording.
1. Perform necessary actions on the page. Each click will be recorded.
1. Click the "red square" browser action to stop recording.
1. A page with editable text will be opened, containing all of the steps you have performed with screenshots attached. Edit step descriptions to your liking and export or save the file.

## Get the addon

![Firefox addon rating](https://shields.io/amo/stars/what-to-click)

[Get Firefox Addon](https://addons.mozilla.org/firefox/addon/what-to-click/)
