// 玛雅天赋解读生成器 v2 — 高质量静态页面
// usage: node generate-kins.js [start] [end]
const fs = require('fs');
const path = require('path');

const mayaCode = fs.readFileSync(path.join(__dirname, 'static/js/maya_calculator.js'), 'utf8');
const interpCode = fs.readFileSync(path.join(__dirname, 'static/js/kin-interpretations.js'), 'utf8');
eval(mayaCode);
eval(interpCode);

const KIN_COLORS = ['#D32F2F','#ECEFF1','#1976D2','#FBC02D','#C62828','#B0BEC5','#1565C0','#F9A825','#E53935','#CFD8DC','#1E88E5','#FDD835','#EF5350','#90A4AE','#42A5F5','#FFEE58','#FF7043','#BDBDBD','#29B6F6','#FFD600'];

function trunc(s, n) { return !s || s.length <= n ? s : s.substring(0, n) + '…'; }

function genKin(k) {
  var info = MayaKin.getKinInfo(k);
  if (!info) return null;
  
  var s = KinInterpretations.getSeal(info.seal.id);
  var t = KinInterpretations.getTone(info.tone.id);
  
  var gi = MayaKin.getKinInfo(info.relations.guide);
  var si = MayaKin.getKinInfo(info.relations.support);
  var ci = MayaKin.getKinInfo(info.relations.challenge);
  var di = MayaKin.getKinInfo(info.relations.drive);
  
  var gs = KinInterpretations.getSeal(gi.seal.id);
  var ss = KinInterpretations.getSeal(si.seal.id);
  var cs = KinInterpretations.getSeal(ci.seal.id);
  var ds = KinInterpretations.getSeal(di.seal.id);
  
  var gt = KinInterpretations.getTone(gi.tone.id);
  var st = KinInterpretations.getTone(si.tone.id);
  
  var isSelfGuide = (info.relations.guide === k);
  var color = KIN_COLORS[(info.seal.id - 1) % 20];

  // 波符位置描述
  var wavePosLabels = ['','第一格（磁性）','第二格（月亮）','第三格（电力）','第四格（自我存在）','第五格（超频）','第六格（韵律）','第七格（共振）','第八格（银河）','第九格（太阳）','第十格（行星）','第十一格（光谱）','第十二格（水晶）','第十三格（宇宙）'];
  
  // ========== 构建各段落 ==========
  
  var header = [
    '---',
    'categories:',
    '- 玛雅历法',
    '- Kin解读',
    'type: "kin"',
    'date: "2026-04-29"',
    'draft: false',
    'kin_name: "' + info.name + '"',
    'kin_number: ' + k,
    'tags:',
    '- Kin' + k,
    'title: "' + info.name + ' · Kin ' + k + ' — 完整五大力量解读"',
    'weight: ' + k,
    'description: "' + info.name + '（Kin ' + k + '）的完整五大力量天赋解读：' + s.archetype + '，' + t.question + '，波符' + info.wave + '"',
    '---',
    ''
  ].join('\n');

  // 标记块
  var badge = [
    '<div style="text-align:center;margin-bottom:2rem;padding:1.5rem;background:linear-gradient(135deg,' + color + '15,' + color + '05);border-radius:16px;border:2px solid ' + color + '30">',
    '<span style="font-size:3.5rem;font-weight:800;color:' + color + '">' + k + '</span>',
    '<div style="font-size:1.6rem;font-weight:700;margin:0.3rem 0;color:' + color + '">' + info.name + '</div>',
    '<div style="font-size:0.9rem;color:#888;margin-top:0.5rem">🎨 ' + s.archetype + ' · 🌀 ' + t.action + ' · ❓ ' + t.question + ' · 🌊 ' + info.wave + ' ' + wavePosLabels[info.wavePos] + '</div>',
    '</div>'
  ].join('\n');

  // 命运段落  
  var destinySec = [
    '## 🎯 命运力量（中心）',
    '',
    '**你的核心印记：' + info.name + ' · Kin ' + k + '**',
    '',
    s.essence,
    '',
    s.talentDesc,
    '',
    '**原型：** ' + s.archetype + ' — ' + s.archetypeDesc,
    '',
    '**关键词：** ' + s.keywords.join('、'),
    '**元素/族群：** ' + s.element + ' · ' + s.earthFamily,
    '',
    '**正向天赋：**',
    s.strengths.map(function(x) { return '- ' + x; }).join('\n'),
    '',
    '**需要觉察的阴影：**',
    s.shadows.map(function(x) { return '- ' + x; }).join('\n'),
    '',
    '**你的核心问题：** ' + t.question,
    '**调性动能：** ' + t.action + ' — ' + t.power,
    '',
    t.essence,
    '',
    '**适合的职业方向：** ' + s.career,
    '',
    '> **每日践行：** ' + s.practice,
    ''
  ].join('\n');

  // 指引段落
  var guideNote = isSelfGuide ? '\n\n> **✦ 自引导**：你的指引力量与主Kin相同，这意味着你不需要向外寻找方向——你的内心就是最高的导航。当你感到迷茫时，安静下来，你内在的声音知道答案。\n' : '';
  var guideSec = [
    '## 🌟 指引力量（上方）',
    '',
    '**' + gi.name + ' · Kin ' + info.relations.guide + '**',
    '',
    gs.essence,
    '',
    trunc(gs.talentDesc, 200),
    '',
    '**原型：** ' + gs.archetype + ' — ' + trunc(gs.archetypeDesc, 80),
    '**关键词：** ' + gs.keywords.join('、'),
    '**调性问题：** ' + gt.question,
    guideNote,
    '',
    '**指引如何帮助你的命运力量：**',
    '- ' + t.name + '调性的你（' + t.question + '），需要' + gs.name + '的能量来' + (isSelfGuide ? '回到自己的内在找到方向' : trunc(gs.talentDesc, 50)),
    '- 当你感到方向不明时，激活' + gs.name + '的能量：' + trunc(gs.strengths[0].replace('拥有','').replace('善于',''), 40),
    '- ' + gs.name + '提醒你：' + trunc(gs.essence, 40),
    ''
  ].join('\n');

  // 支持段落
  var supportSec = [
    '## 💪 支持力量（右方）',
    '',
    '**' + si.name + ' · Kin ' + info.relations.support + '**',
    '',
    ss.essence,
    '',
    trunc(ss.talentDesc, 200),
    '',
    '**原型：** ' + ss.archetype + ' — ' + trunc(ss.archetypeDesc, 80),
    '**关键词：** ' + ss.keywords.join('、'),
    '',
    '**支持如何补充你的命运力量：**',
    '- 当你需要' + trunc(s.strengths[1], 20) + '时，' + ss.name + '的能量会自然补上',
    '- ' + ss.name + '为你提供' + trunc(ss.essence, 30),
    '- 你的支持力量 ' + trunc(ss.strengths[0], 60),
    '',
    '**正向特质：**',
    ss.strengths.map(function(x) { return '- ' + x; }).join('\n'),
    ''
  ].join('\n');

  // 挑战段落
  var challengeSec = [
    '## ⚡ 挑战力量（左方）',
    '',
    '**' + ci.name + ' · Kin ' + info.relations.challenge + '**',
    '',
    cs.essence,
    '',
    trunc(cs.talentDesc, 200),
    '',
    '**原型：** ' + cs.archetype + ' — ' + trunc(cs.archetypeDesc, 80),
    '**关键词：** ' + cs.keywords.join('、'),
    '',
    '**挑战如何拓展你的成长：**',
    '- 对' + s.name + '而言，最大的成长在于学习' + trunc(cs.essence, 30),
    '- 当你感觉卡住时，往往是' + cs.name + '的能量在呼唤你整合',
    '- 这不是你的缺点，而是你此生的"拓展方向"',
    '',
    '**需要整合的面向：**',
    cs.shadows.map(function(x) { return '- ' + x; }).join('\n'),
    '',
    '**整合建议：** ' + cs.practice,
    ''
  ].join('\n');

  // 推动段落
  var driveSec = [
    '## 🚀 推动力量（下方）',
    '',
    '**' + di.name + ' · Kin ' + info.relations.drive + '**',
    '',
    ds.essence,
    '',
    trunc(ds.talentDesc, 200),
    '',
    '**原型：** ' + ds.archetype + ' — ' + trunc(ds.archetypeDesc, 80),
    '**关键词：** ' + ds.keywords.join('、'),
    '',
    '**推动如何在潜意识中支持你：**',
    '- 当你面对挑战时，' + ds.name + '的能量会自动激活来推动你',
    '- 这是你"根"的力量——你甚至不一定能察觉它，但它始终在运作',
    '- ' + trunc(ds.talentDesc, 60),
    '',
    ds.strengths.map(function(x) { return '- ' + x; }).join('\n'),
    ''
  ].join('\n');

  // 波符段落
  var waveSec = [
    '## 🌊 波符位置',
    '',
    '你的出生波符是 **' + info.wave + '**，你在波符中处于第 **' + info.wavePos + '** 格（' + t.name + '调性），' + wavePosLabels[info.wavePos] + '。',
    '',
    '这代表你是这个波符的 **' + t.action.split('、')[0] + '者**——你为整个波符带来了"' + t.question + '"的能量。',
    '',
    '**在关系中的表现：**',
    t.inRelationships,
    '',
    '**在事业中的表现：**',
    t.inCareer,
    '',
    '**波符的13天旅程对你而言：**',
    '- **第1天（磁性）**：设定意图——你为接下来13天确定方向',
    '- **第2天（月亮）**：面对挑战——认识并整合对立面',
    '- **第3天（电力）**：主动服务——通过行动激活能量',
    '- **第4天（自我存在）**：建立形式——为能量找到结构',
    '- **第5天（超频）**：放射力量——展现你的核心',
    '- **第6天（韵律）**：寻求平衡——在变化中保持中心',
    '- **第7天（共振）**：成为通道——调和内外能量',
    '- **第8天（银河）**：整合完整——让信念与行动一致',
    '- **第9天（太阳）**：脉冲实现——推动事物显化',
    '- **第10天（行星）**：完美呈现——让成果落地',
    '- **第11天（光谱）**：释放放下——清空不再需要的',
    '- **第12天（水晶）**：奉献合作——与更大的整体连接',
    '- **第13天（宇宙）**：超越包容——完成循环，准备新生',
    ''
  ].join('\n');

  // 综合生命道路
  var summarySec = [
    '## 💫 综合生命道路',
    '',
    '你的生命道路是一段 **"' + t.name + s.name + '"** 的旅程——以**' + t.name + '调性**的动能驱动 **' + s.name + '图腾**的能量绽放。',
    '',
    '**你的五大力量为你织就了一幅独特的生命蓝图：**',
    '',
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:1.5rem 0">',
    '',
    '**🎯 命运** — ' + s.name + '（' + s.archetype + '）',
    '',
    trunc(s.talentDesc, 120),
    '',
    '**🌟 指引** — ' + gs.name + '（' + gs.archetype + '）' + (isSelfGuide ? '（自引导）' : ''),
    '',
    isSelfGuide ? '你不需要向外寻找方向，你的内心就是最高的导航。' : trunc(gs.talentDesc, 100),
    '',
    '**💪 支持** — ' + ss.name + '（' + ss.archetype + '）',
    '',
    trunc(ss.talentDesc, 100),
    '',
    '**⚡ 挑战** — ' + cs.name + '（' + cs.archetype + '）',
    '',
    trunc(cs.talentDesc, 100),
    '',
    '**🚀 推动** — ' + ds.name + '（' + ds.archetype + '）',
    '',
    trunc(ds.talentDesc, 100),
    '',
    '</div>',
    '',
    '在这个 **' + info.wave + '** 的生命旅途中，请记住：你的天赋不在于成为别人，而在于活出你自己独特的光芒。当五大力量在你的生命中和谐运作时，你就回到了真正的自己。',
    '',
    '---',
    '',
    '> *本解读由玛雅天赋计算引擎根据算法自动生成，基于 DreamSpell / 13月亮历体系。每个Kin的五大力量来自精确的数学关系，解读内容则源自20图腾×13调性的完整知识库。*',
    ''
  ].join('\n');

  return header + badge + '\n' + destinySec + '\n---\n' + guideSec + '\n---\n' + supportSec + '\n---\n' + challengeSec + '\n---\n' + driveSec + '\n---\n' + waveSec + '\n---\n' + summarySec;
}

// 主程序
var start = parseInt(process.argv[2] || 1);
var end = parseInt(process.argv[3] || 10);
var outDir = path.join(__dirname, 'content', 'kins');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive: true});

console.log('生成 Kin ' + start + ' 到 ' + end + '：\n');
for (var k = start; k <= end; k++) {
  var md = genKin(k);
  if (!md) { console.log('❌ Kin ' + k + ' 失败'); continue; }
  var fp = path.join(outDir, 'kin-' + k + '.md');
  fs.writeFileSync(fp, md, 'utf8');
  var sz = (Buffer.byteLength(md, 'utf8') / 1024).toFixed(1);
  console.log('✅ Kin ' + k + ' → kin-' + k + '.md (' + sz + 'KB)');
}
console.log('\n完成！共生成 ' + (end - start + 1) + ' 个文件。');
