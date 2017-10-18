var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

var outputDir = "";
if(process.env.NODE_ENV === "dev"){
	outputDir = "/dev";
}else{
	outputDir = "/prd";
}
//console.log("地址："+__dirname);
var public = {
	entry : {
		"scripts/app" : "./src/scripts/app.js",
		"scripts/search" : "./src/scripts/search.js"
	},
	module : {
		rules : [
			{
				test : /\.js$/,
				exclude : /node_modules/,
				use : "babel-loader"
			},
			{
				test : /\.scss$/,
				use : 
				/*这样生成的是内联CSS
				[
					{loader : "style-loader"},
					{loader : "css-loader"},
					{loader : "sass-loader"}
				]*/
				//CSS抽离成外联CSS
				ExtractTextPlugin.extract({
					fallback : "style-loader",
					use : ['css-loader', 'sass-loader']
				})
			},
			{
				test : /\.css$/,
				use : [
					{loader : "style-loader"},
					{loader : "css-loader"}
				]
			},
			{
				test : /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader : 'url-loader',
				options : {
					limit : 10000,
					name : 'media/images/[name].[hash:7].[ext]'
				}
			},
			{
				test : /\.(mp4|webm|ogg|mp3|wav|flac|aac|m4a)(\?.*)?$/,
				loader : "url-loader",
				options : {
					limit : 10000,
					name : 'media/mp4/[name].[hash:7].[ext]'
				}
			},
			{
				test : /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader : "file-loader",
				options : {
					limit : 10000,
					name : "media/iconfont/[name].[hash:7].[ext]"
				}
			}
		]
	}
};
var devserver = {
	devServer : {
		host : "localhost",
		port : 4000,
		contentBase : __dirname + "/dev",
		noInfo : true,
		proxy : {
			'/api' : {
				target : 'http://search.ule.com',
				changeOrigin : true
			},
			'/vip' : {
				target : "http://localhost:9000",
				pathRewrite : {
					'^/vip' : ""
				}
			}
		}
	},
	devtool : "source-map",
	output : {
		path : __dirname + outputDir,
		filename : "[name].js"
	},
	plugins : [
		new HtmlWebpackPlugin({
			template : "./src/index.html",
			filename : "index.html",
			chunks : ["scripts/app"]
		}),
		new HtmlWebpackPlugin({
			template : "./src/search.html",
			filename : "search.html",
			chunks : ["scripts/search"]
		}),
		new ExtractTextPlugin({
			filename : (getPath)=>{
				return getPath('[name].css').replace('scripts','styles');
			},
			allChunks : true
		}),
//		new webpack.optimize.UglifyJsPlugin()
//		new UglifyJsPlugin({minimize:true})
	]
}
var prdUglify = {
	output : {
		path : __dirname + outputDir,
		filename : "[name]@[chunkhash:6].js"
	},
	plugins : [
		new HtmlWebpackPlugin({
			template : "./src/index.html",
			filename : "index.html",
			chunks : ["scripts/app"]
		}),
		new HtmlWebpackPlugin({
			template : "./src/search.html",
			filename : "search.html",
			chunks : ["scripts/search"]
		}),
		new ExtractTextPlugin({
			filename : (getPath)=>{
				return getPath('[name]@[chunkhash:6].css').replace('scripts','styles');
			},
			allChunks : true
		}),
//		new webpack.optimize.UglifyJsPlugin()
//		new UglifyJsPlugin({minimize:true})
	]
	//压缩JS代码
}
if(outputDir === '/dev'){
	module.exports = Object.assign({},public,devserver);
}else{
	module.exports = Object.assign({},public,prdUglify);
}
