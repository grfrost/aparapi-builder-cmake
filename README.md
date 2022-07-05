On Mac OSX I suggest updating XCode and ensuring you have clang command line tools installed

We will need
```
   cmake 
   git
```

You might also want
```
   clinfo
```

On Mac X64 and M1 assuming you have brew installed 
```
brew install clinfo
brew install cmake
brew install git
```

On linux

```
sudo apt-get install clinfo
sudo apt-get install cmake
sudo aptget install git
```

Clone this repo into aparapi-builder-cmake using git

```
$ git clone https://github.com/grfrost/aparapi-builder-cmake.git
```

Then change dir into aparapi-builder-cmake

```
cd aparapi-builder-cmake
```

If you are lucky (tested on linux and Apple OSX M1) you might just need to run the bootstrap-one-time.sh script 

```
$ bash ./bootstrap-one-time.sh 
```
Then you are done ;) 

If not, here are the steps the bootstrap-one-time.sh script is attempting ;)   

Clone the four aparapi repos from Syncleus
```
git clone https://github.com/Syncleus/aparapi.git
git clone https://github.com/Syncleus/aparapi-jni.git
git clone https://github.com/Syncleus/aparapi-native.git
git clone https://github.com/Syncleus/aparapi-examples.git
```

For Mac M1 we copy our patched NativeLoader.java over the one in aparapi-jni

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

If cmake complains you need to fix the issues. It worked for me :) with a brand new M1 box after installing XCode 

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
