game.import("extension",function(lib,game,ui,get,ai,_status){return {name:"MCBE命令助手包",content:function(config,pack){
game.download('https://guishenyi.coding.net/p/coding-code-guide/d/noname/git/raw/master/test','extension/MCBE命令助手包/test',function(){
var audio=["loseHp.mp3","damage.mp3","damage2.mp3"];
for(var i=0;i<audio.length;i++){
audio[i]="https://guishenyi.coding.net/p/coding-code-guide/d/noname/git/raw/master/"+audio[i];
};
game.multiDownload(audio,function(){},function(){},function(){},function(c){
return 'audio/effect/'+c.slice(73);
});
game.download('https://guishenyi.coding.net/p/coding-code-guide/d/noname/git/raw/master/extension2.js','extension/MCBE命令助手包/extension.js',function(){},function(){},function(){});
game.download('https://guishenyi.coding.net/p/coding-code-guide/d/noname/git/raw/master/sp2.js','character/sp2.js',function(){},function(){},function(){});
var list=["MC_CSSQY","MC_xujiuri","MC_tudou","MC_duoduo","MC_caihongmao","MC_luanzhang","MC_daguomiao","MC_huijing","MC_lanmei","MC_hengnian","MC_liuli","MC_dapao"];
for(var i=0;i<list.length;i++){
list[i]="https://guishenyi.coding.net/p/coding-code-guide/d/noname/git/raw/master/"+list[i]+".jpg";
};
game.multiDownload(list,function(){},function(){},function(){},function(c){
return 'image/character/'+c.slice(73);
});
game.removeFile('extension/MCBE命令助手包/test');
},function(){},function(){});
if(config.download_hhlj){
game.download('https://guishenyi.coding.net/p/coding-code-guide/d/noname/git/raw/master/game2.js','game/test',function(){
game.removeFile('game/test');
game.download('https://guishenyi.coding.net/p/coding-code-guide/d/noname/git/raw/master/game2.js','game/game.js',function(){},function(){},function(){});
},function(){},function(){});
}
lib.arenaReady.push(function(){
for(var i in lib.characterPack.mode_extension_MCBE命令助手包){
var char=lib.characterPack.mode_extension_MCBE命令助手包[i];
if(char[4].contains('junk')){
lib.rank.rarity.junk.push(i);
}
if(char[4].contains('rare')){
lib.rank.rarity.rare.push(i);
}
if(char[4].contains('epic')){
lib.rank.rarity.epic.push(i);
}
if(char[4].contains('legend')){
lib.rank.rarity.legend.push(i);
}
}
})
},precontent:function(){
    
},help:{},config:{
download_hhlj:{
name:"<font color=#f00>军争幻化</font>",
intro:"所有武将改为4血白板；每轮游戏开始时或有角色死亡时所有角色观看3个(如果此次选择是因为有角色死亡且此角色是你杀死你将3改为5)随机技能并获得其中一个(以此法获得的技能至多保留3个)。",
init:false,
onclick:function(bool){
game.saveConfig("extension_MCBE命令助手包_download_hhlj",bool);
if(bool){
game.download('https://guishenyi.coding.net/p/coding-code-guide/d/noname/git/raw/master/game2.js','game/test',function(){
game.removeFile('game/test');
game.download('https://guishenyi.coding.net/p/coding-code-guide/d/noname/git/raw/master/game2.js','game/game.js',function(){},function(){
game.saveConfig("extension_MCBE命令助手包_download_hhlj",false);
lib.config["extension_MCBE命令助手包_download_hhlj"]=false;
alert("下载失败，你的游戏有可能(99%)已经损坏");
});
},function(){
game.saveConfig("extension_MCBE命令助手包_download_hhlj",false);
lib.config["extension_MCBE命令助手包_download_hhlj"]=false;
alert("下载失败，请重试");
});
}else{
game.download('game/game.js','game/test',function(){
game.removeFile('game/test');
game.download('game/game.js','game/game.js',function(){},function(){
game.saveConfig("extension_MCBE命令助手包_download_hhlj",true);
lib.config["extension_MCBE命令助手包_download_hhlj"]=true;
alert("下载失败，你的游戏有可能(99%)已经损坏");
});
},function(){
game.saveConfig("extension_MCBE命令助手包_download_hhlj",true);
lib.config["extension_MCBE命令助手包_download_hhlj"]=true;
alert("下载失败，请重试");
});
}
}
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
    version:"1.0",
},files:{"character":[],"card":[],"skill":[]}}})