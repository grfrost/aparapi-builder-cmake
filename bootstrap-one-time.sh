
for repo in aparapi aparapi-jni aparapi-native aparapi-examples; do 
   #rm -rf ${repo} # uncomment to force download
   if [ -d ${repo} ]; then 
      echo ${repo} exists so cleaning
      cd ${repo}
      git checkout . 
      cd ..
   else
      echo ${repo} does not exists
      git clone https://github.com/Syncleus/${repo}.git ${repo} 2>&1 | sed "s/^/   /"
   fi
   if [ -f patches/${repo}.patch ]; then 
      echo applying patch for ${repo}
      cd ${repo} 
      git apply ../patches/${repo}.patch 
      cd ..
   else
      echo no patch for ${repo}
   fi
done 

rm -rf build 
mkdir -p build
cd build
cmake .. 
cd ..
cmake --build build --target javac --target mandel
