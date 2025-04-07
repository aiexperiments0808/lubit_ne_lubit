"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const client_1 = __importDefault(require("react-dom/client"));
require("./index.css");
const App_1 = __importDefault(require("./App"));
const ThemeContext_1 = require("./contexts/ThemeContext");
// Код для обработки перенаправления с 404.html
(function () {
    const redirect = sessionStorage.getItem('redirect');
    if (redirect) {
        sessionStorage.removeItem('redirect');
        // В публичном URL будет '/lubit_ne_lubit'
        const publicUrl = '/lubit_ne_lubit';
        // Определяем, нужно ли добавить publicUrl к пути
        const path = redirect.startsWith(publicUrl)
            ? redirect
            : publicUrl + redirect;
        window.history.replaceState(null, '', path);
    }
})();
const root = client_1.default.createRoot(document.getElementById('root'));
root.render(<react_1.default.StrictMode>
    <ThemeContext_1.ThemeProvider>
      <App_1.default />
    </ThemeContext_1.ThemeProvider>
  </react_1.default.StrictMode>);
