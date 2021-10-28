﻿//==========================================================================
// SuperMap Realspace 客户端程序，版权所有，北京超图软件股份有限公司，2000-2009。
// 本程序只能在有效的授权许可下使用。未经许可，不得以任何手段擅自使用或传播。
// 作者：			SuperMap WebClient Team
// 修改：
// 文件名：			SuperMap.Web.UI.Controls.SceneControl.js
// 最后修改时间：
//==========================================================================
Type.registerNamespace('SuperMap.Web.UI.Controls');

/// <param name="container" type="" domElement="true"> </param>
SuperMap.Web.UI.Controls.SceneControl = function(container, initCallBack, failedCallBack) {

    /// <summary>ActiveX控件</summary>
    ///<param name="container" type="" domElement="true">Dom元素</param>
    ///<param name="initCallBack" type="Function">初始化成功回调函数</param>
    ///<param name="failedCallBack" type="Function">初始化失败回调函数</param>
    ///<returns type="SuperMap.Web.UI.Controls.SceneControl">返回三维控件对象</returns>


    //初始化SceneControl为全局变量
    //SuperMap.Web.Realspace.Utility._SceneControl = this;

    SuperMap.Web.UI.Controls.SceneControl.initializeBase(this, [container]);

    this._id = container.id;
    this._container = container;
    this.preH = container.clientHeight;
    this.preW = container.clientWidth;

    this._initCallBack = initCallBack;
    this._failedCallBack = failedCallBack;

    //脚本层Scene
    this._scene = null;

    //脚本层的Action
    this._sceneAction = null;

    //场景服务列表对象
    this._sceneServicesList = null;

    //图层服务列表对象
    this._layer3DServicesList = null;


    this._currentAsyncHelper = null;

    //将初始化的工作抽取出来
    this._initialize();
    this._scene = new SuperMap.Web.Realspace.Scene(this);
};

