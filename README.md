# Git commit 规范配置

## 相关教程
- [视频 git commit 最佳实践，commitizen + husky + commitlint 规范化校验](https://www.bilibili.com/video/BV193411C7XE/?spm_id_from=333.337.search-card.all.click&vd_source=3284d439dd5569b325f17bd1d33a1739)
- [GitHub 上面视频中的代码和README文档](https://github.com/dev-zuo/commitizen-practice-demo)
- [掘金 2023 年了，还有前端人不知道 commit 规范 ？](https://juejin.cn/post/7212597327579037756#heading-13)
- [CSDN Git规范介绍](https://blog.csdn.net/qq_39249422/article/details/122984620)

## 配置过程
```js
// 创建一个vue项目，这里我选择了Default Vue2，自动配置了eslint，创建了git仓库
// 如果是手动创建的，需要自行初始化git仓库，配置eslint等
vue create comitizen-practice


// 全局安装规范化提交插件 commitizen cz-conventional-changelog
npm install -g commitizen cz-conventional-changelog


// 命令创建：执行以下命令，创建一个配置文件，命令创建的文件编码不是utf-8的，建议修改为utf-8，但是不修改暂时也未出现报错
// 手动创建：这个配置文件也可以手动进行创建：C:\Users\你的电脑用户名\.czrc
// 手动创建完成之后，在其中写入：{"path": "cz-conventional-changelog"}
echo '{"path": "cz-conventional-changelog"}' > ~/.czrc
// 再在package.json当中添加如下配置：
`
"config": {
  "commitizen": {
    "path": "node_modules/cz-conventional-changelog"
  }
},
`


// 安装 husky
npm install husky --save-dev


// 创建husky配置
// 方法一：
npx husky install
// 方法二：配置 package.json, scripts："prepare": "husky install"
npm run prepare


// 添加 pre-commit 钩子
npx husky add .husky/pre-commit "echo '[HOOS] pre-commit begin'"
// 添加 pre-push 钩子
npx husky add .husky/pre-push "echo '[HOOS] pre-push begin'"


// 安装配置 commitlint
npm install -D @commitlint/cli @commitlint/config-conventional
// 创建commitlint.config.js文件，与package.json同级
module.exports = { extends: ['@commitlint/config-conventional'] }
// 添加 commit-msg 钩子
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'


// 自定义提交说明，安装cz-customizable commitlint-config-cz
npm install cz-customizable -D
npm install commitlint-config-cz --save-dev
// 创建.cz-config.js文件，与package.json同级
// 内容参考此项目当中的.cz-config.js文件

// 修改commitlint.config.js文件，内容如下：
// 注意：如果不进行配置，则无法进行自定义的提交
module.exports = {
  extends: [
    "cz"
  ]
};
// 在package.json当中添加以下配置：
"config": {
  "commitizen": {
    // 未使用cz-customizable
    // "path": "./node_modules/cz-conventional-changelog"

    // 使用了cz-customizable
    "path": "node_modules/cz-customizable"
  }
},


// 配置代码在push之前进行eslint校验
npm install lint-staged -D
// 修改.husky\pre-push文件，修改内容为：
`
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo '[HOOS] pre-push begin'
npm run lint
`
// 创建.eslintrc.js文件，与package.json同级，内容参考此项目当中的.eslintrc.js文件
```
