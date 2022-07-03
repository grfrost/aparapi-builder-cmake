After you clone this repo into aparapi-m1

git clone https://github.com/grfrost/aparapi-m1.git

cd aparapi-m1

git clone https://github.com/Syncleus/aparapi.git
git clone https://github.com/Syncleus/aparapi-jni.git
git clone https://github.com/Syncleus/aparapi-native.git
git clone https://github.com/Syncleus/aparapi-examples.git

cp NativeLoader.java.patched aparapi-jni/src/main/java/com/aparapi/natives/NativeLoader.java

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

mkdir build

cd build

cmake .. 

cd ..

cmake --build 



