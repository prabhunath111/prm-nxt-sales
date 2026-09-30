#import "AppDelegate.h"

#import <Firebase.h>

#import <React/RCTBundleURLProvider.h>

#import <ReactNativeMoEngage/MoEngageInitializer.h>
#import <ReactNativeMoEngage/MoEngageReactSDKInitializationConfig.h>
#import <MoEngageSDK/MoEngageSDK.h>@implementation AppDelegate

#import <React/RCTLinkingManager.h>
#import "RNCConfig.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSString *moengageKey = [RNCConfig envFor:@"MOENGAGE_KEY"];
  NSString *moengageEnv = [RNCConfig envFor:@"MOENGAGE_ENVIRONMENT"];
  MoEngageSDKConfig* sdkConfig = [[MoEngageSDKConfig alloc] initWithAppId:moengageKey dataCenter: MoEngageDataCenterData_center_03];
  sdkConfig.consoleLogConfig = [[MoEngageConsoleLogConfig alloc] initWithIsLoggingEnabled:true loglevel:MoEngageLoggerTypeVerbose];
  
  MoEngageReactSDKInitializationConfig *reactConfig = [[MoEngageReactSDKInitializationConfig alloc] initWithSdkConfig:sdkConfig];
  reactConfig.launchOptions = launchOptions;
  reactConfig.isTestEnvironment = ![moengageEnv isEqualToString:@"LIVE"];
  [[MoEngageInitializer sharedInstance] initializeInstance:reactConfig];
  // Initializing firebase configuration for crashlitics
  [FIRApp configure];

  self.moduleName = @"tpSales";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
    return [RCTLinkingManager application:application openURL:url options:options];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity
  restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler {
    return [RCTLinkingManager application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
