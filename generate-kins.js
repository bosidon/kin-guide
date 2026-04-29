// 生成Kin解读文件脚本
// usage: node generate-kins.js [start] [end]
const fs = require('fs');
const path = require('path');

// 加载引擎
const mayaCode = fs.readFileSync(path.join(__dirname, 'static/js/maya_calculator.js'), 'utf8');
const interpCode = fs.readFileSync(path.join(__dirname, 'static/js/kin-interpretations.js'), 'utf8');
eval(mayaCode);
eval(interpCode);

const KIN_COLORS = ['#D32F2F','#ECEFF1','#1976D2','#FBC02D','#C62828','#B0BEC5','#1565C0','#F9A825','#E53935','#CFD8DC','#1E88E5','#FDD835','#EF5350','#90A4AE','#42A5F5','#FFEE58','#FF7043','#BDBDBD','#29B6F6','#FFD600'];

function trunc(s, n) { return !s || s.length <= n ? s : s.substring(0, n) + '...'; }

function gen(k) {
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
  var isSelf = (info.relations.guide === k);
  var color = KIN_COLORS[(info.seal.id - 1) % 20];

  var wd = ['','是你的波符起点','是波符的第二阶段，面对挑战','是波符的第三阶段，主动服务','是波符的第四阶段，建立形式','是波符的第五阶段，放射力量','是波符的第六阶段，寻求平衡','是波符的第七阶段，成为通道','是波符的第八阶段，整合完整','是波符的第九阶段，脉冲实现','是波符的第十阶段，完美显化','是波符的第十一阶段，释放放下','是波符的第十二阶段，奉献合作','是波符的第十三阶段，超越包容'][info.wavePos] || '';

  return [
    '---',
    'categories:',
    '- 玛雅历法',
    '- Kin解读',
    'date: "2026-04-29"',
    'draft: false',
    'kin_name: "' + info.name + '"',
    'kin_number: ' + k,
    'tags:',
    '- Kin' + k,
    'title: "' + info.name + ' · Kin ' + k + ' — 五大力量解读"',
    'weight: ' + k,
    'description: "' + info.name + '（Kin ' + k + '）的五大力量完整解读：' + s.archetype + '，' + t.question + '"',
    '---',
    '',
    '<div style="text-align:center;margin-bottom:1.5rem;padding:1rem;background:linear-gradient(135deg,' + color + '15,' + color + '05);border-radius:16px;border:1px solid ' + color + '30">',
    '<span style="font-size:3rem;font-weight:800;color:' + color + '">' + k + '</span>',
    '<div style="font-size:1.4rem;font-weight:600;margin:0.3rem 0;color:' + color + '">' + info.name + '</div>',
    '<div style="font-size:0.95rem;color:#888">🎨 ' + s.archetype + ' · 🌀 ' + t.action + ' · ❓ ' + t.question + ' · 🌊 ' + info.wave + ' 第' + info.wavePos + '格</div>',
    '</div>',
    '',
    '## 🎯 命运力量（中心）',
    '',
    '**' + info.name + ' · Kin ' + k + '**',
    '',
    s.essence,
    '',
    trunc(s.talentDesc, 280),
    '',
    '**原型**：' + s.archetype,
    '**关键词**：' + s.keywords.join('、'),
    '**元素**：' + s.element + ' · **地球家族**：' + s.earthFamily,
    '',
    '> 你的核心问题：**' + t.question + '**',
    '> 调性力量：**' + t.action + '** — ' + t.power,
    '> ' + t.essence,
    '',
    '---',
    '',
    '## 🌟 指引力量（上方）',
    '',
    '**' + gi.name + ' · Kin ' + info.relations.guide + '**',
    '',
    gs.essence,
    '',
    trunc(gs.talentDesc, 250),
    '',
    '**原型**：' + gs.archetype,
    '**关键词**：' + gs.keywords.join('、'),
    isSelf ? '' : '',
    isSelf ? '> **✦ 自引导**：你的内在就是最高导航，无需向外寻找方向。' : '',
    '',
    '---',
    '',
    '## 💪 支持力量（右方）',
    '',
    '**' + si.name + ' · Kin ' + info.relations.support + '**',
    '',
    ss.essence,
    '',
    trunc(ss.talentDesc, 250),
    '',
    '**原型**：' + ss.archetype,
    '**关键词**：' + ss.keywords.join('、'),
    '',
    '---',
    '',
    '## ⚡ 挑战力量（左方）',
    '',
    '**' + ci.name + ' · Kin ' + info.relations.challenge + '**',
    '',
    cs.essence,
    '',
    trunc(cs.talentDesc, 250),
    '',
    '**原型**：' + cs.archetype,
    '**关键词**：' + cs.keywords.join('、'),
    '',
    '---',
    '',
    '## 🚀 推动力量（下方）',
    '',
    '**' + di.name + ' · Kin ' + info.relations.drive + '**',
    '',
    ds.essence,
    '',
    trunc(ds.talentDesc, 250),
    '',
    '**原型**：' + ds.archetype,
    '**关键词**：' + ds.keywords.join('、'),
    '',
    '---',
    '',
    '## 🌊 波符位置',
    '',
    '你的出生波符是 **' + info.wave + '**，你在波符中位于第 **' + info.wavePos + '** 格（' + t.name + '调性）。',
    '',
    wd + '。整个波符的能量主题围绕 **"' + info.wave.replace('波','') + '"** 展开。',
    '',
    t.inCareer,
    '',
    t.inRelationships,
    '',
    '---',
    '',
    '## 💫 综合生命道路',
    '',
    '你带着 **' + s.name + '（' + s.archetype + '）** 的能量而来，以 **' + t.name + '（' + t.question + '）** 的动能展开此生。',
    '',
    '- 🎯 **命运**：' + trunc(s.talentDesc, 100),
    '- 🌟 **指引**：' + gs.archetype + (isSelf ? '（自引导）' : '—' + trunc(gs.talentDesc, 80)),
    '- 💪 **支持**：' + gs.archetype + '—' + trunc(ss.talentDesc, 80),
    '- ⚡ **挑战**：' + cs.archetype + '—' + trunc(cs.talentDesc, 80),
    '- 🚀 **推动**：' + ds.archetype + '—' + trunc(ds.talentDesc, 80),
    '',
    '在这个 **' + info.wave + '** 的生命旅途中，请记住：你的力量不在模仿别人，而在于活出你自己独特的光芒。',
    '',
    '---',
    '',
    '> *本解读由玛雅天赋计算引擎根据算法自动生成，基于 DreamSpell/13月亮历体系。*',
    ''
  ].join('\n');
}

var start = parseInt(process.argv[2] || 1);
var end = parseInt(process.argv[3] || 10);
var outDir = path.join(__dirname, 'content', 'kins');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive: true});

console.log('生成 Kin ' + start + ' 到 ' + end + '：\n');
for (var k = start; k <= end; k++) {
  var md = gen(k);
  if (!md) { console.log('❌ Kin', k, '失败'); continue; }
  var fp = path.join(outDir, 'kin-' + k + '.md');
  fs.writeFileSync(fp, md, 'utf8');
  var sz = (Buffer.byteLength(md, 'utf8') / 1024).toFixed(1);
  console.log('✅ Kin ' + k + ' → kin-' + k + '.md (' + sz + 'KB)');
}
console.log('\n完成！共生成 ' + (end - start + 1) + ' 个文件。');
