/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				wtred: "#800020",
				wtgrey: {
					50: "#F0EFEF",
					75: "#F4F4F4",
					85: "#BFBFBF",
					95: "#D9D9D9",
					100: "#767474",
					200: "#595959",
					300: "#403F3F",
					900: "#111827"
				}
			},
			fontFamily: {
			  	inter: ['"Inter"', ...defaultTheme.fontFamily.sans],
			  	worksans: ['"Work Sans"', ...defaultTheme.fontFamily.sans]
			}
		}
	},
	plugins: []
};
