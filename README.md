# <center>@supermap/Vue-iEarth-Unity</center>


# 发布到WebGL端操作及相关功能

###  现支持Unity2019版本发布WebGL，支持球面场景和平面场景、图层管理、添加在线图层、三维分析功能、以及量算功能。在发布WebGl前需要完成以下准备。
1. 使用的Unity引擎安装WebGL模块。选择添加模块后，勾选WebGL Build Support，之后点击完成，等待安装模块。

图5-39 点击引擎的添加模块

图5-40 安装WebGL Build Support模块

图5-41 安装完成后的界面显示
2、安装谷歌浏览器到电脑，之后查看浏览器版本号：

图5-42 查看浏览器版本
如果版本号是86版本之后的，需要修改以下内容：找到并打开引擎目录\Editor\Data\PlaybackEngines\WebGLSupport\BuildTools\Emscripten\src下的library_pthread.js文件。之后将Atomics.wake改为Atomics.notify，如图。

图5-43 修改Atomics.wake改为Atomics.notify

图5-44 修改Atomics.wake改为Atomics.notify
如果使用版本在75-91之间的版本。需要打开浏览器，输入chrome://flags，找到WebAssembly threads support，将其设置为“enable”。
如果使用版本在92之后的版本，右键浏览器桌面快捷方式图标，点击‘属性’，在目标那一栏启动选项增加” --enable-features=SharedArrayBuffer”。完成后点击确定。


3、修改完成后，新建Unity工程，注意工程名为英文路径，打开工程后导入插件。
4、打开工程目录，找到ProjectSettings文件夹下的ProjectSettings.asset文件。

图5-45 ProjectSettings.asset文件位置
之后，找到框中指定的三行，并修改如下值：
webGLMemorySize: 1760
webGLEmscriptenArgs: -s "BINARYEN_TRAP_MODE='clamp'" 
webGLThreadsSupport: 1

图5-46 ProjectSettings.asset文件中修改位置
完成后，保存并关闭文件。
5、以SuperMapGIS预制场景作为发布场景。如果使用其它自制的场景，需要配置好相关对象和界面。可参考帮助文档的3.1和3.5章节。
选择”build Settings...”进入打包功能。

图5-48 进入打包功能
选择WebGL平台，点击“Switch Platform”

图5-49 选择平台
点击Player Settings中，在player下找到Strip Engine Code选项，取消勾选。

切换回Unity工程界面，之后点击“配置打包环境”

图5-47 配置打包环境

会在场景的对象框增加SuperMapJSObject。同时也请将SuperMap Desktop对象删除。之后保存场景。
返回到打包界面，添加发布的场景，然后点击“Build and Run”，之后会弹出选择打包目录的界面，需要在项目工程文件夹下建立一个WebGL文件夹，打包目录选择该目录。之后等待打包成功。

图5-50 点击Build And Run执行打包


图5-51 在工程文件夹新建WebGL文件夹


图5-52 打包到指定文件夹
6、打包完成后，会自动进入到Web端界面，需要复制网页地址，然后通过桌面的谷歌浏览器快捷方式打开浏览器，然后粘贴并打开链接即可。
运行后场景如下：

7、运行场景后，发现仅可以浏览场景，因此，我们提供一套js接口以及范例，实现Web端使用图层管理、分析、量算等功能。在试用期安装node.js，如果电脑上尚未安装 node.js，则需要下载并安装。范例使用操作如下：
复制文件夹：复制WebGL文件夹下的四个文件到iearth文件夹的public\unityScripts下。

打包完成后WebGL文件夹的内容

复制到iearth指定目录下
打开WebGL/Build/Unityloader.js文件，找到“alert(message)”这行代码，并注释掉。避免打开网页时候出现错误信息弹框。



之后返回到iearth文件夹，在地址栏输入cmd进入控制台，之后在控制台输入“npm run dev” 启动Web。

启动完成后，双击桌面的谷歌浏览器快捷方式，打开浏览器界面。在地址栏输入：localhost:3000。之后打开如下界面。

在工具栏我们提供了一些功能的范例。更多的功能及API接口后续会逐步增加。



# 启动项目

``` bash
# 安装依赖
npm install

# 启动服务打开 localhost:3000
npm run dev

```

### 组成:
1. Unity+三维GIS发布到Web端API  （位置：public/js_module下)

2. 根据API封装的组件库  （位置：packages下)

3. 使用组件库搭建的iEarth范例工程

- 三者是独立解耦的，可以按需分别使用。
