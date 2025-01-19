var contentScript = function() {
  "use strict";
  function defineContentScript(definition2) {
    return definition2;
  }
  const style = document.createElement("style");
  style.textContent = `
  .interview-copilot-widget {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 200px;
    height: 150px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    z-index: 999999;
    font-family: system-ui, -apple-system, sans-serif;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 1rem;
    font-size: 14px;
    color: #374151;
    border: 1px solid #e5e7eb;
  }

  .interview-copilot-widget.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
  const definition = defineContentScript({
    matches: ["<all_urls>"],
    main() {
      document.head.appendChild(style);
      const widget = document.createElement("div");
      widget.className = "interview-copilot-widget";
      widget.textContent = "Interview mode started";
      document.body.appendChild(widget);
      console.log("Content script loaded");
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        try {
          switch (message.action) {
            case "TOGGLE_SIDEBAR":
              widget.classList.toggle("visible");
              sendResponse({ success: true });
              break;
            default:
              sendResponse({
                success: false,
                error: `Unknown action: ${message.action}`
              });
          }
        } catch (error) {
          console.error("Error in content script:", error);
          sendResponse({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
          });
        }
      });
      window.addEventListener("beforeunload", () => {
        widget.remove();
        style.remove();
      });
    }
  });
  contentScript;
  function initPlugins() {
  }
  function print(method, ...args) {
    if (typeof args[0] === "string") {
      const message = args.shift();
      method(`[wxt] ${message}`, ...args);
    } else {
      method("[wxt]", ...args);
    }
  }
  const logger = {
    debug: (...args) => print(console.debug, ...args),
    log: (...args) => print(console.log, ...args),
    warn: (...args) => print(console.warn, ...args),
    error: (...args) => print(console.error, ...args)
  };
  const result = (async () => {
    try {
      initPlugins();
      return await definition.main();
    } catch (err) {
      logger.error(
        `The unlisted script "${"content-script"}" crashed on startup!`,
        err
      );
      throw err;
    }
  })();
  return result;
}();
contentScript;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC1zY3JpcHQuanMiLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy93eHQvZGlzdC9zYW5kYm94L2RlZmluZS1jb250ZW50LXNjcmlwdC5tanMiLCIuLi8uLi9lbnRyeXBvaW50cy9jb250ZW50LXNjcmlwdC9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gZGVmaW5lQ29udGVudFNjcmlwdChkZWZpbml0aW9uKSB7XG4gIHJldHVybiBkZWZpbml0aW9uO1xufVxuIiwiaW1wb3J0IHsgZGVmaW5lQ29udGVudFNjcmlwdCB9IGZyb20gJ3d4dC9zYW5kYm94J1xuaW1wb3J0IHR5cGUgeyBNZXNzYWdlLCBNZXNzYWdlUmVzcG9uc2UgfSBmcm9tICcuLi8uLi9zcmMvdHlwZXMnXG5cbi8vIENyZWF0ZSBhbmQgaW5qZWN0IHN0eWxlc1xuY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpXG5zdHlsZS50ZXh0Q29udGVudCA9IGBcbiAgLmludGVydmlldy1jb3BpbG90LXdpZGdldCB7XG4gICAgcG9zaXRpb246IGZpeGVkO1xuICAgIGJvdHRvbTogMjBweDtcbiAgICByaWdodDogMjBweDtcbiAgICB3aWR0aDogMjAwcHg7XG4gICAgaGVpZ2h0OiAxNTBweDtcbiAgICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgYm94LXNoYWRvdzogMCAycHggMTJweCByZ2JhKDAsIDAsIDAsIDAuMTUpO1xuICAgIHotaW5kZXg6IDk5OTk5OTtcbiAgICBmb250LWZhbWlseTogc3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBzYW5zLXNlcmlmO1xuICAgIG9wYWNpdHk6IDA7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDIwcHgpO1xuICAgIHRyYW5zaXRpb246IGFsbCAwLjNzIGVhc2U7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICBwYWRkaW5nOiAxcmVtO1xuICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICBjb2xvcjogIzM3NDE1MTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjZTVlN2ViO1xuICB9XG5cbiAgLmludGVydmlldy1jb3BpbG90LXdpZGdldC52aXNpYmxlIHtcbiAgICBvcGFjaXR5OiAxO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcbiAgfVxuYFxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb250ZW50U2NyaXB0KHtcbiAgbWF0Y2hlczogWyc8YWxsX3VybHM+J10sXG4gIG1haW4oKSB7XG4gICAgLy8gSW5qZWN0IHN0eWxlc1xuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpXG5cbiAgICAvLyBDcmVhdGUgd2lkZ2V0XG4gICAgY29uc3Qgd2lkZ2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICB3aWRnZXQuY2xhc3NOYW1lID0gJ2ludGVydmlldy1jb3BpbG90LXdpZGdldCdcbiAgICB3aWRnZXQudGV4dENvbnRlbnQgPSAnSW50ZXJ2aWV3IG1vZGUgc3RhcnRlZCdcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHdpZGdldClcblxuICAgIGNvbnNvbGUubG9nKCdDb250ZW50IHNjcmlwdCBsb2FkZWQnKVxuXG4gICAgLy8gSGFuZGxlIG1lc3NhZ2VzIGZyb20gYmFja2dyb3VuZCBzY3JpcHRcbiAgICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKFxuICAgICAgbWVzc2FnZTogTWVzc2FnZSxcbiAgICAgIHNlbmRlcixcbiAgICAgIHNlbmRSZXNwb25zZTogKHJlc3BvbnNlOiBNZXNzYWdlUmVzcG9uc2UpID0+IHZvaWRcbiAgICApID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHN3aXRjaCAobWVzc2FnZS5hY3Rpb24pIHtcbiAgICAgICAgICBjYXNlICdUT0dHTEVfU0lERUJBUic6XG4gICAgICAgICAgICB3aWRnZXQuY2xhc3NMaXN0LnRvZ2dsZSgndmlzaWJsZScpXG4gICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBzdWNjZXNzOiB0cnVlIH0pXG4gICAgICAgICAgICBicmVha1xuXG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7XG4gICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICBlcnJvcjogYFVua25vd24gYWN0aW9uOiAke21lc3NhZ2UuYWN0aW9ufWBcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGluIGNvbnRlbnQgc2NyaXB0OicsIGVycm9yKVxuICAgICAgICBzZW5kUmVzcG9uc2Uoe1xuICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgIGVycm9yOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6ICdVbmtub3duIGVycm9yJ1xuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICAvLyBDbGVhbnVwIG9uIG5hdmlnYXRpb25cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmVmb3JldW5sb2FkJywgKCkgPT4ge1xuICAgICAgd2lkZ2V0LnJlbW92ZSgpXG4gICAgICBzdHlsZS5yZW1vdmUoKVxuICAgIH0pXG4gIH1cbn0pIl0sIm5hbWVzIjpbImRlZmluaXRpb24iXSwibWFwcGluZ3MiOiI7O0FBQU8sV0FBUyxvQkFBb0JBLGFBQVk7QUFDOUMsV0FBT0E7QUFBQSxFQUNUO0FDRUEsUUFBTSxRQUFRLFNBQVMsY0FBYyxPQUFPO0FBQzVDLFFBQU0sY0FBYztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUErQnBCLFFBQUEsYUFBZSxvQkFBb0I7QUFBQSxJQUNqQyxTQUFTLENBQUMsWUFBWTtBQUFBLElBQ3RCLE9BQU87QUFFSSxlQUFBLEtBQUssWUFBWSxLQUFLO0FBR3pCLFlBQUEsU0FBUyxTQUFTLGNBQWMsS0FBSztBQUMzQyxhQUFPLFlBQVk7QUFDbkIsYUFBTyxjQUFjO0FBQ1osZUFBQSxLQUFLLFlBQVksTUFBTTtBQUVoQyxjQUFRLElBQUksdUJBQXVCO0FBR25DLGFBQU8sUUFBUSxVQUFVLFlBQVksQ0FDbkMsU0FDQSxRQUNBLGlCQUNHO0FBQ0MsWUFBQTtBQUNGLGtCQUFRLFFBQVEsUUFBUTtBQUFBLFlBQ3RCLEtBQUs7QUFDSSxxQkFBQSxVQUFVLE9BQU8sU0FBUztBQUNwQiwyQkFBQSxFQUFFLFNBQVMsTUFBTTtBQUM5QjtBQUFBLFlBRUY7QUFDZSwyQkFBQTtBQUFBLGdCQUNYLFNBQVM7QUFBQSxnQkFDVCxPQUFPLG1CQUFtQixRQUFRLE1BQU07QUFBQSxjQUFBLENBQ3pDO0FBQUEsVUFBQTtBQUFBLGlCQUVFLE9BQU87QUFDTixrQkFBQSxNQUFNLDRCQUE0QixLQUFLO0FBQ2xDLHVCQUFBO0FBQUEsWUFDWCxTQUFTO0FBQUEsWUFDVCxPQUFPLGlCQUFpQixRQUFRLE1BQU0sVUFBVTtBQUFBLFVBQUEsQ0FDakQ7QUFBQSxRQUFBO0FBQUEsTUFDSCxDQUNEO0FBR00sYUFBQSxpQkFBaUIsZ0JBQWdCLE1BQU07QUFDNUMsZUFBTyxPQUFPO0FBQ2QsY0FBTSxPQUFPO0FBQUEsTUFBQSxDQUNkO0FBQUEsSUFBQTtBQUFBLEVBRUwsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7IiwieF9nb29nbGVfaWdub3JlTGlzdCI6WzBdfQ==
