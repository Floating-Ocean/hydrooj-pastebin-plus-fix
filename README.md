# Hydro Pastebin Plus (Fix)

针对 [hydrooj-pastebin-plus](https://github.com/liyanqwq/hydrooj-pastebin-plus) 的修复和完善。

适配 Hydro 4.13.0+。

## 更改

1. 更改部分接口的调用方式，使插件兼容 hydro 4.13.0+；

2. 更改所有按钮的链接，在点击按钮后不会切换域；

3. 更改布局以及部分按钮的出现位置，使其较为符合 hydro 主站的使用习惯；

4. 更改字段为空的处理，以及权限问题抛出的异常

## 使用说明

1. 如果您的 hydro 版本较低，请进入您的 HydroOJ 安装目录，在 `/packages/ui-default/templates/layout/html5.html` 中 `<head>` 标签结束前位置插入如下代码
   
   ```html
   <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
   ```

2. 执行如下命令
   
   ```bash
   yarn global add hydrooj-pastebin-plus
   hydrooj addon add hydrooj-pastebin-plus
   ```

3. 进入 hydrooj-pastebin-plus 的安装目录，并使用本仓库的代码替换源代码

4. 重启您的 HydroOJ

5. 在首页菜单加入超链接至 `/paste/create`

## 原仓库版权信息

本项目在 `hydrooj_pastebin` 基础上开发

非商业使用遵 AGPL v3 协议

商业使用联系 [liyanqwq@duianit.cn](mailto:liyanqwq@duianit.cn)
