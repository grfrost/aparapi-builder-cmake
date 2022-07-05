cmake_minimum_required(VERSION 3.10)
project(aparapi)
if (APPLE)
  # set(JAVA_HOME /Users/garyfrost/Library/Java/JavaVirtualMachines/openjdk-18.0.1.1/Contents/Home)
   set(JAVA_HOME /Users/grfrost/java/jdk-19.jdk/Contents/Home)
   set(JAVA_HOME /Users/grfrost/java/jdk-18.0.1.1.jdk/Contents/Home)
   set(JNI_SUBDIR darwin)
   set(OpenCL_FRAMEWORK "-framework OpenCL")
   set(LIBSUFFIX dylib)
   set(ARCH aarch64)
   set(PLAT osx)
endif ()
if (UNIX AND NOT APPLE)
   set(JAVA_HOME /usr/lib/jvm/jdk-18)
   set(JNI_SUBDIR linux)
   set(OpenCL_FRAMEWORK "OpenCL")
   set(LIBSUFFIX so)
   set(ARCH x86_64)
   set(PLAT linux)
endif ()

find_package(OpenCL REQUIRED)

set(CMAKE_CXX_STANDARD 14)
set(CXXFLAGS "-g")

include_directories(${OPENCL_INCLUDE_DIR})

file(GLOB_RECURSE JAVA_APARAPI_SRC 
	"${CMAKE_CURRENT_SOURCE_DIR}/aparapi/src/main/*.java"
   "${CMAKE_CURRENT_SOURCE_DIR}/aparapi-jni/src/main/*.java"
	"${CMAKE_CURRENT_SOURCE_DIR}/aparapi-examples/src/main/java/com/aparapi/examples/mandel/*.java"
   "${CMAKE_CURRENT_SOURCE_DIR}/aparapi-examples/src/main/java/com/aparapi/examples/life/*.java"
   "${CMAKE_CURRENT_SOURCE_DIR}/aparapi-examples/src/main/java/com/aparapi/examples/info/*.java"
   "${CMAKE_CURRENT_SOURCE_DIR}/aparapi-examples/src/main/java/com/aparapi/examples/squares/*.java"
)

file(GLOB_RECURSE CPP_SRC "${CMAKE_CURRENT_SOURCE_DIR}/aparapi-native/src/cpp/*.cpp")
list(REMOVE_ITEM CPP_SRC "${CMAKE_CURRENT_SOURCE_DIR}/aparapi-native/src/cpp/classtoolstest.cpp")
list(REMOVE_ITEM CPP_SRC "${CMAKE_CURRENT_SOURCE_DIR}/aparapi-native/src/cpp/cltest.cpp")

set(BCEL_JAR ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/bcel-6.5.0.jar)
set(APARAPI_JAR ${CMAKE_CURRENT_BINARY_DIR}/aparapi.jar)

add_custom_target(javac
   COMMAND mkdir -p ${CMAKE_CURRENT_BINARY_DIR}/classes
   COMMAND mkdir -p ${CMAKE_CURRENT_BINARY_DIR}/include
   COMMAND ${JAVA_HOME}/bin/javac  --source 11
   -h ${CMAKE_CURRENT_BINARY_DIR}/include
   -d ${CMAKE_CURRENT_BINARY_DIR}/classes
   -sourcepath ${CMAKE_CURRENT_SOURCE_DIR}/aparapi/src/main 
   -sourcepath ${CMAKE_CURRENT_SOURCE_DIR}/aparapi-jni/src/main 
   -sourcepath ${CMAKE_CURRENT_SOURCE_DIR}/aparapi-examples/src/main 
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
   COMMAND mkdir -p ${CMAKE_CURRENT_BINARY_DIR}/classes/${PLAT}
   COMMAND cp  ${CMAKE_CURRENT_BINARY_DIR}/libaparapi_${ARCH}.${LIBSUFFIX}  ${CMAKE_CURRENT_BINARY_DIR}/classes/${PLAT}
   COMMAND ${JAVA_HOME}/bin/jar
   --create 
   --file ${APARAPI_JAR}
   --no-manifest
   -C ${CMAKE_CURRENT_BINARY_DIR}/classes/ com 
   -C ${CMAKE_CURRENT_BINARY_DIR}/classes/ ${PLAT}
   DEPENDS javac aparapi_${ARCH}
)

add_custom_target(squeaky
   COMMAND rm -f ${CMAKE_CURRENT_BINARY_DIR}/aparapi.jar
   COMMAND rm -rf ${CMAKE_CURRENT_BINARY_DIR}/classes
   COMMAND rm -rf ${CMAKE_CURRENT_BINARY_DIR}/include
)

include_directories(
   ${JAVA_HOME}/include
   ${JAVA_HOME}/include/${JNI_SUBDIR}
   ${CMAKE_CURRENT_BINARY_DIR}/include
   ${CMAKE_CURRENT_SOURCE_DIR}/aparapi-native/src/cpp
   ${CMAKE_CURRENT_SOURCE_DIR}/aparapi-native/src/cpp/runKernel
   ${CMAKE_CURRENT_SOURCE_DIR}/aparapi-native/src/cpp/invoke
)

add_library(aparapi_${ARCH} SHARED
   ${CPP_SRC}
)

target_link_libraries(aparapi_${ARCH} ${JNI_LIBRARIES} ${OpenCL_FRAMEWORK})
