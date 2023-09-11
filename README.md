# Git Commit | ESlint | Prettier | Stylelint 配置

## 1 相关教程

- [视频 git commit 最佳实践，commitizen + husky + commitlint 规范化校验](https://www.bilibili.com/video/BV193411C7XE/?spm_id_from=333.337.search-card.all.click&vd_source=3284d439dd5569b325f17bd1d33a1739)
- [GitHub 上面视频中的代码和 README 文档](https://github.com/dev-zuo/commitizen-practice-demo)
- [掘金 2023 年了，还有前端人不知道 commit 规范 ？](https://juejin.cn/post/7212597327579037756#heading-13)
- [CSDN Git 规范介绍](https://blog.csdn.net/qq_39249422/article/details/122984620)

## 2 配置过程

### 2.1 创建 vue 项目

创建一个 vue 项目，这里我选择了 Default Vue2，自动配置了 eslint，创建了 git 仓库。如果是手动创建的，需要自行初始化 git 仓库，配置 eslint 等第三方库

```js
vue create comitizen-practice
```

### 2.2 全局安装规范化提交插件 commitizen cz-conventional-changelog

```js
npm install -g commitizen cz-conventional-changelog
```

### 2.3 生成配置文件

配置文件不配置的话，会无法执行`git cz`命令

```js
// 命令创建：执行以下命令，创建一个配置文件，命令创建的文件编码不是utf-8的，请修改为utf-8编码格式，编码格式错误的话某些终端里面会报错
echo '{"path": "cz-conventional-changelog"}' > ~/.czrc

// 手动创建：这个配置文件也可以手动进行创建，手动创建的时候，编码也请选择utf-8
// 路径 C:\Users\你的电脑用户名\.czrc
// 内容 {"path": "cz-conventional-changelog"}

// 重要的事情说三遍：
// 注意：当我们使用cz-customizable的时候，我们其实是不需要执行下面这个命令的！
// 注意：当我们使用cz-customizable的时候，我们其实是不需要执行下面这个命令的！
// 注意：当我们使用cz-customizable的时候，我们其实是不需要执行下面这个命令的！
// 备注：cz-customizable是一个Commitizen的插件，它允许你使用自定义的Git提交规范

// 使用这个命令使commitizen支持angular的 Commit message 格式
// 这个命令会安装cz-conventional-changelog，并且配置commitizen的path
commitizen init cz-conventional-changelog --save --save-exact
// 执行下面的命令之后，package.json会新增以下的内容：
"config": {
  "commitizen": {
    "path": "./node_modules/cz-conventional-changelog"
  }
},
"devDependencies":{
  "cz-conventional-changelog": "^3.1.0"
}
```

### 2.4 husky 安装和配置

```js
// 安装 husky
npm install husky --save-dev

// 创建husky配置
// 注意：下面这两个命令，每一次新拉取项目，都需要执行一次，因为husky不会提交到远程仓库当中
// 方法一：
npx husky install
// 方法二：先配置 package.json, scripts："prepare": "husky install"，再执行以下命令
npm run prepare

// 注意：建议是在 package.json 当中配置 prepare 命令，prepare 命令会在 npm i 的时候自动执行，比较方便
```

### 2.5 添加 husky 钩子

```js
// 添加 pre-commit 钩子
npx husky add .husky/pre-commit "echo '[HOOS] pre-commit begin'"
// 添加 pre-push 钩子
npx husky add .husky/pre-push "echo '[HOOS] pre-push begin'"
// 添加 commit-msg 钩子
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

### 2.6 commitlint 安装配置

```js
npm install -D @commitlint/cli @commitlint/config-conventional

// 创建commitlint.config.js文件，与package.json同级
module.exports = { extends: ["@commitlint/config-conventional"] }
```

### 2.7 自定义提交说明

注意：这里存在一些坑，尚未解决，当配置了`cz-customizable`和`commitlint-config-cz`之后，执行`git cz`可以有漂亮的图标和汉字提示，但是却失去了对`git commit -m "信息"`的拦截，导致了可以提交不规范的 commit 信息，失去了基本功能，因此，暂时放弃此方案，采用另外一种方案，可以进行拦截，且可以进行汉字提示，只是没有漂亮的图标

```js
npm install cz-customizable -D

// 创建.cz-config.js文件，与package.json同级
// 内容参考此项目当中的.cz-config.js文件
// 或者参考官方文档
// https://github.com/leoforfree/cz-customizable/blob/master/.cz-config.js

// 修改package.json当中的config字段
// 这里如果没有执行2.3当中的commitizen init cz-conventional-changelog --save --save-exact命令，是没有这个配置的，可以自行添加
"config": {
  "commitizen": {
    "path": "node_modules/cz-customizable"
  }
},
```

### 2.8 配置代码在 push 之前进行 eslint 校验

```js
// 这里分为两种eslint校验，eslint和lint-staged

// 第一种：eslint方式，会对整个项目进行eslint校验
// 在package.json的scripts中添加：
"lint": "vue-cli-service lint"
// 在.husky\pre-push文件的最后一行添加：
npm run lint

// 第二种：lint-staged方式，只会对本次提交的文件进行eslint校验
// 安装
npm install lint-staged -D
// 在package.json的scripts中添加：
"lintStaged": "lint-staged"
// 在package.json中添加：
"lint-staged": {
	"src/**/*.{vue,js,ts,jsx,tsx}": [
		"eslint"
	]
  // 如果这里eslint不能指定范围，如果指定了目录，那lint-staged也就失去了校验暂存区文件的功能
  // "*.js": "项目中所有的 js 文件",
  // "**/*.js": "项目中所有的 js 文件",
  // "src/*.js": "src目录中所有的 js 文件",
  // "src/**/*.js": "src文件夹中所有的 js 文件"
},
// 在.husky/pre-commit文件的最后一行添加：
npm run lintStaged
```

### 2.9 配置 eslint

创建 .eslintrc.js 文件，与 package.json 同级，内容参考此项目中的同名文件

### 2.10 配置 prettier

创建 .prettierrc.js 文件和 .prettierignore 文件 ，与 package.json 同级，内容参考此项目中的同名文件

## 3 scripts 命令介绍

```js
"scripts": {
  // 创建husky配置，prepare 命令会在 npm i 的时候自动执行，比较方便
  "prepare": "npx husky install",
  // 启动项目
  "serve": "vue-cli-service serve",
  // 项目打包
  "build": "vue-cli-service build",
  // 检查并且修复eslint报错
  "fix": "vue-cli-service lint",
  // 检查eslint报错，不修复
  "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts",
  // 生成约定式提交信息，请使用npm run commit或者git cz来代替git commit命令
  "commit": "git cz",
  // 对暂存区的文件进行eslint校验
  "lintStaged": "lint-staged",
  // 使用prettier对src下的全部文件进行格式化
  "prettier": "npx prettier --write src"
  // 检查src下的stylelint报错，不修复
  "stylelint": "npx stylelint src/**/*.{scss,less,css,html,vue}"
},
```

# 4 Vue 项目当中集成 Stylelint

## 4.1 安装相关开发依赖

注意：

- SCSS 和 LESS 所需的依赖不相同
- stylelint 15 及以上版本内部已经进行了处理，不再需要 stylelint-config-prettier

```js
// 如果项目当中使用的是SCSS，则安装以下依赖：
stylelint@15.10.3 // Stylelint 核心包
stylelint-config-html@1.1.0 // Stylelint 的可共享 HTML 配置
stylelint-config-recommended-scss@13.0.0 // SCSS 文件规则检查
stylelint-config-recommended-vue@1.5.0 // Vue 文件规则检查
stylelint-config-standard@34.0.0 // 共享的 CSS 书写规范（标准）
stylelint-order@6.0.3 // CSS 样式排序
stylelint-scss@^5.1.0 // SCSS 预设规则
postcss-html@1.5.0 // 用于解析 HTML（和类似 HTML）的 PostCSS 语法，可以用于识别 HTML 或者 Vue 中的样式
postcss-scss@4.0.8 // PostCSS 的一个 SCSS 语法解析器

// 如果项目当中使用的是LESS，则安装以下依赖：
stylelint@15.10.3
stylelint-config-html@1.1.0
stylelint-config-recommended-less@2.0.0
stylelint-config-recommended-vue@1.5.0
stylelint-config-standard@34.0.0
stylelint-order@6.0.3
postcss-html@1.5.0
postcss-less@6.0.0
```

## 4.2 配置 stylelint

stylelint 的配置文件分为 .stylelintrc.js 和 .stylelintignore，详细内容请参考此项目根目录下的同名文件

## 4.3 配置 VsCode

在 .vscode/settings.json 当中添加以下配置

```js
{
	// 设置stylelint校验的文件类型
	"stylelint.validate": ["css", "less", "scss", "postcss", "vue"],
	// 设置保存的时候进行格式化
	"editor.formatOnSave": true,
	// 设置 prettier 为默认格式化程序
	"editor.defaultFormatter": "esbenp.prettier-vscode",
	// 保存时使用 styleLint 修复可修复错误
	"editor.codeActionsOnSave": {
		"source.fixAll.stylelint": true
	}
}
```

## 4.4 配置当中的 “坑”

1. 安装了依赖并且进行了配置，VsCode 当中 vue 文件模板语法报错

   ```js
   // VsCode 当中 vue 文件有以下报错：
   Stylelint: Unknown word (CssSyntaxError)

   // 检查 VsCode 的 settings.json 文件，用户和工作区的配置文件都检查一下，是否有以下配置，有的话，删除即可
   {
     "stylelint.config":{}
   }
   ```

2. 保存文件时 stylelint 无法自动修复样式，并且报错

   ```js
   // 报错信息
   TypeError: Class extends value undefined is not a constructor or null
   at Object.<anonymous> (D:\TestPlace\demo\node_modules\postcss-scss\lib\nested-declaration.js:3:33)
   at Module._compile (node:internal/modules/cjs/loader:1165:14)
   at Module._extensions..js (node:internal/modules/cjs/loader:1220:10)
   at Module.load (node:internal/modules/cjs/loader:1035:32)
   at Module._load (node:internal/modules/cjs/loader:876:12)
   at c._load (node:electron/js2c/asar_bundle:5:13343)
   at Module.require (node:internal/modules/cjs/loader:1059:19)
   at require (node:internal/modules/cjs/helpers:102:18)
   at Object.<anonymous> (D:\TestPlace\demo\node_modules\postcss-scss\lib\scss-parser.js:4:25)
   at Module._compile (node:internal/modules/cjs/loader:1165:14)
   ```

   出现上面的报错，可以尝试执行 `npm i postcss -D`，安装完成之后，重启 vscode 即可
