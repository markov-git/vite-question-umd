import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { terser } from 'rollup-plugin-terser';
import { name } from './package.json';
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
	plugins: [ react(), dts({ tsconfigPath: 'tsconfig.lib.json' }) ],
	build: {
		outDir: 'lib',
		copyPublicDir: false,
		lib: {
			entry: resolve(__dirname, 'src', 'index.ts'),
			name,
			formats: ['umd'],
		},
		rollupOptions: {
			external: ['react', 'react-dom'],
			plugins: [ terser({
				format: {
					comments: false,
				},
				mangle: {
					keep_classnames: false,
					reserved: [],
				},
			}) ],
			output: {
				format: 'umd',
				name,
				sourcemap: false,
				exports: 'auto',
				globals: {
					react: 'react',
					'react-dom': 'react-dom',
				},
				entryFileNames: `index.js`,
				assetFileNames: function (file) {
					return (/\.css/).test(file.name as string)
						? `style.css`
						: `[name]-[hash].[ext]`;
				},
			},
		},
	}
});
