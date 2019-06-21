/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

ChromeUtils.defineModuleGetter(this, "Services",
  "resource://gre/modules/Services.jsm");
const {console} = ChromeUtils.import("resource://gre/modules/Console.jsm");

class _ToolbarPanelHub {
  constructor() {
    this.id = "toolbar-message-panel";
  }

  init() {
    this.state = {notification: null};
  }

  uninit() {
    this.state = {};
    this.removeToolbarNotification();
  }

  /*
  <html:div class="whatsNew-message hero">
    <html:p class="whatsNew-message-date">
      January 29, 2019
    </html:p>
    <html:div class="whatsNew-message-body">
      <html:h2 class="whatsNew-message-title">
        Protection Is Our Focus
      </html:h2>
      <html:p>
        The New Enhanced Tracking Protection,
        gives you the best level of protection
        and performance. Discover how this version
        is the safest version of firefox ever made.
      </html:p>
      <html:a href="https://blog.mozilla.org/">
        Learn more on our blog
      </html:a>
    </html:div>
  </html:div>
  */
  renderMessages(win, doc, panelView, containerId) {
    console.log(this.state.messages);
    const container = doc.getElementById(containerId);
    const createElement = elem => doc.createElementNS("http://www.w3.org/1999/xhtml", elem);

    if (!container.querySelector(".whatsNew-message")) {
      console.log("No messages found. Rendering...");
      let first = true;
      for (let {content} of this.state.messages) {
        const messageEl = createElement("div");
        messageEl.classList.add("whatsNew-message");
        if (first) {
          messageEl.classList.add("hero");
          messageEl.addEventListener("click", () => {
            win.ownerGlobal.openLinkIn(content.link_url, "tabshifted", {
              private: false,
              triggeringPrincipal: Services.scriptSecurityManager.createNullPrincipal({}),
              csp: null,
            });
          });
          first = false;
        }

        const dateEl = createElement("p");
        dateEl.classList.add("whatsNew-message-date")
        dateEl.textContent = (new Date(content.published_date)).toLocaleDateString("default", {month: "long", day: "numeric", year: "numeric"});

        const wrapperEl = createElement("div");
        wrapperEl.classList.add("whatsNew-message-body");

        const titleEl = createElement("h2");
        titleEl.classList.add("whatsNew-message-title");
        titleEl.textContent = content.title;

        const bodyEl = createElement("p");
        bodyEl.textContent = content.body;

        const linkEl = createElement("button");
        linkEl.classList.add("text-link");
        linkEl.textContent = content.link_text;
        linkEl.addEventListener("click", () => {
          win.ownerGlobal.openLinkIn(content.link_url, "tabshifted", {
            private: false,
            triggeringPrincipal: Services.scriptSecurityManager.createNullPrincipal({}),
            csp: null,
          });

          // TODO: TELEMETRY
        });

        messageEl.appendChild(dateEl);
        messageEl.appendChild(wrapperEl);
        wrapperEl.appendChild(titleEl);
        wrapperEl.appendChild(bodyEl);
        wrapperEl.appendChild(linkEl);
        container.appendChild(messageEl);
      }
    } else {
      console.log("Messages already rendered.");
    }

    // TODO: TELEMETRY
  }

  showToolbarNotification(document, allUnblockedMessages, options) {
    if (!this.state.notification) {
      let toolbarbutton = document.getElementById("whats-new-menu-button");
      toolbarbutton.setAttribute("badged", true);
      toolbarbutton.querySelector(".toolbarbutton-badge").setAttribute("value", ".");
      toolbarbutton.removeAttribute("hidden");

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
