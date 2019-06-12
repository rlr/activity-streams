/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

// ChromeUtils.defineModuleGetter(this, "Services",
  // "resource://gre/modules/Services.jsm");

class _ToolbarPanelHub {
  constructor() {
    this.id = "toolbar-message-panel";
    this.showPanel = this.showPanel.bind(this);
  }

  init() {
    this.state = {notification: null};
  }

  uninit() {
    this.state = {};
    this.removeToolbarNotification();
  }

  showPanel(force = false) {
    // open panel
    // render this.state.messages
  }

  showToolbarNotification(document, allUnblockedMessages, options) {
    if (!this.state.notification) {
      let toolbarbutton = document.getElementById("whats-new-menu-button");
      toolbarbutton.setAttribute("badged", true);
      toolbarbutton.querySelector(".toolbarbutton-badge").setAttribute("value", allUnblockedMessages.length);

      this.state.notification = toolbarbutton;
      this.state.messages = allUnblockedMessages;
    }
  }

  removeToolbarNotification() {
    if (this.state.notification) {
      this.state.notification.remove();
    }
  }

  dismissMessageById(messageId) {
    this.messages = this.messages.filter(({id}) => id !== messageId);
  }
}

this._ToolbarPanelHub = _ToolbarPanelHub;

/**
 * ToolbarPanelHub - singleton instance of _ToolbarPanelHub that can initiate
 * message requests and render messages.
 */
this.ToolbarPanelHub = new _ToolbarPanelHub();

const EXPORTED_SYMBOLS = ["ToolbarPanelHub", "_ToolbarPanelHub"];
