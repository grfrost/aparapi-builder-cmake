const project = {
   name: "barista",
   verbose: false,
   debug: true,
   cpp: {
      out: "build",
      standard: "17",
      libs: {
         aparapi_aarch64: {
            sources:[
               "aparapi-native/src/cpp/classtoolstest.cpp",
               "aparapi-native/src/cpp/JNIExceptions.cpp",
               "aparapi-native/src/cpp/invoke/OpenCLArgDescriptor.cpp",
               "aparapi-native/src/cpp/invoke/OpenCLMem.cpp",
               "aparapi-native/src/cpp/invoke/OpenCLJNI.cpp",
               "aparapi-native/src/cpp/runKernel/KernelArg.cpp",
               "aparapi-native/src/cpp/runKernel/Range.cpp",
               "aparapi-native/src/cpp/runKernel/AparapiBuffer.cpp",
               "aparapi-native/src/cpp/runKernel/ArrayBuffer.cpp",
               "aparapi-native/src/cpp/runKernel/Aparapi.cpp",
               "aparapi-native/src/cpp/runKernel/ProfileInfo.cpp",
               "aparapi-native/src/cpp/runKernel/Config.cpp",
               "aparapi-native/src/cpp/runKernel/JNIContext.cpp",
               "aparapi-native/src/cpp/CLHelper.cpp",
               "aparapi-native/src/cpp/JNIHelper.cpp",
               "aparapi-native/src/cpp/agent.cpp"
            ],
            includes: [
		    "build/include",
                    "aparapi-native/src/cpp",
                    "aparapi-native/src/cpp/runKernel",
                    "aparapi-native/src/cpp/invoke"
	    ],
            frameworks:["jni", "opencl"],
            depends: ["aparapi"]
         }
      },
      apps: {
         cltest: {
            sources: "aparapi-native/src/cpp/cltest.cpp",
            frameworks: ["jni","opencl"]
         }
      }

   },
   java: {
      out: "build/classes",
      intellij: {
         dir: "java/.idea"
      },
      jars: {
         aparapi: {
            sourcepaths: [
               "aparapi/src/main",
               "aparapi-jni/src/main",
               "aparapi-examples/src/main"
            ],
            headers: "build/include",
            jar: "build/aparapi.jar"
         }
      }
   }
}
