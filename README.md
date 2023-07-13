# Git commit 规范配置

## 1 相关教程

- [视频 git commit 最佳实践，commitizen + husky + commitlint 规范化校验](https://www.bilibili.com/video/BV193411C7XE/?spm_id_from=333.337.search-card.all.click&vd_source=3284d439dd5569b325f17bd1d33a1739)
- [GitHub 上面视频中的代码和 README 文档](https://github.com/dev-zuo/commitizen-practice-demo)
- [掘金 2023 年了，还有前端人不知道 commit 规范 ？](https://juejin.cn/post/7212597327579037756#heading-13)
- [CSDN Git 规范介绍](https://blog.csdn.net/qq_39249422/article/details/122984620)

## 2 配置过程

## 2.1 创建 vue 项目

创建一个 vue 项目，这里我选择了 Default Vue2，自动配置了 eslint，创建了 git 仓库。如果是手动创建的，需要自行初始化 git 仓库，配置 eslint 等第三方库

```js
vue create comitizen-practice
```

## 2.2 全局安装规范化提交插件 commitizen cz-conventional-changelog

```js
npm install -g commitizen cz-conventional-changelog
```

## 2.3 生成配置文件

配置文件不配置的话，会无法执行`git cz`命令

```js
// 命令创建：执行以下命令，创建一个配置文件，命令创建的文件编码不是utf-8的，请修改为utf-8编码格式，编码格式错误的话某些终端里面会报错
echo '{"path": "cz-conventional-changelog"}' > ~/.czrc

// 手动创建：这个配置文件也可以手动进行创建，手动创建的时候，编码也请选择utf-8
// 路径 C:\Users\你的电脑用户名\.czrc
// 内容 {"path": "cz-conventional-changelog"}

// 重要的事情说三遍：
// 注意：当我们使用cz-customizable的时候，我们其实是不需要执行这个命令的
// 注意：当我们使用cz-customizable的时候，我们其实是不需要执行这个命令的
// 注意：当我们使用cz-customizable的时候，我们其实是不需要执行这个命令的

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

## 2.4 husky 安装和配置

```js
// 安装 husky
npm install husky --save-dev

// 创建husky配置
// 注意：下面这两个命令，每一次新拉取项目，都需要执行一次，因为husky不会提交到远程仓库当中
// 方法一：
npx husky install
// 方法二：先配置 package.json, scripts："prepare": "husky install"，再执行以下命令
npm run prepare
```

## 2.5 添加 husky 钩子

```js
// 添加 pre-commit 钩子
npx husky add .husky/pre-commit "echo '[HOOS] pre-commit begin'"
// 添加 pre-push 钩子
npx husky add .husky/pre-push "echo '[HOOS] pre-push begin'"
// 添加 commit-msg 钩子
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

## 2.6 commitlint 安装配置

```js
npm install -D @commitlint/cli @commitlint/config-conventional

// 创建commitlint.config.js文件，与package.json同级
module.exports = { extends: ["@commitlint/config-conventional"] }
```

## 2.7 自定义提交说明

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

## 2.8 配置代码在 push 之前进行 eslint 校验

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

## 2.9 配置 eslint

创建.eslintrc.js 文件，与 package.json 同级，内容参考此项目当中的.eslintrc.js 文件
