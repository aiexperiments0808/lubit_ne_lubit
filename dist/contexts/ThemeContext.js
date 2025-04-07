"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeProvider = exports.useThemeContext = void 0;
const react_1 = __importStar(require("react"));
const ThemeContext = (0, react_1.createContext)({
    mode: 'light',
    toggleTheme: () => { },
});
const useThemeContext = () => (0, react_1.useContext)(ThemeContext);
exports.useThemeContext = useThemeContext;
const ThemeProvider = ({ children }) => {
    // Получаем сохраненную тему из localStorage или используем светлую тему
    const [mode, setMode] = (0, react_1.useState)(() => {
        const savedMode = localStorage.getItem('themeMode');
        return (savedMode === 'dark' || savedMode === 'light') ? savedMode : 'light';
    });
    // Обновляем localStorage при смене темы
    (0, react_1.useEffect)(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);
    // Функция для переключения темы
    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };
    const contextValue = {
        mode,
        toggleTheme,
    };
    return (<ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>);
};
exports.ThemeProvider = ThemeProvider;
exports.default = ThemeContext;
