import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    server: {
        open: true,
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler'
            }
        }
    },
    resolve: {
        alias: {
            'components': path.resolve(__dirname, 'src/components'),
            'GuiStyles': path.resolve(__dirname, 'src/styles/components/App/Gui'),
            'GuiComponents': path.resolve(__dirname, 'src/components/App/Gui/components'),
            'DataComponents': path.resolve(__dirname, 'src/components/App/DataServer/components'),
            'store': path.resolve(__dirname, 'src/store'),
            'hooks': path.resolve(__dirname, 'src/hooks'),
            'concerns': path.resolve(__dirname, 'src/concerns'),
            'helpers': path.resolve(__dirname, 'src/helpers'),
            'utils': path.resolve(__dirname, 'src/utils'),
            'styles': path.resolve(__dirname, 'src/styles')
        }
    }
});
