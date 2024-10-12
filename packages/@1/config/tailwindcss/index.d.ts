import type { KeyValuePair } from "tailwindcss/types/config";
declare const _default: {
    presets: import("tailwindcss/types/config").Config[];
    content: never[];
    theme: {
        backgroundImage: {
            "primary-gradient": string;
            "primary-gradient-74": string;
            "secondary-blue-gradient": string;
        };
        colors: {
            Bittersweet: string;
            Cerulean: string;
            Chateau_Green: string;
            Congress_Blue: string;
            Dove_Gray: string;
            Eminence: string;
            Gamboge: string;
            RedViolet: string;
            Silver_Chalice: string;
            Violet_Eggplant: string;
            primary: string;
            secondary: string;
            tertiary: string;
            quaternary: string;
            quinary: string;
            error: string;
            success: string;
            warning: string;
            danger: string;
        };
        height: (utils: import("tailwindcss/types/config").PluginUtils) => KeyValuePair<string, string>;
        maxHeight: (utils: import("tailwindcss/types/config").PluginUtils) => KeyValuePair<string, string>;
        minHeight: (utils: import("tailwindcss/types/config").PluginUtils) => KeyValuePair<string, string>;
    };
    plugins: {
        handler: () => void;
    }[];
};
export default _default;
