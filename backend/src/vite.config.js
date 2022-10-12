"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const vite_plugin_node_1 = require("vite-plugin-node");
exports.default = (0, vite_1.defineConfig)({
    server: {
        host: '0.0.0.0',
        port: 3000,
    },
    plugins: [
        ...(0, vite_plugin_node_1.VitePluginNode)({
            adapter: 'nest',
            appPath: './src/main.ts',
            exportName: 'viteNodeApp',
            tsCompiler: 'esbuild',
        })
    ],
    optimizeDeps: {
        exclude: [
            '@nestjs/microservices',
            '@nestjs/websockets',
            'cache-manager',
            'class-transformer',
            'class-validator',
            'fastify-swagger',
        ],
    },
});
//# sourceMappingURL=vite.config.js.map