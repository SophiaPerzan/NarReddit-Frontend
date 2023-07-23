/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			spacing: {
				'1/5': '20%',
				'1/6': '16.666667%',
				'1/8': '12.5%',
				'1/10': '10%',
				'1/12': '8.333333%',
				'1/16': '6.25%'
			}
		}
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: ['light', 'dark', 'synthwave', 'night']
	}
};
