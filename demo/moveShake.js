/*
适用于在父元素下查找有class的同类标签
*/
function getElementsByClassName( parent,tagName,className) {
  var aEls = parent.getElementsByTagName(tagName);
  var arr = [];

  for (var i = 0; i < aEls.length; i++) {

    var aClass = aEls[i].className.split(' ');

    for(var j = 0, length2 = aClass.length; j < length2; j++){

      if ( aClass[j] == className) {
        arr.push(aEls[i]);
        break;
      }
    }
  }

  return arr;
}

/*
查找所有符合条件的元素
*/
function getByClass(className) {

  var arr = document.getElementsByTagName('*');
  var aEle = [];
  var re = new RegExp('\\b'+className+'\\b');

  for (var i = 0; i < arr.length; i++) {

    if (re.test(arr[i].className)) {
      aEle.push(arr[i]);
    }
  }

  return aEle;
}

function arrIndexOf(arr,v) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === v) {
      return i;
    }else{
      if (i == arr.length -1) {
        return -1;
      }
      continue;
    }
  }
}

function addClass(obj,className) {

    if (obj.className == '') {
      obj.className = className;
    }else {

      var aClass = className.split(' ');

      for (var i = 0; i < aClass.length; i++) {

          var _index = arrIndexOf( obj.className.split(' ') , aClass[i]);

          if (_index == -1) {

            obj.className += ' ' + aClass[i];
          }
      }
  }
}

function removeClass(obj,className) {

  if (obj.className != '' ) {

    var arr = obj.className.split(' ');
    var aClass = className.split(' ');

    for (var i = 0; i < aClass.length; i++) {

      var _index = arrIndexOf( arr, aClass[i]);

       if (_index != -1) {

        arr.splice(_index, 1);

      }
    }

    obj.className = arr.join(' ');
  }
}

 function getStyle( obj,attr){
  if ( getComputedStyle ) {
    return getComputedStyle( obj ,false)[ attr ];
  }else{
    return obj.currentStyle[ attr ];
  }
 }//JQ下无效

/*function move (obj,attr,step,target,endFn ) {
  var curr = null;
   curr = (attr === 'opacity') ? parseFloat( getStyle(obj,attr) ) : parseInt(getStyle(obj,attr));
   step = curr < target  ? step : -step;
   clearInterval( obj.timer );
  obj.timer = setInterval(function () {
    curr = (attr === 'opacity') ? parseFloat( getStyle(obj,attr) ) : parseInt(getStyle(obj,attr));
   var speed = curr + step;
   if ( (step > 0 &&speed > target) || ( step < 0 && speed < target )) {
     speed =  target;
    }
    if ( attr == 'opacity') {
      obj.style.filter = 'alpha(opacity:'+ speed * 100 +')';
      obj.style[ attr ] = speed;
    }else{
     obj.style[ attr ] = speed + 'px';
    }
   if (speed === target && curr == target) {
     clearInterval( obj.timer);
     endFn&&endFn();

   }

 },30);
}*/

/*
匀速运动
attrs:需要改变的样式，json形式，支持同时改变多样式;(opacity为整数形式)
step:步长
endFn:回调函数，所有样式达到目标点时执行
*/
function move (obj,attrs,step,endFn ) {
  var curr = null;
  var speed = 0;

   clearInterval( obj.timer );

  obj.timer = setInterval(function () {

  var toTarget = true;

    for(var attr in attrs){

      var iTarget = attrs[attr];

      curr = (attr === 'opacity') ? Math.round( getStyle(obj,attr) *100 ) : parseInt(getStyle(obj,attr));

      step = curr < iTarget  ? step : -step;

      speed = curr + step;

      if ( (step > 0 &&speed > iTarget) || ( step < 0 && speed < iTarget )) {
         speed =  iTarget;
      }

      if (curr != iTarget) {

        toTarget = false;
        if ( attr == 'opacity') {
          obj.style.filter = 'alpha(opacity:'+ speed +')';
          obj.style[ attr ] = speed/100;
        }else{
          obj.style[ attr ] = speed + 'px';
        }

      }

    }
    if (toTarget) {
      clearInterval(obj.timer);
      endFn && endFn();
    }

 },30);
}


