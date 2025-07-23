<h1 align="center">Hydro Pastebin Plus (Fix)</h1>

<div align="center">
   <strong>这是一个面向 Hydro OJ 的剪贴板插件</strong><br>
</div><br>

针对 [`hydrooj-pastebin-plus`](https://github.com/liyanqwq/hydrooj-pastebin-plus) 的修复和完善。

适配 Hydro 5.0+

> [!WARNING]
> Hydro V5 开发接口进行了大更改，本项目将分成两个分支进行更新。

[>> 前往 **Hydro-V4** 分支](https://github.com/Floating-Ocean/hydrooj-pastebin-plus-fix/tree/Hydro-V4)

## 更改

1. 更改部分接口的调用方式，使插件兼容 Hydro 5.0+；
2. 更改所有按钮的链接，在点击按钮后不会切换域；
3. 更改布局以及部分按钮的出现位置，使其较为符合 HydroOJ 的使用习惯；
4. 更改字段为空的处理，以及权限问题抛出的异常；
5. 为 `/paste/create` 添加 `rid` 参数，支持从指定 `rid` 的提交记录中导入代码

## 使用说明

1. Clone本项目，并执行：
   ```bash
   hydrooj addon add <本项目的绝对路径>
   ```
2. 重启您的 HydroOJ；
3. 在菜单中加入超链接至 `/paste/manage`

## 原仓库版权信息

本项目在 `hydrooj_pastebin` 基础上开发

非商业使用遵 AGPL v3 协议

商业使用联系 [liyanqwq@duianit.cn](mailto:liyanqwq@duianit.cn)
