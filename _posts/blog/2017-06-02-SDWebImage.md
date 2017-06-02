---
layout: post
title:  走进 SDWebImage
category: blog
description: SDWebImage(3.8.2) 源码解读
---

首先看一下 SDWebImage 的架构。其实 [GitHub](https://github.com/rs/SDWebImage) 上面的架构图非常清楚的解释了整个 SDWebImage 的工作原理

![image description](/images/blog/sdwebimage/SDWebImageClassDiagram.png)

### **整体的关键步骤是这样的**：

**一、** `UIImageView` 通过 `SDWebImage` 请求一个 URL 获取图片

**二、** `SDWebImage` 根据这个 URL 先去 内存中寻找，如果找不到去硬盘中寻找（这里忽略一些 ignore cache 的 case）

**三、** 如果第二步再找不到，`SDWebImage` 会**先检查之前是否有这个 URL 正在下载**，之后创建一个 `NSMutableURLRequest: request`

**四、** 将第三步的 `request` 封装成一个 `SDWebImageDownloaderOperation`(subclass of `NSOperation`) operation

**五、** 将第四步的 operation 根据 option 的配置，加入到队列中（提供先进先出以及先进后出两种）

**六、** operation 线程开始，开启 第三步 NSMutableURLRequest 的 request 配置的 NSURLSessionDataTask

**七、** 第一个 NSURLSessionDataTaskDelegate 接收 response， 此时，配置好 expectedSize, 如果 responseCode 在 400 以下（除 304，304 是缓存 code），则开始接收 data；如果是 304，则不更新本地缓存，否则按照错误处理。

**八、** 接收返回 data， 如果有 progressBlock 则根据 data 的百分比调用 progressBlock， 并且把每次接受的 data 加入到 `NSMutableData *imageData` 里面

**九、** 接受完成后，判断是否有错误，如果有错误，返回错误；如果没有，则根据第八步的 `NSMutableData *imageData` 去组装成一个 `UIImage`, 根据是否组装成功，以及组装出来的 `UIImage` 是否 size 出现了 0，然后返回

**十、** 如果图片正常返回，开启内存缓存和磁盘缓存（这里都是可以根据 option 配置的）

**十一、** 使用 `NSCache` 缓存，更具图片的 `width`、`height` 以及 `scale` 计算 `NSCache` 的 `cost`

**十二、** 根据 URL 的 MD5 值作为 key，在 `ioQueue`  线程中， 把图片写入到 `NSSearchPathForDirectoriesInDomains` 中

**十三、** 回主线程设置 `UIImageView`

---

### **源码阅读**

**步骤一：请求一个 URL 获取图片**

我们以一个 `UIImageView` 为入口， 看看整个 `SDWebImage` 的工作流程

```
[self.imageView sd_setImageWithURL:@"http://desk.fd.zol-img.com.cn/t_s1680x1050c5/g5/M00/02/03/ChMkJ1bKxtqIXy1OAAi9LK5qQwgAALHrQK3PAoACL1E420.jpg" placeholderImage:nil];
```

调用栈如下：

```
- (void)sd_setImageWithURL:(NSURL *)url placeholderImage:(UIImage *)placeholder {
    [self sd_setImageWithURL:url placeholderImage:placeholder options:0 progress:nil completed:nil];
}

- (void)sd_setImageWithURL:(NSURL *)url placeholderImage:(UIImage *)placeholder options:(SDWebImageOptions)options progress:(SDWebImageDownloaderProgressBlock)progressBlock completed:(SDWebImageCompletionBlock)completedBlock {
    [self sd_cancelCurrentImageLoad];
    objc_setAssociatedObject(self, &imageURLKey, url, OBJC_ASSOCIATION_RETAIN_NONATOMIC);

    if (!(options & SDWebImageDelayPlaceholder)) {
        dispatch_main_async_safe(^{
            self.image = placeholder;
        });
    }
    
    if (url) {
        // check if activityView is enabled or not
        if ([self showActivityIndicatorView]) {
            [self addActivityIndicator];
        }

        __weak __typeof(self)wself = self;
        id <SDWebImageOperation> operation = [SDWebImageManager.sharedManager downloadImageWithURL:url options:options progress:progressBlock completed:^(UIImage *image, NSError *error, SDImageCacheType cacheType, BOOL finished, NSURL *imageURL) {
        /*
            [wself removeActivityIndicator];
            if (!wself) return;
            dispatch_main_sync_safe(^{
                if (!wself) return;
                if (image && (options & SDWebImageAvoidAutoSetImage) && completedBlock)
                {
                    completedBlock(image, error, cacheType, url);
                    return;
                }
                else if (image) {
                    wself.image = image;
                    [wself setNeedsLayout];
                } else {
                    if ((options & SDWebImageDelayPlaceholder)) {
                        wself.image = placeholder;
                        [wself setNeedsLayout];
                    }
                }
                if (completedBlock && finished) {
                    completedBlock(image, error, cacheType, url);
                }
            });
        }];
        [self sd_setImageLoadOperation:operation forKey:@"UIImageViewImageLoad"];
        */
    } else {
        dispatch_main_async_safe(^{
            [self removeActivityIndicator];
            if (completedBlock) {
                NSError *error = [NSError errorWithDomain:SDWebImageErrorDomain code:-1 userInfo:@{NSLocalizedDescriptionKey : @"Trying to load a nil url"}];
                completedBlock(nil, error, SDImageCacheTypeNone, url);
            }
        });
    }
}
```

上面注视的代码是上述关键步骤十三，也就是获得完图片之后，返回主线程去设置图片。

所以，剩余的代码特别简单。

1、取消了本身下载的图片，有兴趣可以去阅读一下 `sd_cancelCurrentImageLoad` 的代码，这里简单说一下，当一个 `UIView` (本例子中是 `UIImageView`), 发起一个 URL 请求， `SDWebImage` 会把这个 URL 通过 `objc_setAssociatedObject` 的方法绑定到这个 `UIView` 中。如果这个 `UIView` 再次发起一个新的请求，会把原先的 URL 请求给取消掉。想想 `UITableViewCell` 的复用场景就知道为什么要这么做了

2、设置 `placeholder` 和 `UIActivityIndicatorView`

3、向 `SDWebImageManager` 发起查找 URL 图片。

上述的 `dispatch_main_async_safe`(同样对应一个 `dispatch_main_sync_safe` 版本) 是一个简单的宏定义，

```
#define dispatch_main_async_safe(block)
if ([NSThread isMainThread]) {
   block();
} else {
   dispatch_async(dispatch_get_main_queue(), block);
}
```
就是简单的判断是否为主线程，如果不是切换到主线程操作

------------------------------

**步骤二：寻找缓存**

```
- (id <SDWebImageOperation>)downloadImageWithURL:(NSURL *)url
                                         options:(SDWebImageOptions)options
                                        progress:(SDWebImageDownloaderProgressBlock)progressBlock
                                       completed:(SDWebImageCompletionWithFinishedBlock)completedBlock {
    // Invoking this method without a completedBlock is pointless
    NSAssert(completedBlock != nil, @"If you mean to prefetch the image, use -[SDWebImagePrefetcher prefetchURLs] instead");

    // Very common mistake is to send the URL using NSString object instead of NSURL. For some strange reason, XCode won't
    // throw any warning for this type mismatch. Here we failsafe this error by allowing URLs to be passed as NSString.
    if ([url isKindOfClass:NSString.class]) {
        url = [NSURL URLWithString:(NSString *)url];
    }

    // Prevents app crashing on argument type error like sending NSNull instead of NSURL
    if (![url isKindOfClass:NSURL.class]) {
        url = nil;
    }

    __block SDWebImageCombinedOperation *operation = [SDWebImageCombinedOperation new];
    __weak SDWebImageCombinedOperation *weakOperation = operation;

    BOOL isFailedUrl = NO;
    @synchronized (self.failedURLs) {
        isFailedUrl = [self.failedURLs containsObject:url];
    }

    if (url.absoluteString.length == 0 || (!(options & SDWebImageRetryFailed) && isFailedUrl)) {
        dispatch_main_sync_safe(^{
            NSError *error = [NSError errorWithDomain:NSURLErrorDomain code:NSURLErrorFileDoesNotExist userInfo:nil];
            completedBlock(nil, error, SDImageCacheTypeNone, YES, url);
        });
        return operation;
    }

    @synchronized (self.runningOperations) {
        [self.runningOperations addObject:operation];
    }
    NSString *key = [self cacheKeyForURL:url];

    operation.cacheOperation = [self.imageCache queryDiskCacheForKey:key done:^(UIImage *image, SDImageCacheType cacheType) {
    //... ---------------- 省略一
           }];

    return operation;
}
```

这里，为了方便阅读，我删除了找缓存之后的回掉代码。

这里，简单的判断了 url 的参数是否为 `NSURL`, 如果是 `NSString`, 则帮你转化为 `NSURL`, 所以，我上面写这样的代码（`sd_setImageWithURL:` 后面跟了一个 `NSString`）

```
[self.imageView sd_setImageWithURL:@"http://desk.fd.zol-img.com.cn/t_s1680x1050c5/g5/M00/02/03/
ChMkJ1bKxtqIXy1OAAi9LK5qQwgAALHrQK3PAoACL1E420.jpg" placeholderImage:nil];
```
虽然收到了警告，但是 `SDWebImage` 帮我处理了这个问题。

然后判断这个 `URL` 在之前的操作中是否已经失败了，如果失败了，并且不进行重试`!(options & SDWebImageRetryFailed)`，则直接返回错误

最后，从 `SDWebImageCache` 中开始查找缓存

```
- (NSOperation *)queryDiskCacheForKey:(NSString *)key done:(SDWebImageQueryCompletedBlock)doneBlock {
    if (!doneBlock) {
        return nil;
    }

    if (!key) {
        doneBlock(nil, SDImageCacheTypeNone);
        return nil;
    }

    // First check the in-memory cache...
    UIImage *image = [self imageFromMemoryCacheForKey:key];
    if (image) {
        doneBlock(image, SDImageCacheTypeMemory);
        return nil;
    }

    NSOperation *operation = [NSOperation new];
    dispatch_async(self.ioQueue, ^{
        if (operation.isCancelled) {
            return;
        }

        @autoreleasepool {
            UIImage *diskImage = [self diskImageForKey:key];
            if (diskImage && self.shouldCacheImagesInMemory) {
                NSUInteger cost = SDCacheCostForImage(diskImage);
                [self.memCache setObject:diskImage forKey:key cost:cost];
            }

            dispatch_async(dispatch_get_main_queue(), ^{
                doneBlock(diskImage, SDImageCacheTypeDisk);
            });
        }
    });

    return operation;
}

- (UIImage *)imageFromMemoryCacheForKey:(NSString *)key {
    return [self.memCache objectForKey:key];
}
```

`self.memCache` 是一个 [NSCache](http://nshipster.cn/nscache/), 首先检查了 `self.memCache` 中是否存在，如果不存在则去硬盘中查找，如果找到了，这这个东西放进 `self.memCache` 中。如果没有找到，也返回 `doneBlock` 中完成“省略一”的操作

接着看“省略一”的代码，去除了部分错误处理的代码（因为实在太长。。而且你并不会那么关注）

```
if (image && options & SDWebImageRefreshCached) {
     dispatch_main_sync_safe(^{
         // If image was found in the cache but SDWebImageRefreshCached is provided, notify about the cached image
         // AND try to re-download it in order to let a chance to NSURLCache to refresh it from server.
         completedBlock(image, nil, cacheType, YES, url);
     });
}
id <SDWebImageOperation> subOperation = [self.imageDownloader downloadImageWithURL:url options:downloaderOptions progress:progressBlock completed:^(UIImage *downloadedImage, NSData *data, NSError *error, BOOL finished) {
.....///省略二
}
    
```
去除一些错误代码之后，可以看到，当缓存在没有找到之后，此时，会向 `SDWebImageDownloader` 发起一个下载任务进入步骤三

**步骤三：创建 `NSMutableURLRequest`**

```
- (id <SDWebImageOperation>)downloadImageWithURL:(NSURL *)url options:(SDWebImageDownloaderOptions)options progress:(SDWebImageDownloaderProgressBlock)progressBlock completed:(SDWebImageDownloaderCompletedBlock)completedBlock {
    __block SDWebImageDownloaderOperation *operation;
    __weak __typeof(self)wself = self;

    [self addProgressCallback:progressBlock completedBlock:completedBlock forURL:url createCallback:^{
        NSTimeInterval timeoutInterval = wself.downloadTimeout;
        if (timeoutInterval == 0.0) {
            timeoutInterval = 15.0;
        }

        // In order to prevent from potential duplicate caching (NSURLCache + SDImageCache) we disable the cache for image requests if told otherwise
        NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:url cachePolicy:(options & SDWebImageDownloaderUseNSURLCache ? NSURLRequestUseProtocolCachePolicy : NSURLRequestReloadIgnoringLocalCacheData) timeoutInterval:timeoutInterval];
        request.HTTPShouldHandleCookies = (options & SDWebImageDownloaderHandleCookies);
        request.HTTPShouldUsePipelining = YES;
        if (wself.headersFilter) {
            request.allHTTPHeaderFields = wself.headersFilter(url, [wself.HTTPHeaders copy]);
        }
        else {
            request.allHTTPHeaderFields = wself.HTTPHeaders;
        }
//步骤四和步骤五的代码
}

- (void)addProgressCallback:(SDWebImageDownloaderProgressBlock)progressBlock completedBlock:(SDWebImageDownloaderCompletedBlock)completedBlock forURL:(NSURL *)url createCallback:(SDWebImageNoParamsBlock)createCallback {
    // The URL will be used as the key to the callbacks dictionary so it cannot be nil. If it is nil immediately call the completed block with no image or data.
    if (url == nil) {
        if (completedBlock != nil) {
            completedBlock(nil, nil, nil, NO);
        }
        return;
    }

    dispatch_barrier_sync(self.barrierQueue, ^{
        BOOL first = NO;
        if (!self.URLCallbacks[url]) {
            self.URLCallbacks[url] = [NSMutableArray new];
            first = YES;
        }

        // Handle single download of simultaneous download request for the same URL
        NSMutableArray *callbacksForURL = self.URLCallbacks[url];
        NSMutableDictionary *callbacks = [NSMutableDictionary new];
        if (progressBlock) callbacks[kProgressCallbackKey] = [progressBlock copy];
        if (completedBlock) callbacks[kCompletedCallbackKey] = [completedBlock copy];
        [callbacksForURL addObject:callbacks];
        self.URLCallbacks[url] = callbacksForURL;

        if (first) {
            createCallback();
        }
    });
}
```

```
- (void)addProgressCallback:(SDWebImageDownloaderProgressBlock)progressBlock 
            completedBlock:(SDWebImageDownloaderCompletedBlock)completedBlock 
                    forURL:(NSURL *)url createCallback:(SDWebImageNoParamsBlock)createCallback
```

这个函数就是先**检查之前是否有这个 URL 正在下载**，`self.URLCallbacks` 是一个 `NSMutableDictionary`, 这里保存了正在下载的 URL, 在 [Kingfisher](https://github.com/onevcat/Kingfisher) 中，也有这样一段代码。
紧接着，创建一个 `NSMutableURLRequest`， 配置好它的参数，进入步骤四

**步骤四：根据`NSMutableURLRequest`创建一个`NSOperation`**

```
@interface SDWebImageDownloaderOperation : NSOperation

@end

@implementation SDWebImageDownloaderOperation 

- (id)initWithRequest:(NSURLRequest *)request
            inSession:(NSURLSession *)session
              options:(SDWebImageDownloaderOptions)options
             progress:(SDWebImageDownloaderProgressBlock)progressBlock
            completed:(SDWebImageDownloaderCompletedBlock)completedBlock
            cancelled:(SDWebImageNoParamsBlock)cancelBlock {
    if ((self = [super init])) {
        _request = [request copy];
        _shouldDecompressImages = YES;
        _options = options;
        _progressBlock = [progressBlock copy];
        _completedBlock = [completedBlock copy];
        _cancelBlock = [cancelBlock copy];
        _executing = NO;
        _finished = NO;
        _expectedSize = 0;  //这个变量用来计算 process 的
        _unownedSession = session;
        responseFromCached = YES; // Initially wrong until `- URLSession:dataTask:willCacheResponse:completionHandler: is called or not called
    }
    return self;
}

@end

- (id <SDWebImageOperation>)downloadImageWithURL:(NSURL *)url options:(SDWebImageDownloaderOptions)options progress:(SDWebImageDownloaderProgressBlock)progressBlock completed:(SDWebImageDownloaderCompletedBlock)completedBlock {
    //步骤三
    operation = [[wself.operationClass alloc] initWithRequest:request
                                                        inSession:self.session
                                                          options:options
                                                         progress:^(NSInteger receivedSize, NSInteger expectedSize) {
        ...//省略三                             
                                                        }];
   operation.shouldDecompressImages = wself.shouldDecompressImages;
   
   if (wself.urlCredential) {
       operation.credential = wself.urlCredential;
   } else if (wself.username && wself.password) {
       operation.credential = [NSURLCredential credentialWithUser:wself.username password:wself.password persistence:NSURLCredentialPersistenceForSession];
   }
    //步骤五
    return operation;
}


```

步骤四的代码在 [Kingfisher](https://github.com/onevcat/Kingfisher) 的代码中并没有被体现，原因是 [Kingfisher](https://github.com/onevcat/Kingfisher)直接使用了 `NSURLSessionTask` 的优先级（iOS 8 API）

**步骤五：把 operation 加入到队列中**

```
- (id <SDWebImageOperation>)downloadImageWithURL:(NSURL *)url options:(SDWebImageDownloaderOptions)options progress:(SDWebImageDownloaderProgressBlock)progressBlock completed:(SDWebImageDownloaderCompletedBlock)completedBlock {
    //步骤三
    //步骤四
    if (options & SDWebImageDownloaderHighPriority) {
      operation.queuePriority = NSOperationQueuePriorityHigh;
    } else if (options & SDWebImageDownloaderLowPriority) {
      operation.queuePriority = NSOperationQueuePriorityLow;
    }
    
    [wself.downloadQueue addOperation:operation];
    if (wself.executionOrder == SDWebImageDownloaderLIFOExecutionOrder) {
      // Emulate LIFO execution order by systematically adding new operations as last operation's dependency
      [wself.lastAddedOperation addDependency:operation];
      wself.lastAddedOperation = operation;
    }
}
```

`SDWebImage` 存在两种模式，先进先出和先进后出（后者是我在 issue 中似乎看到了有人需要这种需求），具体的实现方案是 `SDWebImage` 使用了一个队列，`downloadQueue` 以及 `lastAddedOperation` 记录上一个 operation, 如果是先进先出，则直接加入到 `downloadQueue`， 如果是先进后出，再加入到 `downloadQueue` 之后，还要让 `lastAddedOperation` dependency `operation`。总之，这里的代码很简单，看一看就明白了

**步骤六：配置 NSURLSessionDataTask，开启 operation**

这里具体的代码在 `SDWebImageDownloaderOperation: NSOperation` 的 `start` 函数中

```
- (void)start {
    @synchronized (self) {
        if (self.isCancelled) {
            self.finished = YES;
            [self reset];
            return;
        }

#if TARGET_OS_IPHONE && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_4_0
        Class UIApplicationClass = NSClassFromString(@"UIApplication");
        BOOL hasApplication = UIApplicationClass && [UIApplicationClass respondsToSelector:@selector(sharedApplication)];
        if (hasApplication && [self shouldContinueWhenAppEntersBackground]) {
            __weak __typeof__ (self) wself = self;
            UIApplication * app = [UIApplicationClass performSelector:@selector(sharedApplication)];
            self.backgroundTaskId = [app beginBackgroundTaskWithExpirationHandler:^{
                __strong __typeof (wself) sself = wself;

                if (sself) {
                    [sself cancel];

                    [app endBackgroundTask:sself.backgroundTaskId];
                    sself.backgroundTaskId = UIBackgroundTaskInvalid;
                }
            }];
        }
#endif
        NSURLSession *session = self.unownedSession;
        if (!self.unownedSession) {
            NSURLSessionConfiguration *sessionConfig = [NSURLSessionConfiguration defaultSessionConfiguration];
            sessionConfig.timeoutIntervalForRequest = 15;
            
            /**
             *  Create the session for this task
             *  We send nil as delegate queue so that the session creates a serial operation queue for performing all delegate
             *  method calls and completion handler calls.
             */
            self.ownedSession = [NSURLSession sessionWithConfiguration:sessionConfig
                                                              delegate:self
                                                         delegateQueue:nil];
            session = self.ownedSession;
        }
        
        self.dataTask = [session dataTaskWithRequest:self.request];
        self.executing = YES;
        self.thread = [NSThread currentThread];
    }
    
    [self.dataTask resume];

    if (self.dataTask) {
        if (self.progressBlock) {
            self.progressBlock(0, NSURLResponseUnknownLength);
        }
        dispatch_async(dispatch_get_main_queue(), ^{
            [[NSNotificationCenter defaultCenter] postNotificationName:SDWebImageDownloadStartNotification object:self];
        });
    }
    else {
        if (self.completedBlock) {
            self.completedBlock(nil, nil, [NSError errorWithDomain:NSURLErrorDomain code:0 userInfo:@{NSLocalizedDescriptionKey : @"Connection can't be initialized"}], YES);
        }
    }

#if TARGET_OS_IPHONE && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_4_0
    Class UIApplicationClass = NSClassFromString(@"UIApplication");
    if(!UIApplicationClass || ![UIApplicationClass respondsToSelector:@selector(sharedApplication)]) {
        return;
    }
    if (self.backgroundTaskId != UIBackgroundTaskInvalid) {
        UIApplication * app = [UIApplication performSelector:@selector(sharedApplication)];
        [app endBackgroundTask:self.backgroundTaskId];
        self.backgroundTaskId = UIBackgroundTaskInvalid;
    }
#endif
}

```

单纯的组装代码，没啥好解释的。就是组装一个 `NSURLSessionDataTask`， 某些情况下，开启后台任务下载。
然后等待回掉

**步骤七：接收第一次响应**

```
- (void)URLSession:(NSURLSession *)session
          dataTask:(NSURLSessionDataTask *)dataTask
didReceiveResponse:(NSURLResponse *)response
 completionHandler:(void (^)(NSURLSessionResponseDisposition disposition))completionHandler {
    
    //'304 Not Modified' is an exceptional one
    if (![response respondsToSelector:@selector(statusCode)] || ([((NSHTTPURLResponse *)response) statusCode] < 400 && [((NSHTTPURLResponse *)response) statusCode] != 304)) {
        NSInteger expected = response.expectedContentLength > 0 ? (NSInteger)response.expectedContentLength : 0;
        self.expectedSize = expected;
        if (self.progressBlock) {
            self.progressBlock(0, expected);
        }
        
        self.imageData = [[NSMutableData alloc] initWithCapacity:expected];
        self.response = response;
        dispatch_async(dispatch_get_main_queue(), ^{
            [[NSNotificationCenter defaultCenter] postNotificationName:SDWebImageDownloadReceiveResponseNotification object:self];
        });
    }
    else {
        NSUInteger code = [((NSHTTPURLResponse *)response) statusCode];
        
        //This is the case when server returns '304 Not Modified'. It means that remote image is not changed.
        //In case of 304 we need just cancel the operation and return cached image from the cache.
        if (code == 304) {
            [self cancelInternal];
        } else {
            [self.dataTask cancel];
        }
        dispatch_async(dispatch_get_main_queue(), ^{
            [[NSNotificationCenter defaultCenter] postNotificationName:SDWebImageDownloadStopNotification object:self];
        });
        
        if (self.completedBlock) {
            self.completedBlock(nil, nil, [NSError errorWithDomain:NSURLErrorDomain code:[((NSHTTPURLResponse *)response) statusCode] userInfo:nil], YES);
        }
        [self done];
    }
    
    if (completionHandler) {
        completionHandler(NSURLSessionResponseAllow);
    }
}
```
根据 http 的响应，判断是否是 正确的 code，如果是 [304 code](https://zh.wikipedia.org/wiki/HTTP_ETag)，特殊处理。并且把 `self.expectedSize` 计算好，用于 process 的计算


**步骤八：接收 data**

```
- (void)URLSession:(NSURLSession *)session dataTask:(NSURLSessionDataTask *)dataTask didReceiveData:(NSData *)data {
    [self.imageData appendData:data];

    if ((self.options & SDWebImageDownloaderProgressiveDownload) && self.expectedSize > 0 && self.completedBlock) {
        // The following code is from http://www.cocoaintheshell.com/2011/05/progressive-images-download-imageio/
        // Thanks to the author @Nyx0uf

        // Get the total bytes downloaded
        const NSInteger totalSize = self.imageData.length;

        // Update the data source, we must pass ALL the data, not just the new bytes
        CGImageSourceRef imageSource = CGImageSourceCreateWithData((__bridge CFDataRef)self.imageData, NULL);

        if (width + height == 0) {
            CFDictionaryRef properties = CGImageSourceCopyPropertiesAtIndex(imageSource, 0, NULL);
            if (properties) {
                NSInteger orientationValue = -1;
                CFTypeRef val = CFDictionaryGetValue(properties, kCGImagePropertyPixelHeight);
                if (val) CFNumberGetValue(val, kCFNumberLongType, &height);
                val = CFDictionaryGetValue(properties, kCGImagePropertyPixelWidth);
                if (val) CFNumberGetValue(val, kCFNumberLongType, &width);
                val = CFDictionaryGetValue(properties, kCGImagePropertyOrientation);
                if (val) CFNumberGetValue(val, kCFNumberNSIntegerType, &orientationValue);
                CFRelease(properties);

                // When we draw to Core Graphics, we lose orientation information,
                // which means the image below born of initWithCGIImage will be
                // oriented incorrectly sometimes. (Unlike the image born of initWithData
                // in didCompleteWithError.) So save it here and pass it on later.
                orientation = [[self class] orientationFromPropertyValue:(orientationValue == -1 ? 1 : orientationValue)];
            }

        }

        if (width + height > 0 && totalSize < self.expectedSize) {
            // Create the image
            CGImageRef partialImageRef = CGImageSourceCreateImageAtIndex(imageSource, 0, NULL);

#ifdef TARGET_OS_IPHONE
            // Workaround for iOS anamorphic image
            if (partialImageRef) {
                const size_t partialHeight = CGImageGetHeight(partialImageRef);
                CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
                CGContextRef bmContext = CGBitmapContextCreate(NULL, width, height, 8, width * 4, colorSpace, kCGBitmapByteOrderDefault | kCGImageAlphaPremultipliedFirst);
                CGColorSpaceRelease(colorSpace);
                if (bmContext) {
                    CGContextDrawImage(bmContext, (CGRect){.origin.x = 0.0f, .origin.y = 0.0f, .size.width = width, .size.height = partialHeight}, partialImageRef);
                    CGImageRelease(partialImageRef);
                    partialImageRef = CGBitmapContextCreateImage(bmContext);
                    CGContextRelease(bmContext);
                }
                else {
                    CGImageRelease(partialImageRef);
                    partialImageRef = nil;
                }
            }
#endif

            if (partialImageRef) {
                UIImage *image = [UIImage imageWithCGImage:partialImageRef scale:1 orientation:orientation];
                NSString *key = [[SDWebImageManager sharedManager] cacheKeyForURL:self.request.URL];
                UIImage *scaledImage = [self scaledImageForKey:key image:image];
                if (self.shouldDecompressImages) {
                    image = [UIImage decodedImageWithImage:scaledImage];
                }
                else {
                    image = scaledImage;
                }
                CGImageRelease(partialImageRef);
                dispatch_main_sync_safe(^{
                    if (self.completedBlock) {
                        self.completedBlock(image, nil, nil, NO);
                    }
                });
            }
        }

        CFRelease(imageSource);
    }

    if (self.progressBlock) {
        self.progressBlock(self.imageData.length, self.expectedSize);
    }
}
```
这里做的就是 接收 data，然后组装成图片（至于为什么要在 data 没有完成接收就要组装我也不是很明白，作者贴的那个注视的 URL 也已经失效了）

**步骤九：接收 data 结束，解码 image**

```
- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task didCompleteWithError:(NSError *)error {
    @synchronized(self) {
        self.thread = nil;
        self.dataTask = nil;
        dispatch_async(dispatch_get_main_queue(), ^{
            [[NSNotificationCenter defaultCenter] postNotificationName:SDWebImageDownloadStopNotification object:self];
            if (!error) {
                [[NSNotificationCenter defaultCenter] postNotificationName:SDWebImageDownloadFinishNotification object:self];
            }
        });
    }
    
    if (error) {
        if (self.completedBlock) {
            self.completedBlock(nil, nil, error, YES);
        }
    } else {
        SDWebImageDownloaderCompletedBlock completionBlock = self.completedBlock;
        
        if (completionBlock) {
            /**
             *  See #1608 and #1623 - apparently, there is a race condition on `NSURLCache` that causes a crash
             *  Limited the calls to `cachedResponseForRequest:` only for cases where we should ignore the cached response
             *    and images for which responseFromCached is YES (only the ones that cannot be cached).
             *  Note: responseFromCached is set to NO inside `willCacheResponse:`. This method doesn't get called for large images or images behind authentication 
             */
            if (self.options & SDWebImageDownloaderIgnoreCachedResponse && responseFromCached && [[NSURLCache sharedURLCache] cachedResponseForRequest:self.request]) {
                completionBlock(nil, nil, nil, YES);
            } else if (self.imageData) {
                UIImage *image = [UIImage sd_imageWithData:self.imageData];
                NSString *key = [[SDWebImageManager sharedManager] cacheKeyForURL:self.request.URL];
                image = [self scaledImageForKey:key image:image];
                
                // Do not force decoding animated GIFs
                if (!image.images) {
                    if (self.shouldDecompressImages) {
                        image = [UIImage decodedImageWithImage:image];
                    }
                }
                if (CGSizeEqualToSize(image.size, CGSizeZero)) {
                    completionBlock(nil, nil, [NSError errorWithDomain:SDWebImageErrorDomain code:0 userInfo:@{NSLocalizedDescriptionKey : @"Downloaded image has 0 pixels"}], YES);
                }
                else {
                    completionBlock(image, self.imageData, nil, YES);
                }
            } else {
                completionBlock(nil, nil, [NSError errorWithDomain:SDWebImageErrorDomain code:0 userInfo:@{NSLocalizedDescriptionKey : @"Image data is nil"}], YES);
            }
        }
    }
    
    self.completionBlock = nil;
    [self done];
}

+ (UIImage *)decodedImageWithImage:(UIImage *)image {
    // while downloading huge amount of images
    // autorelease the bitmap context
    // and all vars to help system to free memory
    // when there are memory warning.
    // on iOS7, do not forget to call
    // [[SDImageCache sharedImageCache] clearMemory];
    
    if (image == nil) { // Prevent "CGBitmapContextCreateImage: invalid context 0x0" error
        return nil;
    }
    
    @autoreleasepool{
        // do not decode animated images
        if (image.images != nil) {
            return image;
        }
        
        CGImageRef imageRef = image.CGImage;
        
        CGImageAlphaInfo alpha = CGImageGetAlphaInfo(imageRef);
        BOOL anyAlpha = (alpha == kCGImageAlphaFirst ||
                         alpha == kCGImageAlphaLast ||
                         alpha == kCGImageAlphaPremultipliedFirst ||
                         alpha == kCGImageAlphaPremultipliedLast);
        if (anyAlpha) {
            return image;
        }
        
        // current
        CGColorSpaceModel imageColorSpaceModel = CGColorSpaceGetModel(CGImageGetColorSpace(imageRef));
        CGColorSpaceRef colorspaceRef = CGImageGetColorSpace(imageRef);
        
        BOOL unsupportedColorSpace = (imageColorSpaceModel == kCGColorSpaceModelUnknown ||
                                      imageColorSpaceModel == kCGColorSpaceModelMonochrome ||
                                      imageColorSpaceModel == kCGColorSpaceModelCMYK ||
                                      imageColorSpaceModel == kCGColorSpaceModelIndexed);
        if (unsupportedColorSpace) {
            colorspaceRef = CGColorSpaceCreateDeviceRGB();
        }
        
        size_t width = CGImageGetWidth(imageRef);
        size_t height = CGImageGetHeight(imageRef);
        NSUInteger bytesPerPixel = 4;
        NSUInteger bytesPerRow = bytesPerPixel * width;
        NSUInteger bitsPerComponent = 8;


        // kCGImageAlphaNone is not supported in CGBitmapContextCreate.
        // Since the original image here has no alpha info, use kCGImageAlphaNoneSkipLast
        // to create bitmap graphics contexts without alpha info.
        CGContextRef context = CGBitmapContextCreate(NULL,
                                                     width,
                                                     height,
                                                     bitsPerComponent,
                                                     bytesPerRow,
                                                     colorspaceRef,
                                                     kCGBitmapByteOrderDefault|kCGImageAlphaNoneSkipLast);
        
        // Draw the image into the context and retrieve the new bitmap image without alpha
        CGContextDrawImage(context, CGRectMake(0, 0, width, height), imageRef);
        CGImageRef imageRefWithoutAlpha = CGBitmapContextCreateImage(context);
        UIImage *imageWithoutAlpha = [UIImage imageWithCGImage:imageRefWithoutAlpha
                                                         scale:image.scale
                                                   orientation:image.imageOrientation];
        
        if (unsupportedColorSpace) {
            CGColorSpaceRelease(colorspaceRef);
        }
        
        CGContextRelease(context);
        CGImageRelease(imageRefWithoutAlpha);
        
        return imageWithoutAlpha;
    }
}

```
这段代码大部分都是在错误处理，然后 `decoded` image，然后我都是直接跳过了。

**步骤十～十二：启内存缓存和磁盘缓存**

这里的代码调用入口在 “省略二” 的 block 中，由于大部分的代码都是在判断条件是否要缓存，以及一些移除 operation，以及把这个 URL 从正在下载的字典中移除，代码比较杂，所以我直接列了缓存的代码 

```
- (void)storeImage:(UIImage *)image recalculateFromImage:(BOOL)recalculate imageData:(NSData *)imageData forKey:(NSString *)key toDisk:(BOOL)toDisk {
    if (!image || !key) {
        return;
    }
    // if memory cache is enabled
    if (self.shouldCacheImagesInMemory) {
        NSUInteger cost = SDCacheCostForImage(image);
        [self.memCache setObject:image forKey:key cost:cost];
    }

    if (toDisk) {
        dispatch_async(self.ioQueue, ^{
            NSData *data = imageData;

            if (image && (recalculate || !data)) {
#if TARGET_OS_IPHONE
                // We need to determine if the image is a PNG or a JPEG
                // PNGs are easier to detect because they have a unique signature (http://www.w3.org/TR/PNG-Structure.html)
                // The first eight bytes of a PNG file always contain the following (decimal) values:
                // 137 80 78 71 13 10 26 10

                // If the imageData is nil (i.e. if trying to save a UIImage directly or the image was transformed on download)
                // and the image has an alpha channel, we will consider it PNG to avoid losing the transparency
                int alphaInfo = CGImageGetAlphaInfo(image.CGImage);
                BOOL hasAlpha = !(alphaInfo == kCGImageAlphaNone ||
                                  alphaInfo == kCGImageAlphaNoneSkipFirst ||
                                  alphaInfo == kCGImageAlphaNoneSkipLast);
                BOOL imageIsPng = hasAlpha;

                // But if we have an image data, we will look at the preffix
                if ([imageData length] >= [kPNGSignatureData length]) {
                    imageIsPng = ImageDataHasPNGPreffix(imageData);
                }

                if (imageIsPng) {
                    data = UIImagePNGRepresentation(image);
                }
                else {
                    data = UIImageJPEGRepresentation(image, (CGFloat)1.0);
                }
#else
                data = [NSBitmapImageRep representationOfImageRepsInArray:image.representations usingType: NSJPEGFileType properties:nil];
#endif
            }

            [self storeImageDataToDisk:data forKey:key];
        });
    }
}

FOUNDATION_STATIC_INLINE NSUInteger SDCacheCostForImage(UIImage *image) {
    return image.size.height * image.size.width * image.scale * image.scale;
}
```

拿到图片以后，把它写入到 `NSCache` 中，以 `image.size.height * image.size.width * image.scale * image.scale` 为 `cost`
之后，在写入到磁盘中，`SDWebImage` 默认清除一个星期的缓存，会在每次 app 被杀掉或者进入后台的时候执行

```
 [[NSNotificationCenter defaultCenter] addObserver:self
                                            selector:@selector(cleanDisk)
                                                name:UIApplicationWillTerminateNotification
                                              object:nil];

   [[NSNotificationCenter defaultCenter] addObserver:self
                                            selector:@selector(backgroundCleanDisk)
                                                name:UIApplicationDidEnterBackgroundNotification
                                              object:nil];
                                                   
- (void)cleanDiskWithCompletionBlock:(SDWebImageNoParamsBlock)completionBlock {
    dispatch_async(self.ioQueue, ^{
        NSURL *diskCacheURL = [NSURL fileURLWithPath:self.diskCachePath isDirectory:YES];
        NSArray *resourceKeys = @[NSURLIsDirectoryKey, NSURLContentModificationDateKey, NSURLTotalFileAllocatedSizeKey];

        // This enumerator prefetches useful properties for our cache files.
        NSDirectoryEnumerator *fileEnumerator = [_fileManager enumeratorAtURL:diskCacheURL
                                                   includingPropertiesForKeys:resourceKeys
                                                                      options:NSDirectoryEnumerationSkipsHiddenFiles
                                                                 errorHandler:NULL];

        NSDate *expirationDate = [NSDate dateWithTimeIntervalSinceNow:-self.maxCacheAge];
        NSMutableDictionary *cacheFiles = [NSMutableDictionary dictionary];
        NSUInteger currentCacheSize = 0;

        // Enumerate all of the files in the cache directory.  This loop has two purposes:
        //
        //  1. Removing files that are older than the expiration date.
        //  2. Storing file attributes for the size-based cleanup pass.
        NSMutableArray *urlsToDelete = [[NSMutableArray alloc] init];
        for (NSURL *fileURL in fileEnumerator) {
            NSDictionary *resourceValues = [fileURL resourceValuesForKeys:resourceKeys error:NULL];

            // Skip directories.
            if ([resourceValues[NSURLIsDirectoryKey] boolValue]) {
                continue;
            }

            // Remove files that are older than the expiration date;
            NSDate *modificationDate = resourceValues[NSURLContentModificationDateKey];
            if ([[modificationDate laterDate:expirationDate] isEqualToDate:expirationDate]) {
                [urlsToDelete addObject:fileURL];
                continue;
            }

            // Store a reference to this file and account for its total size.
            NSNumber *totalAllocatedSize = resourceValues[NSURLTotalFileAllocatedSizeKey];
            currentCacheSize += [totalAllocatedSize unsignedIntegerValue];
            [cacheFiles setObject:resourceValues forKey:fileURL];
        }
        
        for (NSURL *fileURL in urlsToDelete) {
            [_fileManager removeItemAtURL:fileURL error:nil];
        }

        // If our remaining disk cache exceeds a configured maximum size, perform a second
        // size-based cleanup pass.  We delete the oldest files first.
        if (self.maxCacheSize > 0 && currentCacheSize > self.maxCacheSize) {
            // Target half of our maximum cache size for this cleanup pass.
            const NSUInteger desiredCacheSize = self.maxCacheSize / 2;

            // Sort the remaining cache files by their last modification time (oldest first).
            NSArray *sortedFiles = [cacheFiles keysSortedByValueWithOptions:NSSortConcurrent
                                                            usingComparator:^NSComparisonResult(id obj1, id obj2) {
                                                                return [obj1[NSURLContentModificationDateKey] compare:obj2[NSURLContentModificationDateKey]];
                                                            }];

            // Delete files until we fall below our desired cache size.
            for (NSURL *fileURL in sortedFiles) {
                if ([_fileManager removeItemAtURL:fileURL error:nil]) {
                    NSDictionary *resourceValues = cacheFiles[fileURL];
                    NSNumber *totalAllocatedSize = resourceValues[NSURLTotalFileAllocatedSizeKey];
                    currentCacheSize -= [totalAllocatedSize unsignedIntegerValue];

                    if (currentCacheSize < desiredCacheSize) {
                        break;
                    }
                }
            }
        }
        if (completionBlock) {
            dispatch_async(dispatch_get_main_queue(), ^{
                completionBlock();
            });
        }
    });
}
                                                   
                                                   
```

另外，当接收到内存警告的时候，会清除 `memCache` 的内容

```
[[NSNotificationCenter defaultCenter] addObserver:self
                                       selector:@selector(clearMemory)
                                           name:UIApplicationDidReceiveMemoryWarningNotification
                                         object:nil];
- (void)clearMemory {
    [self.memCache removeAllObjects];
}
```

步骤十三回到主线程完成最后的操作相对简单，这里不在叙述