/*
缓冲运动，速度与当前值和目标值的距离成正比；
var 速度 = (目标点 - 当前值)/系数;
速度取整 step = step > 0 ? Math.ceil(step) : Math.floor(step);
*/
function slowMove (obj,attrs,endFn ) {
  var curr = null;
  var speed = 0;

   clearInterval( obj.timer );
  obj.timer = setInterval(function () {

    var toTarget = true;

    for(var attr in attrs){

      var iTarget = attrs[attr];


      curr = (attr === 'opacity') ? Math.round( getStyle(obj,attr) *100 ) : parseInt(getStyle(obj,attr));

      var step = (iTarget - curr) / 8;

      step = step > 0 ? Math.ceil(step) : Math.floor(step);

      speed = curr + step;

      if ( (step > 0 &&speed > iTarget) || ( step < 0 && speed < iTarget )) {
         speed =  iTarget;
      }

      if (curr != iTarget) {

        toTarget = false;
        if ( attr == 'opacity') {
          obj.style.filter = 'alpha(opacity:'+ speed +')';
          obj.style[ attr ] = speed/100;
        }else{
          obj.style[ attr ] = speed + 'px';
        }

      }

    }
    if (toTarget) {
      clearInterval(obj.timer);
      endFn && endFn();
    }

 },30);
}


/*obj.speed 为0
  公式：速度 += （目标值 - 当前值）/ 系数（6,7,8）;
  速度 *= 系数2（0.7,0.75……）(速度损耗)
  停止条件：速度很小且距离很近，
  过界：改变宽高时，IE下宽高不能为负值
        方法：为负值时，设宽高为0
*/
function flexMove (obj,iTarget) {

  obj.speed = 0;

  clearInterval(obj.timer);

  obj.timer = setInterval(function () {

    obj.speed += (iTarget - obj.offsetLeft)/7;
    obj.speed *= 0.75;

    if (Math.abs(obj.speed)<=1 && Math.abs(iTarget - obj.offsetLeft)<=1) {

      clearInterval(obj.timer);
      obj.style.left = iTarget + 'px';
      obj.speed = 0;

    }else {
      obj.style.left = obj.speed + obj.offsetLeft + 'px';

    }

  },30)

}

/*自由落体运动
function startMove(obj) {

  obj.speed = 0
  clearInterval(obj.timer);

  obj.timer = setInterval(function () {

    obj.speed +=3;//重力效果

    var T = obj.offsetTop + obj.speed;

    if( T > document.documentElement.clientHeight - obj.offsetHeight){

      T = document.documentElement.clientHeight - obj.offsetHeight;

      obj.speed *= -1;

      obj.speed *=0.75;

    }

    if(Math.abs(obj.speed) <=1 && Math.abs(document.documentElement.clientHeight - obj.offsetHeight - T)<1){
      clearInterval(obj.timer);
    }

    oDiv.style.top = T +'px';
  },30);
}*/

/*
抛物线运动:水平方向为匀速运动
function startMove(obj) {

  obj.speedY = -40;
  obj.speedX = 10;

  clearInterval(obj.timer);

  obj.timer = setInterval(function () {

    obj.speedY +=3;

    var T = obj.offsetTop + obj.speedY;

    if( T > document.documentElement.clientHeight - obj.offsetHeight){

      T = document.documentElement.clientHeight - obj.offsetHeight;

      obj.speedY *= -1;

      obj.speedY *=0.75;

      obj.speedX *= 0.75;//速度损耗

    }

    if (Math.abs(obj.speedX) <=1 && Math.abs(obj.speedY<=1)) {
      clearInterval(obj.timer);
    }

    oDiv.style.top = T +'px';
    oDiv.style.left = obj.offsetLeft + obj.speedX  +'px';
  },30);
}
*/


 function shakeFn() {
    var _this = this;
    shake(_this, 'left', function() {
        shake(_this, 'top');
    })
}

function shake(obj, attr,freq, endFn) {
    var arr = [];
    var num = 0;
    var pos = obj[attr];//将位置添加为属性
    for (var i = freq; i > 0; i -= 2) {
        arr.push(i, -i);
    }
    arr.push(0);
    clearInterval(obj.timer1);
    obj.timer1 = setInterval(function() {
        obj.style[attr] = arr[num] + pos + 'px';
        num++;
        if (num === arr.length) {
            num = 0;
            clearInterval(obj.timer1);
            endFn && endFn();
        }
    }, 30)
} //shake

