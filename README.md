# Scripts

## 命令

`t-scripts start` 在当前目录开启服务
`t-scripts build` 打包当前目录下的项目
`t-scripts build lib` 打包当前目录下的库

## 约定配置

入口文件: `src/index`
静态目录: `public`
页面模板: `public/index.html`
输出目录: `dist/`

## .env

```
# 打包后的库名, 可通过 window[LIB_NAME] 使用
# build lib 时必填
LIB_NAME: string

# 打包环境 默认 development
NODE_ENV: 'development' | 'production'

# 输出目录 默认 dist
OUTPUT_PATH: string
```
