# Hydro Pastebin Plus (Fix)

针对 [hydrooj-pastebin-plus](https://github.com/liyanqwq/hydrooj-pastebin-plus) 的修复和完善。

适配 Hydro 4.13.0+。

## 更改

1. 更改部分接口的调用方式，使插件兼容 hydro 4.13.0+；

2. 更改所有按钮的链接，在点击按钮后不会切换域；

3. 更改布局以及部分按钮的出现位置，使其较为符合 hydro 主站的使用习惯

## 使用说明

1. 进入您的 HydroOJ 安装目录

2. 在 `/packages/ui-default/templates/layout/html5.html` 中 `<head>` 标签结束前位置插入如下代码
   
   ```html
   <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
   ```
   
   p.s. 如果不想因为更新 hydro 而导致更改丢失，前两步可以替换为：控制面板 -> 系统设置 -> `ui-default` -> 将上面的代码插入 `footer_extra_html` 中

3. 执行如下命令
   
   ```bash
   yarn global add hydrooj-pastebin-plus
   hydrooj addon add hydrooj-pastebin-plus
   ```

4. 进入 hydrooj-pastebin-plus 的安装目录，并使用本仓库的代码替换源代码

5. 重启您的 HydroOJ

6. 在首页菜单加入超链接至 `/paste/create`

## 原仓库版权信息

本项目在 `hydrooj_pastebin` 基础上开发

非商业使用遵 AGPL v3 协议

商业使用联系 [liyanqwq@duianit.cn](mailto:liyanqwq@duianit.cn)
