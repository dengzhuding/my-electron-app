# ELECTRON 测试项目

> 预设功能有看电子书（支持导入）、听音乐（本地+线上）、访问网站（可选择是否是要使用代理）

## 打包步骤

1. 添加`electron-builder`开发依赖；配置执行脚本；配置`pnpm` - `node-linker=hoisted`
2. 执行`pnpm app:dir`，在`~/dist/win-unpacked`目录下有可执行文件`.exe`，`~/dist/win-unpacked/resources/app.asar是应用源码文件`，可用`saar`工具解压/打包
