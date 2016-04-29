---
layout: post
title: 	让你的 App 开启 Multitasking 之旅（二）
category: blog
description: iPad Multitasking —— Picture in Picture (PiP)
---

###### 硬件要求： iPad Pro, iPad Air, iPad Air 2, and iPad mini 2 以及以后设备.

#### Picture in Picture (PiP)

Picture in Picture 能够让你的 App 在后台继续运行视频播放

#### PiP 适配

AVPlayerViewController 在 iOS 8 以后取代了 MediaPlay

在 iOS 9 中，播放 API 还有 AVKit, AVFounddataion, WebKit，这 3 个 Framework 都支持 PiP

首先，去 项目 -> Capabilities -> 打开 Background Modes， 选择 Audio, AirPlay and Picture in Picture

设置你的 AVAudioSessionCategory 为 AVAudioSessionCategoryPlayback， 可以在 `AppDelegate` 的 `didFinishLaunchingWithOptions` 中设置

	func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
        let audioSession = AVAudioSession.sharedInstance()
        do {
            try audioSession.setCategory(AVAudioSessionCategoryPlayback)
        } catch {
        }
        // Override point for customization after application launch.
        return true
    }
    
#### AVKit    
    
在播放视频的地方做一下简单的设置 
	
	@IBAction func mediaButtonTouchUpInside(sender: UIButton) {
        let playerViewController = AVPlayerViewController()
        if let fileUrl = NSBundle.mainBundle().URLForResource("video.mov", withExtension: nil) {
            playerViewController.player = AVPlayer(URL: fileUrl)
        }
        playerViewController.allowsPictureInPicturePlayback = true
        playerViewController.delegate = self
        presentViewController(playerViewController, animated: true, completion: nil)
    }    
 
如果希望点击视频上的回到界面，继续播放视频，可以实现这个 `AVPlayerViewControllerDelegate`
	
	func playerViewController(playerViewController: AVPlayerViewController, restoreUserInterfaceForPictureInPictureStopWithCompletionHandler completionHandler: (Bool) -> Void) {
        presentViewController(playerViewController, animated: false) {
            completionHandler(true)
        }
    }
    
这样, 你就实现了整个 AVKit 的 PictureInPicture 

#### AVFounddataion

`AVFoundation` 的设置稍微复杂一点， 首先 声明 2 个变量

	var playerLayer: AVPlayerLayer?
    var avPictureInPictureConctroller: AVPictureInPictureController?
    
对 media 做初始化
	
	 @IBAction func mediaButtonTouchUpInside(sender: AnyObject) {
        if let fileUrl = NSBundle.mainBundle().URLForResource("video.mov", withExtension: nil) {
            playerLayer?.removeFromSuperlayer()
            let player = AVPlayer(URL: fileUrl)
            playerLayer = AVPlayerLayer(player: player)
            playerLayer?.videoGravity = AVLayerVideoGravityResizeAspect
            playerLayer?.frame = view.bounds
            avPictureInPictureConctroller = AVPictureInPictureController(playerLayer: playerLayer!)
            avPictureInPictureConctroller?.delegate = self
            player.play()
            view.layer.addSublayer(playerLayer!)
        }
    }
	
之后，可以手动触发 PiP

	 @IBAction func startPipBarButtonTouchUpInside(sender: AnyObject) {
        avPictureInPictureConctroller?.startPictureInPicture()
    }
    
同样，实现 AVPictureInPictureControllerDelegate
	
	func pictureInPictureControllerWillStartPictureInPicture(pictureInPictureController: AVPictureInPictureController) {
        playerLayer?.hidden = true
    }
    
    func pictureInPictureController(pictureInPictureController: AVPictureInPictureController, restoreUserInterfaceForPictureInPictureStopWithCompletionHandler completionHandler: (Bool) -> Void) {
        playerLayer?.hidden = false
        completionHandler(true)
    }
    
## WebKit

`WKWebView` 将会自动支持 PictureInPicture, 如果 你还使用 UIWebView, 那么 可以设置 `allowsPictureInPictureMediaPlayback` 的属性

完整的 Demo 见 [这里](https://github.com/VioletHill/PipDemo)
