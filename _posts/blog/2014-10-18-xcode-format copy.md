---
layout: post
title: 	Objective-C代码自动格式化
category: blog
description: 利用Clang-Format自动格式化Xcode代码——构建和苹果官方代码一样的风格
---
<div class="container">
	<p>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果你还不知道什么是 Clang-Format 插件，可以到<a href="https://github.com/travisjeffery/ClangFormat-Xcode">这里</a>去看看, ClangFormat-Xcode 官方的 Demo 使用的是 WebKit 模式，这样 format 出来的代码其实就已经特别规范了，但是 和苹果的官方代码有一点点小小的区别在于指针的区别，例如 对于一个 NSString, 苹果的格式应该是 NSString *str, 而WebKit给出的格式却会是 NSString* str; 如果你不强制要求指针的格式，那么使用他的 WebKit 模式就足够了，但有的时候，我们需要考虑到整个团队的统一代码风格，我们团队采用的是<a href="http://zh-google-styleguide.readthedocs.org/en/latest/google-objc-styleguide/contents/">Google 开源项目风格指南</a>,所以这就强制要求了我去把 Clang-Format 的 WebKit 风格修改。
		<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我们从安装开始(如果你已经安装了 ClangFormat，可以跳过这一段),首先去<a href="https://github.com/travisjeffery/ClangFormat-Xcode"> GitHub </a>下载插件，下载完毕后会是一个 Project，只要正常的运行一次，Xcode出现 Build Successed 以后，说明安装成功，这时候，需要重启 Xocde，注意 要彻底退出 Xocde。接下来你可以在 Xcode 的菜单栏找到 Edit 一列多出了一个 Clang Format(应该在最下面)，然后 你可以选择对应的WebKit 风格的代码了，(这个在我看来已经很 perfect)。
		<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;接下来，我们说一下如何格式化出和苹果一样的代码风格，Clang Format 支持之定义格式，这时候，你需要做的就是复制下面一段代码，然后保存为一个名字叫做 ".clang-format" 的文件，主要不要忘记“.”，当然，你也可以从我<a href="http://pan.baidu.com/s/1mgp5YzQ">这里</a>直接下载,不过 因为权限的原因，我无法上传“.”开头的文件，所以下载完后，你需要重命名成 ".clang-format"
		<pre>---
Language:        Cpp
# BasedOnStyle:  LLVM
AccessModifierOffset: -2
ConstructorInitializerIndentWidth: 4
AlignEscapedNewlinesLeft: false
AlignTrailingComments: true
AllowAllParametersOfDeclarationOnNextLine: true
AllowShortIfStatementsOnASingleLine: false
AllowShortLoopsOnASingleLine: false
AllowShortFunctionsOnASingleLine: false
AlwaysBreakTemplateDeclarations: false
AlwaysBreakBeforeMultilineStrings: false
BreakBeforeBinaryOperators: false
BreakBeforeTernaryOperators: true
BreakConstructorInitializersBeforeComma: false
BinPackParameters: true
ColumnLimit: 0
IndentWidth: 4
ConstructorInitializerAllOnOneLineOrOnePerLine: false
DerivePointerBinding: false
ExperimentalAutoDetectBinPacking: false
IndentCaseLabels: true
MaxEmptyLinesToKeep: 1
NamespaceIndentation: None
ObjCSpaceAfterProperty: true
ObjCSpaceBeforeProtocolList: true
PenaltyBreakBeforeFirstCallParameter: 19
PenaltyBreakComment: 300
PenaltyBreakString: 1000
PenaltyBreakFirstLessLess: 120
PenaltyExcessCharacter: 1000000
PenaltyReturnTypeOnItsOwnLine: 60
PointerBindsToType: false
SpacesBeforeTrailingComments: 1
Cpp11BracedListStyle: true
Standard: Cpp11
TabWidth: 8
UseTab: Never
BreakBeforeBraces: Stroustrup
IndentFunctionDeclarationAfterType: true
SpacesInParentheses: false
SpacesInAngles:  false
SpaceInEmptyParentheses: false
SpacesInCStyleCastParentheses: false
SpacesInContainerLiterals: true
SpaceBeforeAssignmentOperators: true
ContinuationIndentWidth: 4
CommentPragmas:  '^ IWYU pragma:'
SpaceBeforeParens: ControlStatements
		</pre>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这是 Clang Format 支持自定义格式的一种方法，如果你感兴趣，可以<a href="http://clang.llvm.org/docs/ClangFormat.html">阅读这里</a>的官方文档,看看这些参数的意思。好了，接下来，在我们保存完文件以后，把这个文件复制到你的项目的根目录中，比如我新建一个项目叫做 “Test”,然后把刚刚保存的 “.clang-format” 拖到项目中，目录如下：
		<br>
		<br>
		<p style="text-align:center">
			<img src="/images/blog/20141018_1.png">
		</p>
		<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注意，这时候目录文件多了一个 “.clang-format” 的文件,之后，我们在 Xcode的菜单栏，依次选择 Edit->Clang Format->File:
		<br>
		<br>
		<p style="text-align:center">
			<img src="/images/blog/20141018_2.png">
		</p>
		<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这样 每次使用 Clang Format 以后，就会 format 出 Apple 风格的代码了
		<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当然，有的时候，我们并不希望这个出现在项目文件中，于是，还有一种方法可以让你的 “.clang-format” 全局生效，很简单，把 “.clang-format” 复制到这个目录下面即可 “/Users/qiufeng/” （qiufeng）是我的用户名，对于不同的机器，适应你自己用户名，如果出现警告说不让你复制，可以使用 Terminal 的命令 sudo cp -r .clang-format /Users/qiufeng/ 来完成，这样 Clang Format 就会适配你的全部 Xcode 项目了，需要注意的是，别忘了把类型改成"File"

	</p>

</div>