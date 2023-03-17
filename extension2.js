game.import("extension",function(lib,game,ui,get,ai,_status){return {name:"MCBE命令助手包",content:function(config,pack){
game.saveConfig('联机包_version','1.84.7');
lib.config.联机包_version='1.84.7';
game.it=function(){
};
if(!lib.config.联机包_version_2||lib.config.联机包_version_2!=lib.versionOL){
lib.config.联机包_version_2=lib.versionOL;
game.saveConfig('联机包_version_2',lib.versionOL);
//if(!_status.Gs_gx) game.gx();
};
if(!lib.config.联机包_init||lib.config.联机包_init!=lib.config.联机包_version){
game.it();
lib.config.联机包_init==lib.config.联机包_version;
game.saveConfig('联机包_init',lib.config.联机包_version);
};
game.shijianDownload_gs = (url, folder ,onsuccess, onerror, onprogress) => {
let downloadUrl = url, path = '', name = url;
if (url.indexOf('/') != -1) {
path = url.slice(0, url.lastIndexOf('/'));
name = url.slice(url.lastIndexOf('/') + 1);
}
if(folder) path=lib.assetURL+folder;
if (url.indexOf('http') != 0) {
url = lib.updateURL + '/master/' + url;
}

/**
 * 下载成功
 * @param { FileEntry } [FileEntry] 文件系统
 * @param { boolean } [skipDownload] 是否跳过下载
 */
function success(FileEntry, skipDownload) {
if (typeof onsuccess == 'function') {
if (skipDownload === true) {
onsuccess(skipDownload);
} else {
onsuccess();
}
}
}

/**
 * 错误处理
 * @param { FileTransferError | Error } e 错误对象
 * @param { string } [message] 错误信息
 */
function error(e, message) {
// 手机端下载的错误
// 如果下载的是文件夹(xx/game/)会报400，如果是xx/game的形式在github会报404
if (e instanceof window.FileTransferError) {
const errorCode = {
1: 'FILE_NOT_FOUND_ERR',
2: 'INVALID_URL_ERR',
3: 'CONNECTION_ERR',
4: 'ABORT_ERR',
5: 'NOT_MODIFIED_ERR'
};
console.error({
message: e.body,
source: e.source,
status: e.http_status,
target: e.target,
error: errorCode[e.code]
});
if (typeof onerror == 'function') {
onerror(e, e.body);
}
} else {
// 电脑端下载的错误
console.error(e, message);
if (typeof onerror == 'function') {
onerror(e, message);
}
}
}

if (window.FileTransfer) {
// 判断是不是文件夹，不是才下载
function download() {
let fileTransfer = new FileTransfer();
fileTransfer.download(encodeURI(url), encodeURI(path), success, error);
}
window.resolveLocalFileSystemURL(lib.assetURL,
/**
 * @param { DirectoryEntry } DirectoryEntry 
 */
DirectoryEntry => {
DirectoryEntry.getDirectory(path, { create: false }, dir => {
dir.getDirectory(name, { create: false }, () => {
console.log(`${path}/${name}是文件夹`);
// 跳过下载
success(undefined, true);
}, download);
}, download);
}, download);
} else {
const fetch = myFetch(url);

if (typeof onprogress == 'function') {
/** @type { number } 资源总长度 */
let contentLength;
/** @type { number } 当前接收到了这么多字节 */
let receivedLength = 0;

fetch.then(response => {
if (response.headers instanceof Headers) {
contentLength = Number(response.headers.get('Content-Length'));
}
if (response.body instanceof ReadableStream) {
return response.body;
} else {
return Promise.reject('ReadableStream');
}
})
.then(body => {
const reader = body.getReader();
return new ReadableStream({
start(controller) {
function pump() {
return reader.read().then(({ done, value }) => {
// 读不到更多数据就关闭流
if (done) {
controller.close();
return;
}
receivedLength += value.length;
// @ts-ignore
onprogress(receivedLength, contentLength);
// 将下一个数据块置入流中
controller.enqueue(value);
return pump();
});
}
return pump();
}
});
})
.then(stream => new Response(stream))
}

fetch.then(response => response.arrayBuffer())
.then(arrayBuffer => {
// console.log(arrayBuffer);
// 写入文件
// 先创建指定文件夹
game.ensureDirectory(path, () => {
const fs = require('fs');
const p = require('path');
const filePath = p.join(__dirname, path, name);
// 如果是个文件夹，就退出
if (fs.existsSync(filePath)) {
const stat = fs.statSync(filePath);
if (stat.isDirectory()) {
console.error(`${path + '/' + name}是个文件夹`);
alert(`${path + '/' + name}是个文件夹，不予下载。请将此问题报告给此更新源的管理员。`);
// return error(new Error(path + '/' + name), 'isDirectory');
return success(undefined, true);
}
}
fs.writeFile(filePath, Buffer.from(arrayBuffer), null, e => {
if (e) error(e, 'writeFile');
else success();
});
});
})
.catch(error);
}
};

game.shijianMultiDownload_gs = (list, onsuccess, onerror, onfinish, process , onprogress) => {
/**
 * 下载文件，失败后300ms重新下载
 * @param { string } current 文件名 
 */
let reload = (current) => {
let str1 = "正在下载：";
let current2 = null;
let current3 = current.replace(lib.updateURL, '');
if(typeof process=="function") current2=process(current);
if (current3.indexOf('theme') == 0) {
game.print(str1 + current3.slice(6));
} else if (current3.indexOf('image/skin') == 0) {
game.print(str1 + current3.slice(11));
} else {
game.print(str1 + current3.slice(current3.lastIndexOf('/') + 1));
}
game.shijianDownload_gs(current, current2 , skipDownload => {
if (skipDownload === true) {
game.print(`跳过下载: ${current}`);
console.log(`跳过下载: ${current}`);
} else {
game.print(`下载成功: ${current}`);
console.log(`下载成功: ${current}`);
}
onsuccess();
//自调用
download();
}, (e, message) => {
console.log(`下载失败: ${message}`);
console.dir(e);
onerror(e, message);
if (message !== '用户未登录') {
//setTimeout(() => reload(current), 300);
}
download();
}, (loaded, total) => {
if (typeof onprogress == 'function') {
onprogress(current, loaded, total);
}
});
};

// 不修改原数组
list = list.slice(0);
let download = () => {
if (list.length) {
/** @type string 正在下载的文件名 */
// @ts-ignore
let current = list.shift();
reload(current);
} else {
onfinish();
}
};
download();
};
game.shijianCreateProgress_gs = (title, max, fileName, value) => {
/** @type { progress } */
// @ts-ignore
// 代码复制于在线更新(诗䇳)扩展
const parent = ui.create.div(ui.window, {
textAlign: 'center',
width: '300px',
height: '150px',
left: 'calc(50% - 150px)',
top: 'auto',
bottom: 'calc(50% - 75px)',
zIndex: '10',
boxShadow: 'rgb(0 0 0 / 40 %) 0 0 0 1px, rgb(0 0 0 / 20 %) 0 3px 10px',
backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4))',
borderRadius: '8px'
});

// 可拖动
parent.className = 'dialog';

const container = ui.create.div(parent, {
position: 'absolute',
top: '0',
left: '0',
width: '100%',
height: '100%'
});

container.ontouchstart = ui.click.dialogtouchStart;
container.ontouchmove = ui.click.touchScroll;
// @ts-ignore
container.style.WebkitOverflowScrolling = 'touch';
parent.ontouchstart = ui.click.dragtouchdialog;

const caption = ui.create.div(container, '', title, {
position: 'relative',
paddingTop: '8px',
fontSize: '20px'
});

ui.create.node('br', container);

const tip = ui.create.div(container, {
position: 'relative',
paddingTop: '8px',
fontSize: '20px',
width: '100%'
});
const file = ui.create.node('span', tip, '', fileName);
file.style.width = file.style.maxWidth = '100%';
ui.create.node('br', tip);
const index = ui.create.node('span', tip, '', value || '0');
ui.create.node('span', tip, '', '/');
const maxSpan = ui.create.node('span', tip, '', (max + '') || '未知');

ui.create.node('br', container);

const progress = ui.create.node('progress', container);
progress.setAttribute('value', value || '0');
progress.setAttribute('max', max);

parent.getTitle = () => caption.innerText;
parent.setTitle = (title) => caption.innerText = title;
parent.getFileName = () => file.innerText;
parent.setFileName = (name) => file.innerText = name;
parent.getProgressValue = () => progress.value;
parent.setProgressValue = (value) => progress.value = index.innerText = value;
parent.getProgressMax = () => progress.max;
parent.setProgressMax = (max) => progress.max = maxSpan.innerText = max;
return parent;
};
game.gxsc=function(){
let checkFileList = (updates, proceed) => {
//代码复制于在线更新(诗䇳)扩展
let n = updates.length;
if (!n) {
proceed();
}
for (let i = 0; i < updates.length; i++) {
if (lib.node && lib.node.fs) {
let err = false;
let entry = updates[i];
if (lib.node.fs.existsSync(__dirname + '/' + entry)) {
//如果有文件/文件夹，判断大小
let stat = lib.node.fs.statSync(__dirname + '/' + entry);
if (stat.size == 0) {
err = true;
}
} else {
//没有文件/文件夹
err = true;
}
if (err) {
n--;
if (n == 0) {
proceed();
}
} else {
n--;
i--;
updates.remove(entry);
if (n == 0) {
proceed();
}
}
} else {
window.resolveLocalFileSystemURL(lib.assetURL + updates[i], (name => {
return (entry) => {
n--;
updates.remove(name);
if (n == 0) {
proceed();
}
}
})(updates[i]), () => {
n--;
if (n == 0) {
proceed();
}
});
}
}
};
let fun=function(){
if(updates.length>0){
if(!_status.Gs_gx&&confirm("扩展(联机包)的素材有缺失是否下载？")){
for(var i=0;i<updates.length;i++){
updates[i]="https://raw.fastgit.org/1937475624/nonmae/main/"+updatesx[updates[i]];
};
game.gx(updates,null,false);
};
};
};
let updates=[],updatesx={};
for(var i in window.file_Mt_Gs){
updates.add(window.file_Mt_Gs[i]);
updatesx[window.file_Mt_Gs[i]]=i;
};
checkFileList(updates,fun);
};
game.gx=function(listsx,html,bool){
if(!window.func_Gsed){
alert("未能检测到更新表");
return;
};
if(!_status.Gs_gx){
_status.Gs_gx=true;
game.shijianDownload_gs('https://raw.fastgit.org/1937475624/nonmae/main/test','extension/MCBE命令助手包/test',function(){
var str="https://raw.fastgit.org/1937475624/nonmae/main/";
if(!listsx){
var lists=[];
if(bool!==false){
for(var i in window.file_Gs){
lists.add(str+i);
};
};
if(bool!==true){
for(var i in window.file_Mt_Gs){
lists.add(str+i);
};
};
};
var noList=[];
var noName="";
if(listsx) lists=listsx;
var n1=0;
var n2=lists.length;
var n3=0;
if(html){
var button=html.childNodes[0].childNodes[0];
var namelod=button.innerHTML;
button.disabled=true;
button.innerHTML = '更新中';
};
var name=lists[0].slice(47);
_status.Gs_gxName=name;
const copyList = lists.slice(0);
const progress=game.shijianCreateProgress_gs('下载扩展文件', copyList.length, name);
progress.style.bottom = 'calc(25% - 75px)';
game.shijianMultiDownload_gs(lists,function(){
n1++;
progress.setProgressValue(n1);
progress.setFileName(_status.Gs_gxName);
},function(e){
n3++;
progress.setFileName(_status.Gs_gxName);
noList.add(_status.Gs_gxUrl);
noName+=_status.Gs_gxName+"、";
game.print('下载失败：'+_status.Gs_gxName);
},function(){
_status.Gs_gx=false;
progress.setProgressValue(copyList.length);
progress.setFileName("下载完毕");
setTimeout(function(){
progress.remove();
if(button){
button.disabled = false;
button.innerHTML=namelod;
};
if(noList.length==0){
if(button) button.disabled=false;
if(confirm("扩展更新完毕是否重启？")) game.reload();
}else{
var str=noList.length>1?"等文件":"";
if(confirm(noName.slice(0,noName.length-1)+str+"下载失败是否重试？")){
if(html){
game.gx(noList,html);
}else game.gx(noList);
};
};
},250);
},function(c){
var name=c.slice(47);
_status.Gs_gxName=name;
_status.Gs_gxUrl=c;
if(window.file_Gs[name]) return window.file_Gs[name];
if(window.file_Mt_Gs[name]) return window.file_Mt_Gs[name];
},function(){});
game.removeFile('extension/MCBE命令助手包/test');
},function(){
game.print("MCBE命令助手包：下载测试文件失败！");
_status.Gs_gx=false;
alert("MCBE命令助手包：下载测试文件失败！");
},function(){});
};
};
game.shijianDownload_gs('https://raw.fastgit.org/1937475624/nonmae/main/updates.js','extension/MCBE命令助手包/updates.js',function(){
var url=lib.assetURL+"extension/MCBE命令助手包";
lib.init.js(url,['updates'],function(){
if(window.func_Gs) window.func_Gs(lib,game,ui,get,ai,_status);
});
},function(){
game.print("MCBE命令助手包：获取更新日志失败！");
},function(){});
},precontent:function(){},help:{},config:{
download_hhlj:{
name:"<font color=#f00>军争幻化</font>",
intro:"所有武将改为4血白板；每轮游戏开始时所有角色观看3个随机技能并获得其中一个(以此法获得的技能至多保留3个)。",
init:false,
onclick:function(bool){
game.saveConfig("mc_hh",bool);
game.saveConfig("extension_MCBE命令助手包_download_hhlj",bool);
},
},
hh_boos:{
name:'boss模式开关',
init:false,
onclick:function(bool){
game.saveConfig("extension_MCBE命令助手包_hh_boos",bool);
game.saveConfig("mc_Boss",bool);
},
},
"MC_addList":{
name:'为技能池添加技能',
clear:true,
unfrequent:true,
onclick:function(){
game.prompt('请输入技能ID多个技能用逗号(小写)分割',function(str){
if(str){
var skills=str.split(",");
var addList=[];
var erro=[];
for(var i=0;i<skills.length;i++){
var name=skills[i];
var info=get.info(name);
if(info) addList.add(name);
else erro.add(name);
};
if(erro.length>0) alert("技能"+get.translation(erro)+"不存在请检查ID是否正确");
if(addList.length>0){
if(!lib.config.mc_addList) lib.config.mc_addList=[];
lib.config.mc_addList.addArray(addList);
game.saveConfig("mc_addList",lib.config.mc_addList);
alert(get.translation(addList)+"已添加至技能池重启后生效");
};
};
});
},
},
"MC_removeList":{
name:'管理自定义技能',
clear:true,
unfrequent:true,
onclick:function(){
var chooseButton=function(skills){
var test=ui.create.div('.popup-container',ui.window,function(){
if(this.clicked){
this.clicked=false;
}
else test.remove();
});
var dialogContainer=ui.create.div('.prompt-container',test);
var test2=ui.create.div('.menubg',ui.create.div(dialogContainer),function(){
test.clicked=true;
});
ui.create.div('','选择要从自定义技能池移除的技能',test2);
var button=ui.create.div(test2);
var Up=ui.create.div('.menubutton.large','上一页',test2,function(){
if(si[0]<=0) return;
si[0]-=12;
si[1]-=12;
Und.classList.remove('disabled');
for(var i=0;i<table.childNodes.length;i++){
if(i>=si[0]&&i<=si[1]) table.childNodes[i].style.display='';
else table.childNodes[i].style.display='none';
};
if(si[0]<=0) Up.classList.add('disabled');
});
var Und=ui.create.div('.menubutton.large','下一页',test2,function(){
if(si[1]>=table.childNodes.length-1) return;
si[0]+=12;
si[1]+=12;
if(si[0]>0) Up.classList.remove('disabled');
for(var i=0;i<table.childNodes.length;i++){
if(i>=si[0]&&i<=si[1]) table.childNodes[i].style.display='';
else table.childNodes[i].style.display='none';
};
if(si[1]>=table.childNodes.length-1) Und.classList.add('disabled');
});
var clickConfirm=function(){
if(rSkill&&rSkill.length>0){
test.remove();
lib.config.mc_addList.removeArray(rSkill);
game.saveConfig("mc_addList",lib.config.mc_addList);
alert("已将"+get.translation(rSkill)+"移出自定义技能池。");
};
};
var rSkill=[];
var si=[0,11];
var table=document.createElement('div');
table.classList.add('add-setting');
table.style.margin='0';
table.style.width='100%';
table.style.position='relative';
for(var i=0;i<skills.length;i++){
var td=ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
td.link=skills[i];
table.appendChild(td);
td.innerHTML='<span>'+get.translation(skills[i])+'</span>';
if(i>=12) td.style.display='none';
td.addEventListener(lib.config.touchscreen?'touchend':'click',function(){
if(_status.dragged) return;
if(_status.justdragged) return;
_status.tempNoButton=true;
setTimeout(function(){
_status.tempNoButton=false;
},500);
var link=this.link;
if(!this.classList.contains('bluebg')){
rSkill.add(link);
this.classList.add('bluebg');
confirmNode.classList.remove('disabled');
}
else{
this.classList.remove('bluebg');
rSkill.remove(link);
if(rSkill.length<=0) confirmNode.classList.add('disabled');
}
});
button.appendChild(table);
};
Up.classList.add('disabled');
if(table.childNodes.length<=12) Und.classList.add('disabled');
var test3=ui.create.div(test2);
var confirmNode=ui.create.div('.menubutton.large.disabled','确认</br>删除',test3,clickConfirm);
ui.create.div('.menubutton.large','取消</br>删除',test3,function(){
if(this.clicked){
this.clicked=false;
}
else test.remove();
});
};
if(!lib.config.mc_addList||lib.config.mc_addList.length<=0){
alert("暂无自定义技能！");
return;
}else chooseButton(lib.config.mc_addList);
},
},
"MC_BossList":{
name:'切换Boss',
init: 'MC_Boas_wujin',
item:{
MC_Boas_wujin:'无尽模式(萌新推荐)',
MC_Boas_wujin_sunce:'挑战孙笨(无尽)',
MC_Boss_shanhaizhiyi:'山海志异',
MC_Boss_bafei:'挑战八废',
MC_Boss_bashen: '挑战八神',
MC_Boss_xianqin:'先秦地府(萌新慎入)',
MC_Boss_zhuoguizhuxie:'【界】山海志异',
},
onclick:function(value){
game.saveConfig('extension_MCBE命令助手包_MC_BossList',value);
lib.config.mc_BossListX=value;
game.saveConfig("mc_BossListX",value);
if(confirm("设置完毕重启后生效\n是否重启？")) game.reload();
},
},
download_reset:{
name:'<button type="button">重新下载扩展(全部)</button>',
onclick:function(){
if(typeof(game.gx)!=='function') return alert("请开启该扩展重启后再试");
if(!_status.Gs_gx){
game.gx(null,this);
}else alert("请不要重复点击！");
},
clear:true,
},
download_reset_core:{
name:'<button type="button">重新下载扩展(仅核心)</button>',
onclick:function(){
if(typeof(game.gx)!=='function') return alert("请开启该扩展重启后再试");
if(!_status.Gs_gx){
game.gx(null,this,true);
}else alert("请不要重复点击！");
},
clear:true,
},
download_reset_Material:{
name:'<button type="button">重新下载扩展(仅素材)</button>',
onclick:function(){
if(typeof(game.gx)!=='function') return alert("请开启该扩展重启后再试");
if(!_status.Gs_gx){
game.gx(null,this,false);
}else alert("请不要重复点击！");
},
clear:true,
},
},package:{
    character:{
        character:{
        },
        translate:{
        },
    },
    card:{
        card:{
        },
        translate:{
        },
        list:[],
    },
    skill:{
        skill:{
        },
        translate:{
        },
    },
    intro:"",
    author:"鬼神易",
    diskURL:"",
    forumURL:"",
    version:"1.81.3",
},files:{
"character":[],
"card":[],
"skill":[],
},
editable:false,
}})
