# 本地化协作

项目使用 i18next JSON 和 ICU MessageFormat 管理界面及地图内容。英文是源语言，Crowdin 是目标语言译文的权威来源。

## 资源边界

- `src/locales/en-US.json`：开发者维护的英文源文，Crowdin 只上传此文件。
- `src/locales/zh-CN.json`：Crowdin 回写的简体中文译文，不再从仓库持续上传。
- `src/i18n/index.ts`：语言代码、显示名称等非翻译元数据。
- `crowdin.yml`：源文件、导出路径和语言代码映射；不得写入项目 ID 或访问令牌。

语言文件只能包含嵌套对象和字符串。两个文件必须具有完全相同的键集合。

## ICU 与占位符

带变量、复数或选择逻辑的消息使用 ICU MessageFormat，例如：

```text
{count} {count, plural, one {jump} other {jumps}}
```

翻译时可以调整文字和语序，但不得删除、增加或改名 `{count}`、`{start}`、`{sector}` 等变量。仓库测试会解析每条消息，并比较英文和译文的变量集合。

## Crowdin 项目设置

1. 创建公开的 File-based 项目，名称为 `X4 Foundations Interactive Map`。
2. Source language 选择 English，Target language 选择 Chinese Simplified。
3. 在 GitHub Integration 中选择 `Source and translation files mode`，绑定 `Ximu-Luya/x4-foundations-interactive-map` 的 `main` 分支。
4. 使用仓库根目录的 `crowdin.yml`，服务分支命名为 `l10n_main`。
5. 首次连接时启用一次性导入已有翻译，不启用持续从仓库导入译文。
6. 翻译完成并审核后，由 Crowdin 创建面向 `main` 的 PR；通过仓库检查和人工审阅后再合并。

原生 GitHub 集成负责身份认证，仓库和 GitHub Actions 均不需要 `CROWDIN_PROJECT_ID` 或 `CROWDIN_PERSONAL_TOKEN`。

## 日常流程

英文源文随功能代码提交，合并至 `main` 后自动同步到 Crowdin。中文及未来目标语言只在 Crowdin 编辑，通过本地化 PR 回写仓库。不要直接在普通功能分支修改目标语言文件，紧急修正也应在 Crowdin 中同步更新，避免下一次导出覆盖。

新增目标语言时，需要同时：

1. 在 Crowdin 添加目标语言并扩展 `crowdin.yml` 的导出语言和代码映射。
2. 在 `src/i18n/index.ts` 注册语言及显示元数据。
3. 将 Crowdin 导出的语言文件加入 `src/locales/` 并纳入完整性测试。
4. 验证语言切换、SEO 元数据、搜索和主要桌面及移动端流程。
