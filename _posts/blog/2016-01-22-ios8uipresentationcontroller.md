---
layout: post
title: 	iOS 8 中 UIPresentationController 使用
category: blog
description: 实现模范 iOS App 中点击添加一个新邮件的效果
---

这个教程将交你如何制作 iOS 内置的邮件 App 点击新建后弹出一个编辑邮件的 ViewController 的效果，具体的效果如下图所示:
<br>
<br>

![Demo](/images/blog/20160122demo.gif)

<br>

源码存放在了[这里](https://github.com/VioletHill/QIUPresentAnimationViewController)

开始的时候，我们建立两个 UIViewController, 初始界面是一个简单的 `FirstViewController`, 第二个 `SecondViewController` 简单的模拟编辑邮件,中间一个 button,点击 dismiss 后运行 dismiss 代码。


首先，明确一个概念，在我们做视图切换的时候(Present 方式)弹出来的新视图叫做 presentedViewController（`SecondViewController`）， 原视图叫做 presentingViewController （`FirstViewController`）， 在做 Present 动画视图切换的时候, 所有的动画效果由 presentedViewController 来控制，也就是即将被弹出的视图控制。让 `SecondViewController` 实现 `UIViewControllerTransitioningDelegate` 协议，这个协议指定了动画的弹出方式,以及消失方式等等。
	
	@protocol UIViewControllerTransitioningDelegate <NSObject>

	- (nullable UIPresentationController *)presentationControllerForPresentedViewController:(UIViewController *)presented presentingViewController:(UIViewController *)presenting sourceViewController:(UIViewController *)source NS_AVAILABLE_IOS(8_0);
	

这个协议返回了 `UIPresentationController` 对象, 这是在 iOS 8 之后新加入的 API, `UIPresentationController` 是管理视图切换的控制器,它可以控制新出来的视图如何显示,以及它的 size 等等。
	
我们创建一个 `UIPresentationController` 的子类 `QIUPresentationController`，重写 `presentationTransitionWillBegin` 方法，

	- (void)presentationTransitionWillBegin {
    	[self.containerView addSubview:self.dimmingView];
    	self.dimmingView.frame = self.containerView.bounds;
    	self.dimmingView.alpha = 0;
    	[self.presentingViewController.transitionCoordinator animateAlongsideTransition:^(id<UIViewControllerTransitionCoordinatorContext>  _Nonnull context) {
         self.presentingViewController.view.transform = CGAffineTransformScale(CGAffineTransformIdentity, 0.90, 0.90);
        self.dimmingView.alpha = 0.4;
    	} completion:nil];
	}
	
	- (UIView *)dimmingView {
    	if 	(_dimmingView == nil) {
        	_dimmingView = [[UIView alloc] init];
        	_dimmingView.backgroundColor = [UIColor blackColor];
    	}
    	return _dimmingView;
	}
	
上述代码就是在弹出新视图后呈现一个向后折叠的视差效果,如果想要 `FirstViewController` 不全屏显示 ，重写方法 `- (CGRect)frameOfPresentedViewInContainerView`

	- (CGRect)frameOfPresentedViewInContainerView {
    	return CGRectMake(0, 100, CGRectGetWidth(self.containerView.bounds), CGRectGetHeight(self.containerView.bounds) - 100);
	}

之后，我们在 `SecondViewController` 实现 `UIViewControllerTransitioningDelegate` 的代理方法，并将对象 `QIUPresentationController` 返回

	- (instancetype)initWithCoder:(NSCoder *)aDecoder {
    	if (self = [super initWithCoder:aDecoder]) {
        	self.modalPresentationStyle = UIModalPresentationCustom;
        	self.transitioningDelegate = self;
    	}
    	return self;
	}
	
	#pragma mark - <UIViewControllerTransitioningDelegate>

	- (UIPresentationController *)presentationControllerForPresentedViewController:(UIViewController *)presented presentingViewController:(UIViewController *)presenting sourceViewController:(UIViewController *)source {
	    QIUPresentationController *controller = [[QIUPresentationController alloc] initWithPresentedViewController:presented presentingViewController:presenting];
	    return controller;
	}
	
至此，我们完成了邮件弹入弹出方式的自定义实现。接下来，我们为 `SecondViewController` 加入手势，当手势滑动超过一定百分比的时候，则向下消失这个 UIViewController。

在 `UIViewControllerTransitioningDelegate` 还有一个协议叫做 

	- (id <UIViewControllerAnimatedTransitioning>)animationControllerForDismissedController:(UIViewController *)dismissed

这个方法就是控制 dismiss 时候的动画效果的，它需要返回一个实现了 `UIViewControllerAnimatedTransitioning` 的对象, 所以这里, 我们新建一个对象，叫做 `QIUDismissAnimation`，并且实现协议 `UIViewControllerAnimatedTransitioning`

	- (NSTimeInterval)transitionDuration:(id<UIViewControllerContextTransitioning>)transitionContext {
    	return 0.4;
	}

	- (void)animateTransition:(id<UIViewControllerContextTransitioning>)transitionContext {
	    UIView *fromView = [transitionContext viewForKey:UITransitionContextFromViewKey];
	    [UIView animateWithDuration:[self transitionDuration:transitionContext] animations:^{
	        CGRect finalframe = fromView.frame;
	        finalframe.origin.y = [transitionContext containerView].bounds.size.height;
	        fromView.frame = finalframe;
	    } completion:^(BOOL finished) {
	        [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
	    }];
	}

	- (id <UIViewControllerAnimatedTransitioning>)animationControllerForDismissedController:(UIViewController *)dismissed {
    	return [[MailDismissAnimation alloc] init];
	}

这样，整个 dismiss 的动画过程就被我们自定义了，最后一步去添加手势

	- (IBAction)handlePanGesture:(UIPanGestureRecognizer *)panGesture {
	    CGPoint touchPoinst = [panGesture translationInView:panGesture.view.superview];
	    CGFloat percentComplete = (touchPoinst.y - self.startPoint.y) / CGRectGetHeight(panGesture.view.bounds);
	    percentComplete = MAX(0, percentComplete);
	    percentComplete = MIN(1, percentComplete);
	    switch (panGesture.state) {
	        case UIGestureRecognizerStateBegan: {
	            self.isInteracting = YES;
	            self.startPoint = touchPoinst;
	            [self dismissViewControllerAnimated:YES completion:nil];
	            break;
	        }
	        case UIGestureRecognizerStateChanged: {
	            [self.percentDrivenInteractiveTransition updateInteractiveTransition:percentComplete];
	            break;
	        }
	        case UIGestureRecognizerStateCancelled:
	        case UIGestureRecognizerStateEnded: {
	            self.isInteracting = NO;
	            if (percentComplete > 0.4) {
	                [self.percentDrivenInteractiveTransition finishInteractiveTransition];
	            } else {
	                [self.percentDrivenInteractiveTransition cancelInteractiveTransition];
	            }
	        }
	            
	        default:
	            break;
	    }
	}

补充刚刚 dismiss 的另外一个协议

	@property (nonatomic, strong) UIPercentDrivenInteractiveTransition *percentDrivenInteractiveTransition;

	- (UIPercentDrivenInteractiveTransition *)percentDrivenInteractiveTransition {
	    if (_percentDrivenInteractiveTransition == nil) {
	        _percentDrivenInteractiveTransition = [[UIPercentDrivenInteractiveTransition alloc] init];
	    }
    	return _percentDrivenInteractiveTransition;
	}

	
	- (id <UIViewControllerInteractiveTransitioning>)interactionControllerForDismissal:(id<UIViewControllerAnimatedTransitioning>)animator {
	    return self.isInteracting ? self.percentDrivenInteractiveTransition : nil;
	}
	
到这里，几乎完成了所有的 mail 效果，但是 其实这不是最完美的解决方案，因为你可以看到当手势拖放一半的时候，后面的那个 CGAffineTransformIdentity 有点跳跃的感觉，更好的解决方案可以看 [GitHub](https://github.com/VioletHill/QIUPresentAnimationViewController) 中的代码, 主要的区别是子类化了 `UIPercentDrivenInteractiveTransition` 并且重写了
	
	- (void)updateInteractiveTransition:(CGFloat)percentComplete;
	- (void)cancelInteractiveTransition;
	- (void)finishInteractiveTransition;

如果你实在没有耐心了，可以直接使用我的 Cocoapods `QIUPresentAnimation`.
使用方法:
		
		#import "QIUPresentKit.h"

	    UIViewController *nextController = [self.storyboard instantiateViewControllerWithIdentifier:@"EditViewController"];
    QIUPresentViewController *controller = [[QIUPresentViewController alloc] initWithViewController:nextController];
    [self presentViewController:controller animated:YES completion:nil];

