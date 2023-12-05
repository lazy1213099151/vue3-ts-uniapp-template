import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
  ],
  resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
			'@assets': path.resolve(__dirname, 'src/assets'),
			'@config': path.resolve(__dirname, 'src/config'),
			'@static': path.resolve(__dirname, 'src/static'),
			'@services': path.resolve(__dirname, 'src/services'),
			'@pages': path.resolve(__dirname, 'src/pages'),
			'@plugins': path.resolve(__dirname, 'src/plugins'),
			'@components': path.resolve(__dirname, 'src/components'),
			'@store': path.resolve(__dirname, 'src/store'),
			'@utils': path.resolve(__dirname, 'src/utils'),
		},
	},
});
