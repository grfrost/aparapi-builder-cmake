cmake_minimum_required(VERSION 3.10)
project(aparapi)
if (APPLE)
   if (EXISTS /Users/grfrost/java/jdk-19.jdk/Contents/Home)
      set(JAVA_HOME /Users/grfrost/java/jdk-19.jdk/Contents/Home)
   elseif (EXISTS /Users/grfrost/java/jdk-19.jdk/Contents/Home)
      set(JAVA_HOME /Users/grfrost/java/jdk-19.jdk/Contents/Home)
   elseif (EXISTS /Users/grfrost/java/jdk-18.0.1.1.jdk/Contents/Home)
      set(JAVA_HOME /Users/grfrost/java/jdk-18.0.1.1.jdk/Contents/Home)
   elseif(EXISTS /Users/garyfrost/java/jdk-18.0.1.1.jdk/Contents/Home)
       set(JAVA_HOME /Users/garyfrost/java/jdk-18.0.1.1.jdk/Contents/Home)
   else()
       message("--------------")
       message("NO JAVA_HOME")
   endif()

   set(JNI_SUBDIR darwin)
   set(OpenCL_FRAMEWORK "-framework OpenCL")
   set(LIBSUFFIX dylib)
   execute_process(
      COMMAND uname -m
      RESULT_VARIABLE result
      OUTPUT_VARIABLE OSX_ARCH
      OUTPUT_STRIP_TRAILING_WHITESPACE
   )
   if (OSX_ARCH STREQUAL "arm64")
      set(ARCH aarch64)
   else()
      set(ARCH x86_64)
   endif()
   set(PLAT osx)
endif ()
if (UNIX AND NOT APPLE)
   if (EXISTS /usr/lib/jvm/jdk-18)
      set(JAVA_HOME /usr/lib/jvm/jdk-18)
   else()
       message("--------------")
       message("NO JAVA_HOME")
   endif()
   set(JNI_SUBDIR linux)
   set(OpenCL_FRAMEWORK "OpenCL")
   set(LIBSUFFIX so)
   set(ARCH x86_64)
   set(PLAT linux)
endif ()

message("JAVA_HOME=${JAVA_HOME}")
message("JNI_SUBDIR=${JNI_SUBDIR}")
message("LIBSUFFIX=${LIBSUFFIX}")
message("ARCH=${ARCH}")
message("PLAT=${PLAT}")

find_package(OpenCL REQUIRED)
include_directories(${OPENCL_INCLUDE_DIR})

set(CMAKE_CXX_STANDARD 14)
set(CXXFLAGS "-g")

set(SYNCLEUS "${CMAKE_CURRENT_SOURCE_DIR}/syncleus")
set(CLASSES "${CMAKE_CURRENT_BINARY_DIR}/classes")
set(BCEL_JAR ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/bcel-6.5.0.jar)
set(APARAPI_JAR ${CMAKE_CURRENT_BINARY_DIR}/aparapi.jar)
set(GENERATED_INCLUDE  ${CMAKE_CURRENT_BINARY_DIR}/include)


file(GLOB_RECURSE JAVA_APARAPI_SRC 
   "${SYNCLEUS}/aparapi/src/main/*.java"
   "${SYNCLEUS}/aparapi-jni/src/main/*.java"
   "${SYNCLEUS}/aparapi-examples/src/main/java/com/aparapi/examples/mandel/*.java"
   "${SYNCLEUS}/aparapi-examples/src/main/java/com/aparapi/examples/life/*.java"
   "${SYNCLEUS}/aparapi-examples/src/main/java/com/aparapi/examples/info/*.java"
   "${SYNCLEUS}/aparapi-examples/src/main/java/com/aparapi/examples/squares/*.java"
)

file(GLOB_RECURSE CPP_SRC "${SYNCLEUS}/aparapi-native/src/cpp/*.cpp")
list(REMOVE_ITEM CPP_SRC "${SYNCLEUS}/aparapi-native/src/cpp/classtoolstest.cpp")
list(REMOVE_ITEM CPP_SRC "${SYNCLEUS}/aparapi-native/src/cpp/cltest.cpp")


add_custom_target(javac 
   COMMAND mkdir -p ${GENERATED_INCLUDE}
   COMMAND mkdir -p ${CLASSES}
   COMMAND ${JAVA_HOME}/bin/javac  --source 11 -g
   -h ${GENERATED_INCLUDE}
   -d ${CLASSES}
   -sourcepath "${SYNCLEUS}/aparapi/src/main" 
   -sourcepath "${SYNCLEUS}/aparapi-jni/src/main" 
   -sourcepath "${SYNCLEUS}/aparapi-examples/src/main" 
   -classpath ${BCEL_JAR}
   ${JAVA_APARAPI_SRC}
)

add_custom_target(life 
   COMMAND ${JAVA_HOME}/bin/java -classpath ${APARAPI_JAR}:${BCEL_JAR} com.aparapi.examples.life.Main
   DEPENDS javac aparapi_${ARCH} jar
)

add_custom_target(mandel 
   COMMAND ${JAVA_HOME}/bin/java -classpath ${APARAPI_JAR}:${BCEL_JAR} com.aparapi.examples.mandel.Main
   DEPENDS javac aparapi_${ARCH} jar
)

add_custom_target(squares 
   COMMAND ${JAVA_HOME}/bin/java -classpath ${APARAPI_JAR}:${BCEL_JAR} com.aparapi.examples.squares.Main
   DEPENDS javac aparapi_${ARCH} jar
   )

add_custom_target(info 
   COMMAND ${JAVA_HOME}/bin/java -classpath ${APARAPI_JAR}:${BCEL_JAR} com.aparapi.examples.info.Main
   DEPENDS javac aparapi_${ARCH} jar
   )

add_custom_target(jar
   COMMAND mkdir -p ${CLASSES}/${PLAT}
   COMMAND cp  ${CMAKE_CURRENT_BINARY_DIR}/libaparapi_${ARCH}.${LIBSUFFIX}  ${CLASSES}/${PLAT}
   COMMAND ${JAVA_HOME}/bin/jar
   --create 
   --file ${APARAPI_JAR}
   --no-manifest
   -C ${CLASSES}/ com 
   -C ${CLASSES}/ ${PLAT}
   DEPENDS javac aparapi_${ARCH}
)

add_custom_target(squeaky
   COMMAND rm -rf ${APARAPI_JAR} ${CLASSSES} ${GENERATED_INCLUDE}
)

include_directories(
   ${JAVA_HOME}/include
   ${JAVA_HOME}/include/${JNI_SUBDIR}
   ${GENERATED_INCLUDE}
   ${SYNCLEUS}/aparapi-native/src/cpp
   ${SYNCLEUS}/aparapi-native/src/cpp/runKernel
   ${SYNCLEUS}/aparapi-native/src/cpp/invoke
)

add_library(aparapi_${ARCH} SHARED
   ${CPP_SRC}
)

target_link_libraries(aparapi_${ARCH} ${JNI_LIBRARIES} ${OpenCL_FRAMEWORK})
