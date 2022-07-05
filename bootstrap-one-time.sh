git clone https://github.com/Syncleus/aparapi.git
git clone https://github.com/Syncleus/aparapi-jni.git
git clone https://github.com/Syncleus/aparapi-native.git
git clone https://github.com/Syncleus/aparapi-examples.git

cp NativeLoader.java.patched aparapi-jni/src/main/java/com/aparapi/natives/NativeLoader.java

mkdir build
cd build
cmake .. 
cd ..
cmake --build build --target javac --target jar 
