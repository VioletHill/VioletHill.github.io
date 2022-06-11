---
layout: post
title: Solarized Theme
category: blog
description: Command Prompt theme
---

### **Xcode:**

1. Download Resource from [GitHub](https://github.com/brianmichel/solarized/tree/master/apple-xcode4-solarized)
    
2. Copy Resource to ~/Library/Developer/Xcode/UserData/FontAndColorThemes

3. Choose new Theme from Xcode

4. relaunch Xcode

### **Terminal:**

1. Download Resource(Solarized.terminal) from [GitHub](https://github.com/altercation/solarized/tree/master/osx-terminal.app-colors-solarized)

2. Double click terminal file

3. select theme from Terminal App

4. relaunch Terminal 

### **Terminal Dir colors:**

```
cd /opt/git
git clone git@github.com:seebi/dircolors-solarized.git
cp /opt/git/dircolors-solarized/dircolors.256dark ~/.dircolors.256dark
brew install coreutils
cat >> ~/.zshrc << EOF
eval `gdircolors ~/.dircolors.256dark`
alias ls='gls --color=auto'
EOF
```

### **Vim color:**

1. Download Resource from [GitHub](https://github.com/altercation/solarized/tree/master/vim-colors-solarized/colors)

2. Copy Resource to `~/.vim/colors `

```
syntax enable
set background=dark
colorscheme solarized
```