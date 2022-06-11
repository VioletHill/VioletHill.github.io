---
layout: post
title: 全套配置 Solarized
category: blog
description: Solarized是一种非常流行的配色方案
---

* Xcode 

1. Download Resource from [GitHub](https://github.com/brianmichel/solarized/tree/master/apple-xcode4-solarized)
    
2. Copy Resource to ~/Library/Developer/Xcode/UserData/FontAndColorThemes

3. Choose new Theme from Xcode

4. relaunch Xcode

* Terminal 

1. Download Resource(Solarized.terminal) from [GitHub](https://github.com/altercation/solarized/tree/master/osx-terminal.app-colors-solarized)

2. Double click terminal file

3. select theme from Terminal App

4. relaunch Terminal 

* Terminal Dir colors

```
cd /opt/git
git clone git@github.com:seebi/dircolors-solarized.git
cp /opt/git/dircolors-solarized/dircolors.256dark ~/.dircolors.256dark
cat >> ~/.zshrc << EOF
eval `dircolors ~/.dircolors.256dark`
EOF
```

* Vim color

1. Download Resource from [GitHub](https://github.com/altercation/solarized/tree/master/vim-colors-solarized/colors)

2. Copy Resource to `~/.vim/colors `

```
syntax enable
set background=dark
colorscheme solarized
```