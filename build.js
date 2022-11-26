const project = {
    name: "barista",
    verbose: false,
    debug: true,
    cpp: {
        out: "build",
        standard: "17"
    },
    java: {
        out: "build/classes",
        classpaths: [
            "thirdparty/bcel-6.5.0.jar"
        ],
        intellij: {
            dir: "java/.idea"
        }
    },
    targets:[
         {
            name:"aparapi-cpp-lib",
            depends: ["aparapi-java-classes"],
            sources: [
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
            frameworks: ["jni", "opencl"]
        },{
            name:"cltest-cpp-app",
            sources: "aparapi-native/src/cpp/cltest.cpp",
            frameworks: ["jni", "opencl"]
        },{
            name:"cltest-cpp-run",
            exec: "build/cltest",
            depends: ["cltest-cpp-app"],
            args: []
        },{
            name:"aparapi-java-classes",
            sourcepaths: [
                "aparapi/src/main/java",
                "aparapi-jni/src/main/java",
                "aparapi-examples/src/main/java/com/aparapi/examples/mandel",
                "aparapi-examples/src/main/java/com/aparapi/examples/life"
            ],
            classpaths: [
                "thirdparty/bcel-6.5.0.jar"
            ],
            headers: "build/include"
        },{
            name:"aparapi-java-jar",
            depends: ["aparapi-java-classes", "aparapi-cpp-lib"],
            dirs: ["build/classes"],
            cp: {from: "build/libaparapi_aarch64.dylib", to: "build/classes/osx"},
            file: "build/aparapi.jar"
        },{
            name:"mandel-java-run",
            depends: ["aparapi-java-jar"],
            mainclass: "com.aparapi.examples.mandel.Main",
            classpaths: [
                "build/aparapi.jar",
                "thirdparty/bcel-6.5.0.jar"
            ],
            jvmOpts: [],
            args: []
        },{
            name:"life-java-run",
            depends: ["aparapi-java-jar"],
            mainclass: "com.aparapi.examples.life.Main",
            classpaths: [
                "build/aparapi.jar",
                "thirdparty/bcel-6.5.0.jar"
            ],
            jvmOpts: [],
            args: []
        }
    ]
}