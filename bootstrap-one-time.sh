cd syncleus
git clone https://github.com/Syncleus/aparapi.git
git clone https://github.com/Syncleus/aparapi-jni.git
git clone https://github.com/Syncleus/aparapi-native.git
git clone https://github.com/Syncleus/aparapi-examples.git
cp NativeLoader.java.patched aparapi-jni/src/main/java/com/aparapi/natives/NativeLoader.java
cp JNIExceptions.h.patched aparapi-native/src/cpp/JNIExceptions.h
cp Aparapi.cpp.patched aparapi-native/src/cpp/runKernel/Aparapi.cpp
cd .. 

mkdir build
cd build
cmake .. 
cd ..
cmake --build build --target javac --target jar 
