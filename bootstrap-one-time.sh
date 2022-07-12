
for repo in aparapi aparapi-jni aparapi-native aparapi-examples; do 
   if [ -d ${repo} ]; then 
      echo ${repo} exists
   else
      git clone https://github.com/Syncleus/${repo}.git ${repo}
      cd ${repo}
      git checkout . 
      cd ..
   fi
   if [ -f patches/${repo}.patch ]; then 
      cd ${repo} 
      git apply ../patches/${repo}.patch 
   else
      echo no patch for ${repo}
   fi
done 

rmdir -rf build 
mkdir -p build
cd build
cmake .. 
cd ..
cmake --build build --target javac --target jar 