SuperMap.Web.UI.Controls.SceneControl.prototype = {

    /*
    *	初始化SceneControl类
    */

    _initialize : function() {
        /// <returns type="void"> </returns>
        // try {
        //     this._innerSceneCtrl = document.createElement("object");
        //     this._innerSceneCtrl.id = "SuperMapRealspace";
        //     this._innerSceneCtrl.name = "SuperMapRealspace";
        //     this._innerSceneCtrl.width = "100%";
        //     this._innerSceneCtrl.height = "100%";
        //     this._innerSceneCtrl.BorderStyle = 0;
        //     this._IsInitialized = false;
        // }
        // catch(e) {
        //     throw e;
        // }

        // if(typeof SuperMap.Web.Realspace.Utility._SceneControlMap === "undefined") {
        //     SuperMap.Web.Realspace.Utility._SceneControlMap = [];
        // }
        // SuperMap.Web.Realspace.Utility._SceneControlMap.push({
        //     id : this._innerSceneCtrl.Identifier,
        //     sceneCtrl : this
        // });
        // //先绑定初始化完成事件，其他事件等初始化完之后再绑定
        // var sceneInitializedHandler = this._sceneInitialized;
        // this.addExploreEvent(this._innerSceneCtrl, 'SceneInitialized', function (identifier) {
        //   for(var i = 0; i < SuperMap.Web.Realspace.Utility._SceneControlMap.length; i++) {
        //       if(identifier === SuperMap.Web.Realspace.Utility._SceneControlMap[i].id) {
        //           return sceneInitializedHandler(SuperMap.Web.Realspace.Utility._SceneControlMap[i].sceneCtrl);
        //       }
        //   }
        // });
        // this.addEvent("sceneInitialized", this._initCallBack);

        // //绑定初始化失败事件
        // var sceneInitializeFailedHandler = this._sceneInitializeFailed;
        // this.addExploreEvent(this._innerSceneCtrl, 'SceneInitializeFailed', function (identifier) {
        //     if(identifier === SuperMap.Web.Realspace.Utility._SceneControlMap[i].id) {
        //         return sceneInitializeFailedHandler(SuperMap.Web.Realspace.Utility._SceneControlMap[i].sceneCtrl);
        //     }
        // });
        // this.addEvent("sceneInitializeFailed", this._failedCallBack);

        // //绑定其他事件
        // this._attachEvent();
       
    },

    count : function () {

        for(var i = 0; i < SuperMap.Web.Realspace.Utility._SceneControlMap.length; i++) {

            var sceneControl = SuperMap.Web.Realspace.Utility._SceneControlMap[i].sceneCtrl;

            if (!sceneControl._IsInitialized) {

                sceneControl._raiseEvent("sceneInitialized", sceneControl._initCallBack);
            }
			window.clearInterval(sceneControl.clock);
        }

    },
    /**
    *释放资源
    */
    dispose : function() {
        /// <returns type="void"> </returns>
        this._innerSceneCtrl = null;
        this._container = null;
        this._initCallBack = null;
        this._failedCallBack = null;

    },


    /*
    * 设置当前所使用的异步助手
    */
    get_asyncHelper : function() {

        if(this._currentAsyncHelper === null) {
           this._currentAsyncHelper = new SuperMap.Web.Realspace.AsyncHelper(this);
        }
        return this._currentAsyncHelper;
    },


    /**
    *Scene对象
    */
    get_scene : function() {
        /// <value type="SuperMap.Web.Realspace.Scene"> </value>
        if(this._scene === null) {
            this._scene = new SuperMap.Web.Realspace.Scene(this);
        }
        return this._scene;
    },

    /*
    * SceneAction对象,这是纯脚本对象，com层没有对应的对象。
    */
    get_sceneAction : function() {
        ///<value type="SuperMap.Web.UI.Action3Ds.SceneAction"></value>
        return this._sceneAction;
    },

    set_sceneAction : function(sceneAction) {
        if(!SuperMap.Web.UI.Action3Ds.SceneAction.isInstanceOfType(sceneAction)) {
            return;
        }

        this._sceneAction = sceneAction;
        var type =  sceneAction.get_type();
        var cmd = {
            Func : "SetSceneAction",
            arguments : {
                type : type
            },
            classNumber : SuperMap.Web.Realspace.ClassNumber.SCENECONTROL
        }

        var sceneControl = this;
        var insertFunction = function(data) {
            var obj = data.detail;
            if (typeof obj.Result !== "undefined") {
                if (type === 0) {
                    sceneControl._raiseEvent("measureDistanceFinished", obj.Result);
                } else if (type === 2) {
                    sceneControl._raiseEvent("measureAreaFinished", obj.Result);
                } else if (type === 3) {
                    sceneControl._raiseEvent("measureHeightFinished", obj.Result);
                }
                window.removeEventListener("event" + SuperMap.Web.Realspace.ClassNumber.SCENECONTROL, insertFunction);
            }
        };
        window.addEventListener("event" + SuperMap.Web.Realspace.ClassNumber.SCENECONTROL, insertFunction);

        unityInstance.SendMessage('SuperMapJSObject', 'JSFunction', JSON.stringify(cmd));
    },


    /*
    * 场景服务列表对象
    */
    get_sceneServicesList : function() {
        ///<value type="SuperMap.Web.Realspace.SceneServicesList"></value>
        if(this._sceneServicesList === null) {
            this._sceneServicesList = new SuperMap.Web.Realspace.SceneServicesList(this);
        }
        return this._sceneServicesList;
    },


    /*
    * 图层服务列表对象
    */
    get_layer3DServicesList : function() {
        ///<value type="SuperMap.Web.Realspace.Layer3DServicesList"></value>
        if(this._layer3DServicesList === null) {
            this._layer3DServicesList = new SuperMap.Web.Realspace.Layer3DServicesList(this);
        }
        return this._layer3DServicesList;
    },


  	/**
  	*获得场景气泡列表
  	*/
  	// get_bubbles : function() {
  	//     ///<returns type="SuperMap.Web.Realspace.Bubbles"></returns>
  	//     if(this._Bubbles == null) {
  	//         this._Bubbles = new SuperMap.Web.Realspace.Bubbles(this);
  	//     }
  	//     return this._Bubbles;
  	// },

    /**
    *获取/设置顶点捕捉模式
    */
    get_snapMode : function() {
        ///<returns type="SuperMap.Web.Realspace.SnapMode"></returns>
        if(this._innerSceneCtrl !== null) {
            var cmd = {
                func : "GetSnapMode",
                needResult : true
            }

            return Number(JSON.parse(this.returnDefaultString(this._innerSceneCtrl.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENECONTROL), "number")));
        }
    },

    set_snapMode : function(snapMode) {
        ///<params name="snapMode" type="SuperMap.Web.Realspace.SnapMode"></params>
        if(this._innerSceneCtrl !== null) {
            var cmd = {
                func : "SetSnapMode",
                needResult : false,
                arguments : {
                    snapMode : snapMode
                }
            }

            this._innerSceneCtrl.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENECONTROL);
        }
    },


   	/*
   	*FPS
  	*/
    // get_isFPSVisible : function() {
    //     ///<value type="Boolean">返回是否始终更新数据</value>
	//       if(this._innerSceneCtrl !== null) {
    //         var cmd = {
    //             func : "GetIsFPSVisible",
    //             needResult : true
    //         }

    //         return (JSON.parse(this.returnDefaultString(this._innerSceneCtrl.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENECONTROL), "boolean")) === "true");
	//       }
    // },

    // set_isFPSVisible : function(isFPSVisible) {
  	//     if(this._innerSceneCtrl != null && typeof (isFPSVisible) === "boolean") {
    //         var cmd = {
    //             func : "SetIsFPSVisible",
    //             needResult : false,
    //             arguments : {
    //                 isFPSVisible : isFPSVisible
    //             }
    //         }

    //         this._innerSceneCtrl.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENECONTROL);
	//       }
    // },

    /*
    * 二维像素点转换为三维点
    */
    // pixelToGlobe : function(point, pixelToGlobeMode) {
    //     ///<param name="point" type="SuperMap.Web.Core.Point"></param>
    //     ///<returns type="SuperMap.Web.Core.Point3D"></returns>
	// 	    if(!SuperMap.Pixel.isInstanceOfType(point)) {
	// 			    return null;
	// 	    }

	// 	    if(typeof pixelToGlobeMode === "undefined"){
    //         var cmd = {
    //             func : "PixelToGlobe",
    //             needResult : true,
    //             arguments : {
    //                 point : {
    //                     x : point.x,
    //                     y : point.y
    //                 },
    //                 pixelToGlobeMode : SuperMap.Web.Realspace.PixelToGlobeMode.Terrain
    //             }
    //         }

    //         var object = JSON.parse(this.returnDefaultString(this._innerSceneCtrl.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENECONTROL), "object"));

	// 		      return new SuperMap.Web.Core.Point3D(object.x, object.y, object.z);
	// 	    }else {
    //         var cmd = {
    //             func : "PixelToGlobe",
    //             needResult : true,
    //             arguments : {
    //                 point : {
    //                     x : point.x,
    //                     y : point.y
    //                 },
    //                 pixelToGlobeMode : pixelToGlobeMode
    //             }
    //         }

    //         var object = JSON.parse(this.returnDefaultString(this._innerSceneCtrl.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENECONTROL), "object"));

	// 		      return new SuperMap.Web.Core.Point3D(object.x, object.y, object.z);
	// 	    }
    // },

    /*
    * 三维像素点转换为二维点
    */
    // globeToPixel : function(point3d) {
    //     ///<param name="point" type="SuperMap.Web.Core.Point3D"></param>
    //     ///<returns type="SuperMap.Web.Core.Point"></returns>

    //     if(!SuperMap.Web.Core.Point3D.isInstanceOfType(point3d)) {
    //         return null;
    //     }

    //     var cmd = {
    //         func : "GlobeToPixel",
    //         needResult : true,
    //         arguments : {
    //             point : {
    //                 x : point3d.x,
    //                 y : point3d.y,
    //                 z : point3d.z
    //             }
    //         }
    //     }

    //     var object = JSON.parse(this.returnDefaultString(this._innerSceneCtrl.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENECONTROL), "object"));

    //     return new SuperMap.LonLat(object.x, object.y);
    // },

    //响应mouseDown事件
    _mouseDown : function(x, y, button, sceneControl) {

        var e = new SuperMap.Web.Realspace.EventObject();
        e._set_clientX(x);
        e._set_clientY(y);
        e._set_flagType(button);

        if(sceneControl._sceneAction && sceneControl._sceneAction.onMouseDown) {
            sceneControl._sceneAction.onMouseDown(e);
        }
    },

    //响应mouseUp事件
    _mouseUp : function(x, y, button, sceneControl) {
        var e = new SuperMap.Web.Realspace.EventObject();
        e._set_clientX(x);
        e._set_clientY(y);
        e._set_flagType(button);

        if(sceneControl._sceneAction && sceneControl._sceneAction.onMouseUp) {
            sceneControl._sceneAction.onMouseUp(e);
        }
    },

    //响应mouseWheel事件
    _mouseWheel : function(x, y, zDelta, button, sceneControl) {
        var e = new SuperMap.Web.Realspace.EventObject();
        e._set_clientX(x);
        e._set_clientY(y);
        e._set_flagType(button);

        if(sceneControl._sceneAction && sceneControl._sceneAction.onMouseWheel) {
            sceneControl._sceneAction.onMouseWheel(e);
        }
    },

    //响应Click事件，这里将底层的onLButtonUp事件转化为脚本层的onClick事件
    _click : function(x, y, button, sceneControl) {
        var e = new SuperMap.Web.Realspace.EventObject();
        e._set_clientX(x);
        e._set_clientY(y);
        e._set_flagType(button);

        if(sceneControl._sceneAction && sceneControl._sceneAction.onClick) {
            sceneControl._sceneAction.onClick(e);
        }
    },

    //响应dbClick事件
    _dbClick : function(x, y, button, sceneControl) {
        var e = new SuperMap.Web.Realspace.EventObject();
        e._set_clientX(x);
        e._set_clientY(y);
        e._set_flagType(button);

        if(sceneControl._sceneAction && sceneControl._sceneAction.onDbClick) {
            sceneControl._sceneAction.onDbClick(e);
        }
    },

    //响应mouseOver事件
    _mouseOver : function(x, y, button, sceneControl) {
        var e = new SuperMap.Web.Realspace.EventObject();
        e._set_clientX(x);
        e._set_clientY(y);
        e._set_flagType(button);

        if(sceneControl._sceneAction && sceneControl._sceneAction.onMouseOver) {
            sceneControl._sceneAction.onMouseOver(e);
        }
    },

    //响应mouseMove事件
    _mouseMove : function(x, y, button, sceneControl) {
        var e = new SuperMap.Web.Realspace.EventObject();
        e._set_clientX(x);
        e._set_clientY(y);
        e._set_flagType(button);

        if(sceneControl._sceneAction && sceneControl._sceneAction.onMouseMove) {
            if(x === this.prex && y === this.prey) {
                return
            }
            sceneControl._sceneAction.onMouseMove(e);

            this.prex = x;
            this.prey = y;
        }
    },


  	_keyDown : function(button, sceneControl) {

        var e = new SuperMap.Web.Realspace.EventObject();
        e._set_clientX(0);
        e._set_clientY(0);
        e._set_flagType(button);

        if (sceneControl._sceneAction && sceneControl._sceneAction.onKeyDown) {
            sceneControl._sceneAction.onKeyDown(e);
        }
    },

  	_keyUp : function(button, sceneControl) {

        var e = new SuperMap.Web.Realspace.EventObject();
        e._set_clientX(0);
        e._set_clientY(0);
        e._set_flagType(button);

        if (sceneControl._sceneAction && sceneControl._sceneAction.onKeyUp) {
            sceneControl._sceneAction.onKeyUp(e);
        }
      },

    //响应objectSelected事件
    _objectSelected : function(nSelectedCount, str, sceneControl) {

        //var selection3Ds = SuperMap.Web.Realspace.Utility._SceneControl.get_scene().findSelection3Ds(true);

        var layer = sceneControl.get_scene().get_layer3Ds().get_item(str);
        var selection3Ds = new SuperMap.Web.Realspace.Selection3D({
            ids : [nSelectedCount]
        }, layer);
        //selection3Ds是选择集的数组
        sceneControl._raiseEvent("objectSelected", [selection3Ds]);

    },

    //响应focusChanged事件
    _focusChanged : function (sceneControl) {
        SuperMap.Web.Realspace.Utility._SceneControl = sceneControl;
    },

    //响应measureDistance事件
    _measureDistance : function(dCurrentDis, dTotalDis, srLine3D, sceneControl) {
        var dDisArray = [dCurrentDis, dTotalDis];
        if(typeof id === "number") {
            //var object = sceneControl.get_geometryInfo(id);
            //var point = new SuperMap.Web.Core.Point3D(object.x, object.y, object.z);
            sceneControl._raiseEvent("measureDistance", dDisArray);
        } else{
            sceneControl._raiseEvent("measureDistance", dDisArray);
        }
    },

    //响应measureArea事件
    _measureArea : function(dArea, id, sceneControl) {
        if(typeof id === "number") {
            //var object = this.get_geometryInfo(id);
            //var point = new SuperMap.Web.Core.Point3D(object.x, object.y, object.z);
            sceneControl._raiseEvent("measureArea", dArea);
        }else {
            sceneControl._raiseEvent("measureArea", dArea);
        }
    },

    //响应measureHeight事件
    _measureHeight : function(dHeight, id, sceneControl) {
        if(typeof id === "number") {
            // var object = sceneControl.get_geometryInfo(id);
            // var point = new SuperMap.Web.Core.Point3D(object.x, object.y, object.z);
            sceneControl._raiseEvent("measureHeight", dHeight);
        } else{
            sceneControl._raiseEvent("measureHeight", dHeight);
        }
    },

    //响应measureDistanceFinished事件
    _measureDistanceFinished : function(dTotalDis, id, sceneControl) {
        //显示量算范围
        if(typeof id === "number") {
            var object = sceneControl.get_geometryInfo(id);
            var point = new SuperMap.Web.Core.Point3D(object.x, object.y, object.z);
            point.geometryId = id;
            point.get_partCount = function() {
                return 1
            }
            point.getPart = function() {
                return {
                    get_count : function() {
                        return 1;
                    },
                    get_item : function() {
                        return point;
                    }
                }
            }
            sceneControl._raiseEvent("measureDistanceFinished", dTotalDis, point);
        } else{
            sceneControl._raiseEvent("measureDistanceFinished", dTotalDis);
        }
    },

    //响应measureAreaFinished事件
    _measureAreaFinished : function(dArea, id, sceneControl) {
        //添加挖方区域
        //显示量算范围
        if(typeof id === "number") {
            var object = sceneControl.get_geometryInfo(id);
            var point = new SuperMap.Web.Core.Point3D(object.x, object.y, object.z);
            point.geometryId = id;

            point.get_partCount = function() {
                return 1
            }
            point.getPart = function() {
                return {
                    get_count : function() {
                        return 1;
                    },
                    get_item : function() {
                        return point;
                    }
                }
            }
            point.get_innerPoint3D = function() {
                return point;
            }
            sceneControl._raiseEvent("addExcavationRegion", point);
            sceneControl._raiseEvent("measureAreaFinished", dArea, point);
        } else{
            sceneControl._raiseEvent("measureAreaFinished", dArea);
        }
    },

    //响应measureHeightFinished事件
    _measureHeightFinished : function(dHeight, id, sceneControl) {
        //显示量算范围
        if(typeof id === "number") {
            var object = sceneControl.get_geometryInfo(id);
            var point = new SuperMap.Web.Core.Point3D(object.x, object.y, object.z);
			      point.geometryId = id;
            point.get_partCount = function() {
                return 1
            }
            point.getPart = function() {
                return {
                    get_count : function() {
                        return 1;
                    },
                    get_item : function() {
                        return point;
                    }
                }
            }
            sceneControl._raiseEvent("measureHeightFinished", dHeight, point);
        } else{
            sceneControl._raiseEvent("measureHeightFinished", dHeight);
        }
    },


    ///响应sceneInitialized事件，等该事件响应后才能加载数据
    _sceneInitialized : function(sceneControl) {

		sceneControl.set_sceneAction(new SuperMap.Web.UI.Action3Ds.PanSelect(sceneControl));

        //绑定其他事件
        sceneControl._attachEvent();
        //抛出“sceneInitialized”事件
        sceneControl._raiseEvent("sceneInitialized");
        sceneControl._IsInitialized = true;
    },

    ///响应sceneInitializeFailed事件
    _sceneInitializeFailed : function(sceneControl) {

        sceneControl._raiseEvent("sceneInitializeFailed");
    },

    ///响应飞行开始事件，保留接口
    _flownStart : function(nflyoperator, sceneControl) {
        var e = new SuperMap.Web.Realspace.EventObject();
        e._set_camera(sceneControl.get_scene().get_camera());

        sceneControl._raiseEvent("flownStart", e, nflyoperator);
    },

    ///响应飞行结束事件
    _flownEnd : function(sceneControl) {
        var e = new SuperMap.Web.Realspace.EventObject();
        e._set_camera(sceneControl.get_scene().get_camera());

        sceneControl._raiseEvent("flownEnd", e);
    },

    ///响应飞行浏览事件，保留接口
    _flownTour : function(sceneControl) {
        sceneControl._raiseEvent("flownTour");
    },

    _modelFetchedHandler : function(modelId, sceneControl) {
        if(sceneControl.get_asyncHelper()) {
            sceneControl.get_asyncHelper()._asyncFetchModelFinished(modelId, sceneControl);
        }
    },

    _pictureFetchedHandler : function(picId, sceneControl) {
        if(sceneControl.get_asyncHelper()) {
            sceneControl.get_asyncHelper()._asyncFetchPicture3DFinished(picId, sceneControl);
        }
    },

    _layer3DFetchedHandler : function(object, sceneControl) {
        if(sceneControl.get_asyncHelper()) {
            sceneControl.get_asyncHelper()._asyncFetchLayer3DFinished(object, sceneControl);
        }
    },

    ///响应气泡位置变化事件
    _bubbleEvent : function(nEventType, id, sceneControl) {

        var e = new SuperMap.Web.Realspace.Bubble({id:id});
    		switch(nEventType) {
        	  case 0:
        			sceneControl._raiseEvent("bubbleInitialize", e);
        			break;
        		case 1:
        			sceneControl._raiseEvent("bubbleResize", e);
        			break;
        		case 2:
        			sceneControl._raiseEvent("bubbleClose", e);
        			break;
        }
    },

    //响应frameStarted事件
	  _frameStarted : function(sceneControl) {
	      sceneControl._raiseEvent("frameStarted");
	  },

    //响应frameEnded事件
	  _frameEnded : function(sceneControl) {
	      sceneControl._raiseEvent("frameEnded");
	  },

    //编辑结束事件
    _geometryModified : function (nGeometryID, layerName, sceneControl) {
  	    var layer3D = sceneControl.get_scene().get_layer3Ds().get_item(layerName);

  	    if (layer3D == null) {
  	        layer3D = sceneControl.get_scene().get_trackingLayer3D();
  	    }
  	    sceneControl._raiseEvent("geometryModified", nGeometryID, layer3D);
    },

    //绑定控件事件，并转化为脚本事件
    _attachEvent : function() {
        // 考虑用全局的代替
        var sceneControl = this;

		// var keyDownHandler = this._keyDown;
		// this.addExploreEvent(this._innerSceneCtrl, 'KeyDown', function(button) { return keyDownHandler(button, sceneControl); });

		// var keyUpHandler = this._keyUp;
    	// this.addExploreEvent(this._innerSceneCtrl, 'KeyUp', function(button) { return keyUpHandler(button, sceneControl); });

        // var downHandler = this._mouseDown;
		// this.addExploreEvent(this._innerSceneCtrl, 'LButtonDown', function(x, y, button) {  return downHandler(x, y, SuperMap.Web.Realspace.FlagType.LBUTTON, sceneControl); });
		// this.addExploreEvent(this._innerSceneCtrl, 'MButtonDown', function(x, y, button) {  return downHandler(x, y, SuperMap.Web.Realspace.FlagType.MBUTTON, sceneControl); });
		// this.addExploreEvent(this._innerSceneCtrl, 'RButtonDown', function(x, y, button) {  return downHandler(x, y, SuperMap.Web.Realspace.FlagType.RBUTTON, sceneControl); });

        // var upHandler = this._mouseUp;
    	// this.addExploreEvent(this._innerSceneCtrl, 'MButtonUp', function(x, y, button) {  return upHandler(x, y, SuperMap.Web.Realspace.FlagType.MBUTTON, sceneControl); });
    	// this.addExploreEvent(this._innerSceneCtrl, 'RButtonUp', function(x, y, button) {  return upHandler(x, y, SuperMap.Web.Realspace.FlagType.RBUTTON, sceneControl); });
    	// this.addExploreEvent(this._innerSceneCtrl, 'LButtonUp', function(x, y, button) {  return upHandler(x, y, SuperMap.Web.Realspace.FlagType.LBUTTON, sceneControl); });

        // var wheelHandler = this._mouseWheel;
		// this.addExploreEvent(this._innerSceneCtrl, 'MouseWheel', function(x, y, zDelta, button) {  return wheelHandler(x, y, zDelta, SuperMap.Web.Realspace.FlagType.WHEEL, sceneControl); });

        // var dbClickHandler = this._dbClick;
    	// this.addExploreEvent(this._innerSceneCtrl, 'LButtonDblClick', function(x, y, button) {  return dbClickHandler(x, y, SuperMap.Web.Realspace.FlagType.LBUTTON, sceneControl); });
    	// this.addExploreEvent(this._innerSceneCtrl, 'RButtonDblClick', function(x, y, button) {  return dbClickHandler(x, y, SuperMap.Web.Realspace.FlagType.RBUTTON, sceneControl); });

        // var overHandler = this._mouseOver;
		// this.addExploreEvent(this._innerSceneCtrl, 'MouseHover', function(x, y, button) {  return overHandler(x, y, 0, sceneControl); });

        // var moveHandler = this._mouseMove;
    	// this.addExploreEvent(this._innerSceneCtrl, 'MouseMove', function(x, y) {return moveHandler(x, y, 0, sceneControl); });

    	// var focusChangedHandler = this._focusChanged;
    	// this.addExploreEvent(this._innerSceneCtrl, 'FocusChanged', function () { return focusChangedHandler(sceneControl); });

        var selectHandler = this._objectSelected;
		this.addExploreEvent(this._innerSceneCtrl, 'ObjectSelected', function(nSelectedCount ,str) { return selectHandler(nSelectedCount,str, sceneControl); });

        var measureDisHandler = this._measureDistance;
		this.addExploreEvent(this._innerSceneCtrl, 'MeasureDistance', function(dCurrentDis, dTotalDis, srLine3D) { return measureDisHandler(dCurrentDis, dTotalDis, srLine3D, sceneControl); });

        var measureAreaHandler = this._measureArea;
		this.addExploreEvent(this._innerSceneCtrl, 'MeasureArea', function(dArea, srRegion3D) { return measureAreaHandler(dArea, srRegion3D, sceneControl); });

        var measureHeightHandler = this._measureHeight;
		this.addExploreEvent(this._innerSceneCtrl, 'MeasureHeight', function(dHeight, srLine3D) { return measureHeightHandler(dHeight, srLine3D, sceneControl); });

        var measureDisFinishedHandler = this._measureDistanceFinished;
		this.addExploreEvent(this._innerSceneCtrl, 'MeasureDistanceFinished', function(dTotalDis, srLine3D) { return measureDisFinishedHandler(dTotalDis, srLine3D, sceneControl); });

        var measureAreaFinishedHandler = this._measureAreaFinished;
		this.addExploreEvent(this._innerSceneCtrl, 'MeasureAreaFinished', function(dArea, srRegion3D) { return measureAreaFinishedHandler(dArea, srRegion3D, sceneControl); });

        var measureHeightFinishedHandler = this._measureHeightFinished;
		this.addExploreEvent(this._innerSceneCtrl, 'MeasureHeightFinished', function(dHeight, srLine3D) { return measureHeightFinishedHandler(dHeight, srLine3D, sceneControl); });

        // var flownStartHandler = this._flownStart;
		// this.addExploreEvent(this._innerSceneCtrl, 'FlownStart',function(nflyoperator) { return flownStartHandler(nflyoperator, sceneControl);  });

        // var flownEndHandler = this._flownEnd;
		// this.addExploreEvent(this._innerSceneCtrl, 'FlownEnd',function() { return flownEndHandler(sceneControl);  });

        // var flownTourHandler = this._flownTour;
		// this.addExploreEvent(this._innerSceneCtrl, 'FlownTour',function() { return flownTourHandler(sceneControl);  });

        // var modelFetchedHandler = this._modelFetchedHandler;
		// this.addExploreEvent(this._innerSceneCtrl, 'FetchModelFinished',function(modelId) { return modelFetchedHandler(modelId, sceneControl);  });

        // var pictureFetchedHandler = this._pictureFetchedHandler;
		// this.addExploreEvent(this._innerSceneCtrl, 'FetchPicture3DFinished',function(picId) { return pictureFetchedHandler(picId, sceneControl);  });

        // var layer3DFetchedHandler = this._layer3DFetchedHandler;
    	// this.addExploreEvent(this._innerSceneCtrl, 'FetchLayer3DFinished',function(object) { return layer3DFetchedHandler(object, sceneControl);  });

    	// var bubbleEventHandler = this._bubbleEvent;
    	// this.addExploreEvent(this._innerSceneCtrl, 'BubbleEvent',function(nEventType, id) { return bubbleEventHandler(nEventType, id, sceneControl); });

    	// var frameStartedHandler = this._frameStarted;
    	// this.addExploreEvent(this._innerSceneCtrl, 'FrameStarted', function () { return frameStartedHandler(sceneControl); });

    	// var frameEndedHandler = this._frameEnded;
    	// this.addExploreEvent(this._innerSceneCtrl, 'FrameEnded', function () { return frameEndedHandler(sceneControl); });

    	// var geometryModifiedHandler = this._geometryModified;
    	// this.addExploreEvent(this._innerSceneCtrl, 'GeometryModified', function (nGeometryID, layerName) { return geometryModifiedHandler(nGeometryID, layerName, sceneControl); });
    },

    addExploreEvent : function(obj, name, func) {
        if(window.attachEvent) {
            obj.attachEvent("on"+name, func);
        } else{
            obj.addEventListener(name, func, false);
        }
    },

    //添加事件
    addEvent : function(eventName, handler) {
        ///<param name="eventName" type="String"></param>
        ///<param name="handler" type="Object"></param>
        ///<returns type="Boolean" ></returns>
        this.get_events().addHandler(eventName, handler);
    },

	  //删除事件
    removeEvent : function(eventName, handler) {
        ///<param name="eventName" type="String"></param>
        ///<param name="handler" type="Object"></param>
        ///<returns type="Boolean" ></returns>
        this.get_events().removeHandler(eventName, handler);
    },

    //触发绑定事件，不对外开放
    _raiseEvent : function(eventName, arguments, userContext) {
        var handler = this.get_events().getHandler(eventName);
        if(handler) {
            handler(arguments, userContext);
        }
    },

    // 组装EventObject对象
    _getEventObject : function(x, y, button, sceneControl, zDelta) {
        var pnt = new SuperMap.Pixel(x, y);
        var pnt3D = sceneControl.pixelToGlobe(pnt);

        var e = new SuperMap.Web.Realspace.EventObject();
        e._set_clientX(x);
        e._set_clientY(y);
        e._set_longitude(pnt3D.x);
        e._set_latitude(pnt3D.y);
        e._set_altitude(pnt3D.z);
        e._set_camera(sceneControl.get_scene().get_camera());
        e._set_flagType(button);

        if(zDelta) {
            e._set_zDelta(zDelta);
        }
        return e;
    },

    returnDefaultString : function(str, type) {
        var defaultStr;
        switch(type) {
            case "string":
                defaultStr = "\"\"";
                break;
            case "object":
                defaultStr = "{}";
                break;
            case "array":
                defaultStr = "[]";
                break;
            case "number":
                defaultStr = "-1";
                break;
            case "boolean":
                defaultStr = "false";
                break;
            default:
                defaultStr = "null"
                break;
        }

        if(str !== "") {
            try {
                JSON.parse(str);
            }catch(e) {
                return defaultStr;
            }
            return str;
        }

        return defaultStr;
    },
    setSceneOperate : function (operate) {
        var cmd = {
            Func : "SetCameraOperate",
            arguments : {
                SceneOperate : operate
            },
            classNumber : 4006
        }

        unityInstance.SendMessage('SuperMapJSObject', 'JSFunction', JSON.stringify(cmd));
    }
};
SuperMap.Web.UI.Controls.SceneControl.registerClass('SuperMap.Web.UI.Controls.SceneControl', Sys.UI.Control, Sys.IDisposable);
