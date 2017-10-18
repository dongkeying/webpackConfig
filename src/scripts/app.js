import "../styles/app.scss";
//一定要通过这种方式引入图片和scss，才可以使用！！！
import bigcat from "../media/images/bigcat.gif";
import '../media/iconfont/iconfont.eot';
import '../media/mp4/Live.m4a';

var img = new Image();
img.src = bigcat;
console.log(img)
document.body.appendChild(img);
