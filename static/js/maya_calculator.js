// 玛雅天赋计算器 v3.1 - 正确五大力量
// 核心: MOD(365*(年-1900)+52+DATE(2001,月,日)-DATE(2001,1,1),260)+1
(function(){'use strict';
var C=260,CT=13,CSe=20;
var T='磁性 月亮 电力 自我存在 超频 韵律 共振 银河 太阳 行星 光谱 水晶 宇宙'.split(' ');
var TK='目的、统一、吸引 挑战、稳定、极化 服务、激活、联结 形式、定义、衡量 力量、权威、自信 组织、平衡、平等 通道、启发、调和 完整、和谐、塑造 意图、脉冲、实现 完美、显化、生产 释放、放下、消解 奉献、普及、合作 超越、包容、存在'.split(' ');
var Se='红龙 白风 蓝夜 黄种子 红蛇 白世界桥 蓝手 黄星星 红月 白狗 蓝猴 黄人 红天行者 白巫师 蓝鹰 黄战士 红地球 白镜 蓝风暴 黄太阳'.split(' ');
var SeK='起源、滋养、存在 沟通、呼吸、灵性 丰盛、梦想、直觉 目标、觉察、绽放 生命力、本能、生存 死亡、平等、机会 实现、知晓、疗愈 艺术、优雅、美化 净化、流动、宇宙之水 忠诚、心灵、爱 魔法、游戏、幻象 自由意志、影响、智慧 探索、觉醒、空间 永恒、施魔、接受 视野、创造、心智 无畏、质疑、才智 导航、共时性、进化 反思、秩序、无止境 催化、能量、自我生成 开悟、生命、宇宙之火'.split(' ');
var SeC='#D32F2F #ECEFF1 #1976D2 #FBC02D #C62828 #B0BEC5 #1565C0 #F9A825 #E53935 #CFD8DC #1E88E5 #FDD835 #EF5350 #90A4AE #42A5F5 #FFEE58 #FF7043 #BDBDBD #29B6F6 #FFD600'.split(' ');
var W='红龙波 白巫师波 蓝手波 黄太阳波 红天行者波 白世界桥波 蓝风暴波 黄人波 红蛇波 白镜波 蓝猴波 黄种子波 红地球波 白狗波 蓝夜波 黄战士波 红月波 白风波 蓝鹰波 黄星星波'.split(' ');

function kinNum(dateStr){
    var p=dateStr.split('-'),y=+p[0],m=+p[1],d=+p[2];
    var off=Math.round((new Date(2001,m-1,d)-new Date(2001,0,1))/864e5);
    return (((365*(y-1900)+52+off)%C)+C)%C+1;
}
function kinName(n){
    var ti=(n-1)%CT, si=(n-1)%CSe;
    return T[ti]+Se[si];
}
function powers(num){
    if(num<1||num>260) throw Error('Kin需1-260');
    var ti=(num-1)%CT, si=(num-1)%CSe;
    var tone=ti+1, seal=si+1;
    
    function _fk(t,s){for(var _k=1;_k<=260;_k++){if(((_k-1)%13+1)===t&&((_k-1)%20+1)===s) return _k;}return 1;}
    // 引导: 图腾=MOD(MOD(主印记调性-1,5)*12+主印记图腾-1,20)+1；调性与主印记一致
    var gs=(((tone-1)%5)*12+seal-1)%CSe+1;
    var guideKin=_fk(tone,gs);
    // 支持: 图腾+N=19, 调性与印记一致
    var ss=19-seal; if(ss<1)ss+=CSe;
    var supportKin=_fk(tone,ss);
    // 挑战: N>10则-10,N<10则+10, 调性与印记一致
    var cs=seal>10?seal-10:seal+10;
    var challengeKin=_fk(tone,cs);
    // 推动: 图腾+N=21, 调性之和=14
    var ds=21-seal; if(ds<1)ds+=CSe;
    var dt=14-tone; if(dt<1)dt+=CT;
    var driveKin=_fk(dt,ds);
    
    return {
        kin:num, name:T[ti]+Se[si],
        tone:{id:tone,name:T[ti],kw:TK[ti]},
        seal:{id:seal,name:Se[si],kw:SeK[si],color:SeC[si]},
        wave:W[Math.floor((num-1)/13)],wavePos:tone,
        relations:{
            guide:guideKin, support:supportKin,
            challenge:challengeKin, drive:driveKin
        }
    };
}
function birth(ds){
    var k=kinNum(ds),p=powers(k);
    p.annualKin=kinNum(new Date().getFullYear()+ds.slice(4));
    return p;
}
var api={version:'3.1',calculateKin:kinNum,getKinInfo:powers,calculateBirthKin:birth,kinName:kinName,KIN_CYCLE:C};
if(typeof window!=='undefined') window.MayaKin=api;
if(typeof globalThis!=='undefined') globalThis.MayaKin=api;
console.log('[玛雅] v3.1 loaded',kinNum('1900-01-01')+'/'+kinNum('1977-11-23'));
})();
