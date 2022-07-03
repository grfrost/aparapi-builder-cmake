Before you start I suggest updating XCode amnd ensuring you have command line tools installed

We will need
```
   cmake
   clinfo 
   git
```

Assuming you have brew installed 
```
brew install clinfo
brew install cmake
brew install git
```

Clone this repo into aparapi-m1 using git

```
$ git clone https://github.com/grfrost/aparapi-m1.git
```

Then change dir into aparapi-m1

```
cd aparapi-m1
```
Clone the four aparapi repos from Syncleus
```
git clone https://github.com/Syncleus/aparapi.git
git clone https://github.com/Syncleus/aparapi-jni.git
git clone https://github.com/Syncleus/aparapi-native.git
git clone https://github.com/Syncleus/aparapi-examples.git
```

Now we copy our patched patch the NativeLoader over the one in aparapi-jni

```
cp NativeLoader.java.patched aparapi-jni/src/main/java/com/aparapi/natives/NativeLoader.java
```

The above patch contains the code for Aparapi to load the aarch64 dynamic library
```
diff --git a/src/main/java/com/aparapi/natives/NativeLoader.java b/src/main/java/com/aparapi/natives/NativeLoader.java
index b26918f..23b6ff4 100644
--- a/src/main/java/com/aparapi/natives/NativeLoader.java
+++ b/src/main/java/com/aparapi/natives/NativeLoader.java
@@ -54,7 +54,11 @@ public class NativeLoader {
                     NativeUtils.loadLibraryFromJar("/linux/libaparapi_x86.so", "libaparapi.so");
             }
         } else if( isMac() && is64Bit() ) {
-            NativeUtils.loadLibraryFromJar("/osx/libaparapi_x86_64.dylib", "libaparapi.dylib");
+               if ( isArm() ){
+                    NativeUtils.loadLibraryFromJar("/osx/libaparapi_aarch64.dylib", "libaparapi.dylib");
+               }else{
+                    NativeUtils.loadLibraryFromJar("/osx/libaparapi_x86_64.dylib", "libaparapi.dylib");
+               }
         } else if( isWindows() && is64Bit() ) {
             String[][] librariesAndJars = new String[][] {
                 {"/win/libgcc_s_seh_x86_64.dll", "libgcc_s_seh-1.dll"},
```

Now we can create our build dir and go into it
 
```
mkdir build
cd build
```

Use cmake to prep the build
```
cmake ..
```

If cmake complains you need to fix the issues. It worked for me with a brand new M1 box after installing XCode 

Lets build from parent
```
cd ..
cmake --build build --target javac --target jar
```

You might see some clang warnings. 

You can test with 

```
cmake --build build --target javac --target jar --target mandel
```
