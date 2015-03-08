certificateauthority---
layout: post
title: 	用Passbook制作自己的名片 1
category: blog
description: 这是一件非常有趣的事情，用Passbook制作自己的名片好好的装一次逼吧！
---
<div class="container">
	<p>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Passbook是iOS6引入的一种简化电子票卷的东西，但其实在感觉在中国一直没有推广好，当然 你可以拿来做特殊的用途 比如你的名片 哈哈！你可以按照下面的教程 完成属于自己的Passbook名片.这样 别人要你的名片的时候只要让他打开Passbook扫一扫就好啦.当然 如果你问我这和微信有什么区别的话 我只能说 逼格高(微信太low啦)，人活着就是为了逼格！ 好了，让我们先看看制作的效果图 然后 根据下面的教程一步一步走 你也可以制作自己的passbook名片了
    </p>

    <br />
    <div style="text-align:center">
        <img src="/images/blog/passbookcard1/pass_qiufeng1.png" />
        <img src="/images/blog/passbookcard1/pass_qiufeng2.png" />
    </div>
    <br />

    <p>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;首先，我们对passbook开发做一个大致的了解，passbook可以不需要任何的app接入，换句话说 你可以不写一行代码,就能利用passbook制作自己的文件，但是 你需要一个开发者账号。passbook识别一个.pkpass 后缀的文件，而.pkpass本质就是一个zip文件，文件包含了以下内容(不同的pkpass可能包含的东西不一样):
        <ul>
            <li>pass.json – 关于这个 pass 的信息区域的描述，他们的内容， 和元信息。</li>
            <li>manifest.json – 这个文件描述了这个 pass 中的文件列表， 和每个文件的 SHA1 校验和。</li>
            <li>signature – manifest.json 一个分离的的 DER 签名， 通过苹果提供的证书生成的。</li>  
            <li>icon@2x.png – pass 的一个小图标， 当 pass 作为 email 附件的时候会被用到。</li>
            <li>thumbnail@2x.png - 你所看到的效果图中的头像</li>
        </ul>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果你不想了解这些，只想快速制作一个和我一样的名片，那直接跳过他，直接准备一些素材， 首先 那个可爱的头像 thumbnail@2x.png 以及一个icon@2x.png (我们只需要支持retina屏幕即可)
        <br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;然后用编辑器(推荐使用sublime)创建一个 pass.json的文件，内容如下：
    </p>

    <pre name="code" class="plain">{
    &quot;formatVersion&quot;: 1,
    &quot;passTypeIdentifier&quot;: &quot;pass.me.qiufeng.mypassbookcard&quot;,
    &quot;serialNumber&quot;: &quot;00003&quot;,
    &quot;teamIdentifier&quot;: &quot;xxxxxx&quot;,
    &quot;organizationName&quot;: &quot;qiufeng&quot;,
    &quot;description&quot;: &quot;I'm QiuFeng&quot;,
    &quot;logoText&quot;: &quot;We Simplify, But We Perfect&quot;,
    &quot;backgroundColor&quot; : &quot;rgb(0, 0, 0)&quot;,
    &quot;foregroundColor&quot; : &quot;rgb(255, 255, 255)&quot;,
    &quot;barcode&quot;: {
        &quot;message&quot;: &quot;I'm qiufeng&quot;,
        &quot;format&quot;: &quot;PKBarcodeFormatPDF417&quot;,
        &quot;messageEncoding&quot;: &quot;utf-8&quot;,
        &quot;altText&quot;: &quot;SCAN TO ADD&quot;
    },
    &quot;generic&quot;: {
        &quot;primaryFields&quot;: [
            {
                &quot;key&quot;: &quot;name&quot;,
                &quot;label&quot;: &quot;NAME&quot;,
                &quot;value&quot;: &quot;Feng Qiu&quot;
            }
        ],
        &quot;secondaryFields&quot;: [
            {
                &quot;key&quot;: &quot;JOB&quot;,
                &quot;label&quot;: &quot;JOB&quot;,
                &quot;value&quot;: &quot;iOS Engineer&quot;,
                &quot;textAlignment&quot;: &quot;PKTextAlignmentLeft&quot;
            }        
        ],
        &quot;auxiliaryFields&quot;: [
            {
                &quot;key&quot;: &quot;&quot;,
                &quot;label&quot;: &quot;&quot;,
                &quot;value&quot;: &quot;Design. Code. Build. Innovate&quot;,
                &quot;textAlignment&quot;: &quot;PKTextAlignmentCenter&quot;
            }
        ],
        &quot;backFields&quot;: [
            {
                &quot;label&quot;: &quot;PHONE&quot;,
                &quot;key&quot;: &quot;PHONE&quot;,
                &quot;value&quot;: &quot;+86 188-1736-7675&quot;
            },
            {
                &quot;key&quot;: &quot;WECHAT&quot;,
                &quot;label&quot;: &quot;WECHAT&quot;,
                &quot;value&quot;: &quot;qfviolethill&quot;
            },
            {
                &quot;key&quot;: &quot;EMAIL&quot;,
                &quot;label&quot;: &quot;EMAIL&quot;,
                &quot;value&quot;: &quot;mailqiufeng@iCloud.com&quot;
            },
            {
                &quot;label&quot;: &quot;WEBSITE&quot;,
                &quot;key&quot;: &quot;WEBSITE&quot;,
                &quot;value&quot;: &quot;http://www.qiufeng.me/&quot;
            },
            {
                &quot;label&quot; : &quot;&quot;,
                &quot;key&quot; : &quot;message&quot;,
                &quot;value&quot; : &quot;We are what we repeatedly do. Excellence, then, is not an act, but a habit.&quot;
            }
        ]
    }
}</pre>
<br />
    <p>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这里有几个地方 你会和我的不一样 一个是 passTypeIdentifier 一个是 teamIdentifier
        <br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我们逐一介绍每个字段的作用：
            <ul>
                <li>formatVersion： 文件格式的版本，因为这是一个全新的文件格式， 你用的是 1(注意，1 是一个数字；如果你用字符串来表示这个值的话，这个文件就会是无效的，并且 苹果官网规定这个数字只能为1)</li>
                <li>passTypeIdentifier – 这是 Pass 的标识。 这个和 iOS 中的 bundle identifier 差不多。 稍后会更多的介绍关于这个标识的内容。</li>
                <li>serialNumber – 这个是 pass 的序列号，就像数据库中的主键一样 根据你的passTypeIdentifier和teamIdentifier唯一的passbook文件，如果两个serialNumber相同，并且在同一个passTypeIdentifier下面，那么会覆盖掉之前的文件，有点类似你的身份证号码</li>
                <li>teamIdentifier – 这是苹果分配和每个 iOS 开发者的一个唯一的十个字符的标识。 如果你创建过你自己的 iOS 应用，你应该已经熟悉它了。在你完成所有证书的创建以后 我会告诉你如何找到这一个标示</li>
                <li>organizationName – 你的组织名称。可以随笔写</li>
                <li>description – 关于 pass 一个简短的介绍。也可以随笔啊写</li>
            </ul>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;剩下的一些字段 大家可以对照我的效果图对比 看一看每个字段对应的意思是什么 其中的 label是显示在passbook上面的文字 key是你自己定义的关键字 value是对应passbook中对应label中显示的字
        <br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;接下去的工作比较辛苦，我们需要配置各种证书，我们需要进入<a href="https://developer.apple.com/membercenter/index.action">iOS Developer Portal</a>, 在你登录进去之后，在Certificates, Identifiers & Profiles，选择 Identifiers，然后选择 Pass Type IDs 
        
        <br />
        <br />

        <div style="text-align:center">
            <img src="/images/blog/passbookcard1/passtypeid1.png" />
        </div>
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;然后点击 加号,填上对应的信息：
        <br />
        <br />

        <div style="text-align:center">
            <img src="/images/blog/passbookcard1/passtypeid2.png" />
        </div>
        <br />
        <br />

        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这里Identifier苹果推荐使用倒域名来注册 比如 我的 pass.me.qiufeng.mypassbookcard
        <br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注册完成之后 我们需要为passbook导入证书，同样在Pass Type IDs这一栏中选中你刚刚注册的passbook，然后点击edit,之后点击create certiicate
        <br />
        <br />

        <div style="text-align:center">
            <img src="/images/blog/passbookcard1/register1.png" />
        </div>
        <br />
        <br />

        <div style="text-align:center">
            <img src="/images/blog/passbookcard1/register2.png" />
        </div>
        <br />

        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;然后看到如下界面：
        <br />
        <br />

        <div style="text-align:center">
            <img src="/images/blog/passbookcard1/register3.png" />
        </div>
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这里介绍了如何生成CSR文件 如果你没有 那么按照这里介绍的 生成一个到你的本地，之后点击Continue
        <br />
        <br />

        <div style="text-align:center">
            <img src="/images/blog/passbookcard1/register4.png" />
        </div>
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这里点击choose file选择你刚刚的csr文件 一般名字是这个 CertificateSigningRequest.certSigningRequest，点击generate
        <br />
        <br />

        <div style="text-align:center">
            <img src="/images/blog/passbookcard1/register5.png" />
        </div>
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;生成完证书后，我们点击Download,然后双击，这样 证书就被加入到了你的钥匙串中
        <br>然后打开钥匙串，然后找到你的证书，右键 Get Info 找到那里有一个Organizational Unit的标识 那个就是你需要填入到teamIdentifier对应的value的字段，请确保你找到正确的证书
        <br />
        <br />

        <div style="text-align:center">
            <img src="/images/blog/passbookcard1/info1.png" />
        </div>
        <br />
        <br />

        <div style="text-align:center">
            <img src="/images/blog/passbookcard1/info2.png" />
        </div>
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;到这里 我们已经完成了pass.json的所有内容，剩下最后一个文件需要准备了，再次用sublime新建一个文件，命名为manifest.json,里面的内容如下：
        <pre name="code" class="plain">{
    &quot;icon@2x.png&quot;: &quot;b793b73c7921be3448f8df77fbca7843c8d6d68e&quot;,
    &quot;thumbnail@2x.png&quot;: &quot;b793b73c7921be3448f8df77fbca7843c8d6d68e&quot;,
    &quot;pass.json&quot;: &quot;74974e196dbcbb8bd566542cc5ad01e1cff814ca&quot;
}   </pre>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这里需要注意的是 后面一大串加密的东西 你和我的都不一样，这里采用的是 SHA1 算法（不要担心，不需要你对这种算法有任何的了解），打开 终端，然后cd到文件目录下面，
依次输入如下命令
   <pre name="code" class="plain">openssl sha1 pass.json</pre>
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;命令行的输出看起来是这样(实际的校验和可能会不同)：
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SHA1(pass.json)= 74974e196dbcbb8bd566542cc5ad01e1cff814ca
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;然后把 74974e196dbcbb8bd566542cc5ad01e1cff814ca 复制到pass.json对应的值中。
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;同样的方法 对icon@2x.png 和 thubnail@2x.png也进行加密，需要注意的地方：如果你对pass.json做出了修改，那么对应的加密就会变了，你就需要重新生成那个pass.json对应的值，比如 我在pass.json的最后多敲了一个回车或者空格，那么我就需要重新输入openssl sha1 pass.json，得到新的加密 然后把新的加密放到manifest.json里面。
    </p>
    <br>

    <p>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;接下来 我们需要制作苹果的证书了
        <br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;还记得刚刚查看teamIdentifier对应那个字段的证书吗？我们需要再次利用他了， 现在你将会把这个证书和秘钥导出成 PEM 格式， 这样你可以把它们用于 OpenSSL。
        <br>

        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;打开钥匙串访问， 在左边的菜单中选择证书(在类型下面)，再次找到刚刚的那个 “Pass Type ID: pass.me.qiufeng.mypassbookcard” 的证书。（也就是重新找到那个证书）
        <br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;右键点击这个证书， 在弹出菜单中选择导出 “Pass Type ID: pass.me.qiufeng.mypassbookcard”，将导出的文件保存成 “Certificates.p12” 到你的工作目录中。将会有一个弹出框，让你输入一个密码：
        <br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为了让这个过程更简单一点， 直接点击 OK – 这个证书将会导出为不带密码保护的。
        <br />
        <div style="text-align:center">
            <img src="/images/blog/passbookcard1/Certificates1.png" />
        </div>
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;回到终端 :
        <br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在确保当前目录是正确的之后 (利用"cd 进入到对应的目录下",输入 "ls -al"，并且这个列表应该包含你的 Certificates.p12 文件), 输入如下命令：
        <pre name="code" class="plain">openssl pkcs12 -in Certificates.p12 -clcerts -nokeys -out passcertificate.pem -passin pass:</pre>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这将仅将 pass 证书导出为 PEM 格式，并在同一个目录中把它保存成 “passcertificate.pem”。(如果这个操作成功的话， OpenSSL 将会输出 “MAC verified OK” 消息。)
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;接下来， 通过这个命令将私钥也导出成单独的文件：
        <pre name="code" class="plain">openssl pkcs12 -in Certificates.p12 -nocerts -out passkey.pem -passin pass: -passout pass:12345</pre>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注意到这次， 你需要提供一个密码来导出这个私钥文件。 在这个例子中， 仅使用 “12345″ – 在生产环境中， 应当使用一个强密码 – 不能是 “password1” 或者 “passw00t” 这种东西。
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为了给你的 pass bundle 签名， 你需要另外一个证书 – WWDR Intermediate 证书， 用来验证发给你证书的发布者 – 苹果。 你已经将它安装到钥匙串中了。 打开钥匙串访问， 选择 “证书” 分类， 并找到一个叫做 “Apple Worldwide Developer Relations Certification Authority” 的证书(是的，这确实是一个很长的名字)：
        <br />
        <br />

        <div style="text-align:center">
            <img src="/images/blog/passbookcard1/wwdr1.png" />
        </div>
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果万一你没有这个证书， 那么打开你的浏览器， 访问这个页面<a href="http://www.apple.com/certificateauthority/"> http://www.apple.com/certificateauthority/ </a>。在这里你可以下载你可能需要的最重要的苹果证书。 翻到下面，找到 WWDR 证书， 下载 .cer 文件， 并导入到钥匙串中。
        <br />
        <br />

        <div style="text-align:center">
            <img src="/images/blog/passbookcard1/wwdr2.png" />
        </div>
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;你已经准备好导出这个证书了。 返回到钥匙串访问， 右键点击证书名称并在弹出的菜单中选择导出选项：
        <br />
        <br />

        <div style="text-align:center">
            <img src="/images/blog/passbookcard1/wwdr3.png" />
        </div>
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在 “另存为…” 对话框中， 找到 format 下拉框，并选择 Privacy Enhanced Mail (.pem) 选项
        <br />
        <br />

        <div style="text-align:center">
            <img src="/images/blog/passbookcard1/wwdr4.png" />
        </div>
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在对话框顶部的文本框中， 输入文件的名称 “WWDR.pem”， 选择 pass 的工作目录作为目标， 然后点击保存按钮来完成导出。 你已经可以创建签名了， 输入这个命令:
        <pre name="code" class="plain">openssl smime -binary -sign -certfile WWDR.pem -signer passcertificate.pem -inkey passkey.pem -in manifest.json -out signature -outform DER -passin pass:12345</pre>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;仔细看一看上面的命令行 – 非常容易理解所有的参数。 signer 参数是你的 pass 证书的文件名； inkey 是用于对 manifest.json 签名的私钥文件； in 是输入文件的文件名； out 是输出文件的文件名；outform 是输出的格式(你需要用 “DER“ 来创建一个分离的签名)； 最后， passin 是私钥的密码。
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;还剩下最后一步， 就是将 pass 中的多个文件集中到 .pkpass 文件中。 在终端输入这个命令(按tab键可以补全文件名字)：
        <pre name="code" class="plain">zip -r qifueng.pkpass manifest.json pass.json signature thumbnail\@2x.png icon\@2x.png</pre>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;通过使用 shell 命令 “zip”, 你创建一个叫做 qiufeng.pkpass 的 ZIP 文件， 并且这个档案包中包含了后面列表中的所有文件。
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;到这里 我们就完成来passbook文件的制作,你可以双击看到你刚刚制作的pkpass文件来，他将会在电脑上呈现出来。通过airdrop或者邮件 我们可以让它发送到手机上.
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果你双击后出现了错误 不要着急，说明你的某一步是错误的，你可以继续往下阅读 看看如果解决passbook的错误。另外 还有一种情况是 你在电脑上双击正常出行了passbook文件，但是，airdrop到手机上没有反应，也不要着急，这种情况也表示你的pkpass文件出现了问题，因为手机上的校验要比电脑严格 所以 有时候你会出现电脑上能打开 但是手机上无法打开的现象。
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;遇到这种情况,打开xcode，把手机接到电脑上，选择 window -> device -> 选中你的设备 －> 拉到刚刚下面的console，可以看到很多log的信息。
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;然后 我们重新传一次pkpass文件，然后在打开，看看这个console报了什么错，根据这个错误 你在去重新整理过你的文件 比如 我如果在 pass.json的    
        <pre>"formatVersion": 1,</pre>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这一行，少了最后面那个逗号 变成
        <pre>"formatVersion": 1</pre>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这时候 通过 这个console 我们可以找到这么一行log
        <pre name="code" class="plain">iPhone sharingd[55] &lt;Warning&gt;: Invalid data error reading pass /var/mobile/Library/Caches/com.apple.sharingd/com.apple.Passbook/96050960-3BE4-41AE-A306-C328B4B81248.pkpass/pass.json. Invalid json from URL file:///var/mobile/Library/Caches/com.apple.sharingd/com.apple.Passbook/96050960-3BE4-41AE-A306-C328B4B81248.pkpass/pass.json: Error Domain=NSCocoaErrorDomain Code=3840 &quot;The operation couldn’t be completed. (Cocoa error 3840.)&quot; (Badly formed object around character 29.) UserInfo=0x13f02fa70 {NSDebugDescription=Badly formed object around character 29.}</pre>
<br />
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;大致能知道错误的原因，包括sha1加密也是可以检验的.这时候 你再根据这个错误去修改 修改完成后 请别忘记 如果你修改了pass.json文件 那么对应的manifest.json的加密也会改变的哦
     <br>
     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;好了 到目前为止，我们完成了除去扫一扫添加以外的所有功能，如果你一步一步有耐心的顺利完成了上面的工作，那么恭喜你～ 一起期待下一节的 为你的passbook名片添加“扫一扫添加”的功能，如果你没有耐心了，并且还出现了错误～～那么休息休息～～根据上面查错误的方法 重新找到错误 然后再接再厉喽～～
    </p>
</div>