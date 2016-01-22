---
layout: post
title: 	iOS 8 中 UIPresentationController 使用
category: blog
description: 实现模范 iOS App 中点击添加一个新邮件的效果
---

这个教程将交你如何制作 iOS 内置的邮件 App 点击新建后弹出一个编辑邮件的 ViewController 的效果，具体的效果如下图所示:
<br>
<br>

![Demo](/images/blog/20150122demo.gif)

<br>

源码存放在了[这里](https://github.com/VioletHill/UIPresentationControllerDemo),其中 Tag 为 0.0.1 的是不支持手势的一个简单实现, Tag 0.0.2 实现了所有功能, 包括手势将 UIViewController 收缩回去。

开始的时候，我们建立两个 UIViewController, 初始界面是一个简单的 `MailTableViewController`, 第二个 `EditViewController` 简单的模拟编辑邮件,中间一个 button,点击 dismiss 后运行 dismiss 代码。


首先，明确一个概念，在我们做视图切换的时候(Present 方式)弹出来的新视图叫做 presentedViewController（`EditViewController`）， 原视图叫做 presentingViewController （`MailTableViewController`）， 在做 Present 动画视图切换的时候, 所有的动画效果由 presentedViewController 来控制，也就是即将被弹出的视图控制。因此，我们让 `EditViewController` 实现 `UIViewControllerTransitioningDelegate` 协议， 这个协议指定了动画的弹出方式,以及消失方式等等。
	
	@protocol UIViewControllerTransitioningDelegate <NSObject>

	- (nullable UIPresentationController *)presentationControllerForPresentedViewController:(UIViewController *)presented presentingViewController:(UIViewController *)presenting sourceViewController:(UIViewController *)source NS_AVAILABLE_IOS(8_0);
	

这个协议返回了 `UIPresentationController` 对象, 这是在 iOS 8 之后新加入的 API, `UIPresentationController` 是管理视图切换的控制器,它可以控制新出来的视图如何显示,以及它的 size 等等。
	
我们创建一个 `UIPresentationController` 的子类 `MailPresentationController`，重写 `presentationTransitionWillBegin` 方法，

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
	
上述代码就是让 presentingViewController 在弹出新视图后呈现一个向后折叠的视差效果,当目前的问题在于新弹出的视图全屏挡住了原先的视图, 因此，重写方法 `- (CGRect)frameOfPresentedViewInContainerView`

	- (CGRect)frameOfPresentedViewInContainerView {
    	return CGRectMake(0, 100, CGRectGetWidth(self.containerView.bounds), CGRectGetHeight(self.containerView.bounds) - 100);
	}

这个方法也就控制了 presentingViewController 的大小。

之后，我们只需要在 `EditViewController` 实现 `UIViewControllerTransitioningDelegate` 的代理方法，并将对象 `MailPresentationController` 返回即可 

	- (instancetype)initWithCoder:(NSCoder *)aDecoder {
    	if (self = [super initWithCoder:aDecoder]) {
        	self.modalPresentationStyle = UIModalPresentationCustom;
        	self.transitioningDelegate = self;
    	}
    	return self;
	}
	
	#pragma mark - <UIViewControllerTransitioningDelegate>

	- (UIPresentationController *)presentationControllerForPresentedViewController:(UIViewController *)presented presentingViewController:(UIViewController *)presenting sourceViewController:(UIViewController *)source {
	    MailPresentationController *controller = [[MailPresentationController alloc] initWithPresentedViewController:presented presentingViewController:presenting];
	    return controller;
	}
	
至此，我们完成了邮件弹入弹出方式的自定义实现。接下来，我们为 `EditViewController` 加入手势，当手势滑动超过一定百分比的时候，则向下消失这个 UIViewController。

在 `UIViewControllerTransitioningDelegate` 还有一个协议叫做 

	- (id <UIViewControllerAnimatedTransitioning>)animationControllerForDismissedController:(UIViewController *)dismissed

这个方法就是控制 dismiss 时候的动画效果的，它需要返回一个实现了 `UIViewControllerAnimatedTransitioning` 的对象, 所以这里, 我们新建一个对象，叫做 `MailDismissAnimation`，并且实现协议 `UIViewControllerAnimatedTransitioning`

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
	
`UIPercentDrivenInteractiveTransition` 是 iOS 7 的新 API, 它负责控制 dismiss 时候动画的百分比，我们通过手势计算出滑动的距离，然后更新 `UIPercentDrivenInteractiveTransition` 的百分比，一旦超过 0.4，认为滑动结束，消失 Present 出来的 UIViewController。


最后，为了防止 cancelInteractiveTransition 的时候， presentingViewController 没有了刚刚的视差效果，我们在 `MailPresentationController` 补上如果 dimiss 没有完成的情况处理
	
	- (void)dismissalTransitionDidEnd:(BOOL)completed {
	    if (!completed) {   
	        [UIView animateWithDuration:0.1 animations:^{
	            self.presentingViewController.view.transform =  CGAffineTransformScale(CGAffineTransformIdentity, 0.9, 0.9);
	            self.dimmingView.alpha = 0.4;
	        } completion:nil];
	    }
	} 


