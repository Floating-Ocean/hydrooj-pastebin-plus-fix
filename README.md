# Hydro Pastebin Plus (Fix)

针对 [`hydrooj-pastebin-plus`](https://github.com/liyanqwq/hydrooj-pastebin-plus) 的修复和完善。

适配 Hydro 4.13.0+。

## 更改

1. 更改部分接口的调用方式，使插件兼容 Hydro 4.13.0+；

2. 更改所有按钮的链接，在点击按钮后不会切换域；

3. 更改布局以及部分按钮的出现位置，使其较为符合 HydroOJ 的使用习惯；

4. 更改字段为空的处理，以及权限问题抛出的异常；

5. 为 `/paste/create` 添加 `rid` 参数，支持从指定 `rid` 的提交记录中导入代码

## 使用说明

1. 如果您的 HydroOJ 版本较低，请进入您的 HydroOJ 安装目录，在 `/packages/ui-default/templates/layout/html5.html` 中 `<head>` 标签结束前位置插入如下代码
   
   ```html
   <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
   ```

2. Clone本项目，并执行
   
   ```bash
   hydrooj addon add <本项目的绝对路径>
   ```

3. 重启您的 HydroOJ

4. 在菜单中加入超链接至 `/paste/manage`

## 原仓库版权信息

本项目在 `hydrooj_pastebin` 基础上开发

非商业使用遵 AGPL v3 协议

商业使用联系 [liyanqwq@duianit.cn](mailto:liyanqwq@duianit.cn)
