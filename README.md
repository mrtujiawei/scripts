# Scripts

## 命令

`t-scripts start` 在当前目录开启服务

`t-scripts build` 打包当前目录下的项目

`t-scripts build --lib` 打包当前目录下的库

## 约定配置

入口文件: `src/index`

静态目录: `public`

页面模板: `public/index.html`

输出目录: `dist/`

## 配置参数

打包相关的配置

> `package.json` 中 `"#buildConfig"`

```json
{
  "#buildConfig": {
    // 打包模式 默认 development
    "mode": "development",
    // 库名 打包库时必传
    "libName": "libName",
    // 输出目录 默认dist
    "outputPath": "dist"
  }
}
```

`postcss` `babel` 相关的转换配置

> `package.json` 中 "browserslist"

```json
{
  "browserslist": {
    "development": ["last 1 version"],
    "production": ["> 0.1%"]
  }
}
```
