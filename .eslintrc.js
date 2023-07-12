module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: ["plugin:vue/essential", "eslint:recommended", "plugin:prettier/recommended"],
	parserOptions: {
		parser: "@babel/eslint-parser",
	},
	// 设置eslint全局变量
	globals: {},
	// 0是忽略，1是警告，2是报错
	rules: {
		"vue/multi-word-component-names": 0, // 关闭-当前的组件名称是否使用驼峰或多单词命名
		quotes: 2, // 报错-未使用双引号
		semi: 1, // 警告-无分号
		"no-console": 0, // 警告-console.log
		"no-debugger": 0, // 警告-debugger
		"no-alert": 2, // 报错-alert
		"no-mixed-spaces-and-tabs": 2, // 报错-Sapce和Tab混用
		"no-multiple-empty-lines": 1, // 警告-不允许多个空行
		"no-trailing-spaces": 2, // 报错-行尾空格
	},
};