//shake例子
/*for (var i = 0; i < aDiv.length; i++) {
         aDiv[i].style.left = 40+ i* 50 + 'px';

         aDiv[i].left = parseInt( getStyle(aDiv[i],'left'));
         aDiv[i].top = parseInt( getStyle(aDiv[i],'top'));
         aDiv[i].onmouseover =  shakeFn;
       }
*/
function toTwo(m) {
  return m < 10 ? '0' + m : '' + m;
}

function Sum(a) {
  arguments[arguments.length -1] = a;
  for (var i = 0; i <= num; i++) {
  sum += arguments[i];
    return sum;//外部设置sum变量
  }
}

function bind (obj,evname,fn) {

  if (obj.addEventListener) {
    obj.addEventListener(evname, fn ,false);
  }else{
    obj.attachEvent( 'on'+ evname, function () {
      fn.call( obj);
    })
  }
}

function drag ( obj ) {
  obj.onmousedown = function ( ev) {
     var ev = ev || event;
     var disX = ev.clientX - this.offsetLeft;
     var disY = ev.clientY - this.offsetTop;

     if ( obj.setCapture ) {
       obj.setCapture();
     }

     document.onmousemove = function ( ev) {
       var ev = ev || event;

          var L = ev.clientX - disX;

          var T = ev.clientY - disY;

          if (L < 0) {
            L = 0;
          }else if (L > document.documentElement.clientWidth - obj.offsetWidth) {
            L = document.documentElement.clientWidth - obj.offsetWidth
          }

          if (T < 0) {
            T = 0;
          }
          if (T > document.documentElement.clientHeight - obj.offsetHeight) {
            T = document.documentElement.clientHeight - obj.offsetHeight;
          }
          obj.style.left = L + 'px';
          obj.style.top = T + 'px';
     };

     obj.onmouseup = function () {
       document.onmouseup = document.onmousemove = null;

       if ( obj.releaseCapture) {
         obj.releaseCapture();
       }

     };

     return false;
  }
}


//快排
function quickSort ( arr){

  if (arr.length <= 1) {
    return arr;
  }
  var num = Math.floor( arr.length / 2);

  var midNum = arr.splice(num,1);

  var left = [];
  var right = [];

  for (var i = 0; i < arr.length; i++) {
    if (arr[i] < midNum) {
      left.push(arr[i]);
    }else{
      right.push( arr[i]);
    }
  }

  return quickSort( left).concat([midNum], quickSort( right));

}

//产生随机数排序
var arr = [0,1,2,3,4,5,6,7,8]

arr.sort(function (a,b) {
  return Math.random() - 0.5;
})


/*拖动鼠标物体随之移动，松开时物体运动
oDiv.onmousedown = function(ev){
    var ev = ev || window.event;
    disX = ev.clientX - oDiv.offsetLeft;
    disY = ev.clientY - oDiv.offsetTop;

    prevX = ev.clientX;
    prevY = ev.clientY;

    document.onmousemove = function(ev){
      var ev = ev || window.event;
      oDiv.style.left = ev.clientX - disX + 'px';
      oDiv.style.top = ev.clientY - disY + 'px';

      iSpeedX = ev.clientX - prevX;
      iSpeedY = ev.clientY - prevY;
      ////运动速度由最后总开的速度决定/////

      prevX = ev.clientX;
      prevY = ev.clientY;

    };
    document.onmouseup = function(){
      document.onmousemove = null;
      document.onmouseup = null;

      startMove();

    };
    return false;
  };

  function startMove(){
    clearInterval(timer);
    timer = setInterval(function(){

      iSpeedY += 3;

      var L = oDiv.offsetLeft + iSpeedX;
      var T = oDiv.offsetTop + iSpeedY;

      if(T>document.documentElement.clientHeight - oDiv.offsetHeight){
        T = document.documentElement.clientHeight - oDiv.offsetHeight;
        iSpeedY *= -1;
        iSpeedY *= 0.75;
        iSpeedX *= 0.75;
      }
      else if(T<0){
        T = 0;
        iSpeedY *= -1;
        iSpeedY *= 0.75;
      }

      if(L>document.documentElement.clientWidth - oDiv.offsetWidth){
        L = document.documentElement.clientWidth - oDiv.offsetWidth;
        iSpeedX *= -1;
        iSpeedX *= 0.75;
      }
      else if(L<0){
        L = 0;
        iSpeedX *= -1;
        iSpeedX *= 0.75;
      }

      oDiv.style.left = L + 'px';
      oDiv.style.top = T + 'px';

    },30);
  }
*/