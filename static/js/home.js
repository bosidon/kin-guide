(function() {
    'use strict';
    var COLORS = ['#D32F2F','#ECEFF1','#1976D2','#FBC02D','#C62828','#B0BEC5','#1565C0','#F9A825','#E53935','#CFD8DC','#1E88E5','#FDD835','#EF5350','#90A4AE','#42A5F5','#FFEE58','#FF7043','#BDBDBD','#29B6F6','#FFD600'];

    function waitForEngine(cb) {
        if (typeof MayaKin !== 'undefined' && typeof KinInterpretations !== 'undefined') { cb(); }
        else { setTimeout(function() { waitForEngine(cb); }, 200); }
    }

    waitForEngine(function() {
        // ===== 今日能量 =====
        try {
            var d = new Date();
            var months = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
            document.getElementById('tbDate').textContent = months[d.getMonth()] + ' ' + d.getDate() + '日';

            var ds = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
            var k = MayaKin.calculateKin(ds);
            var info = MayaKin.getKinInfo(k);
            var s = KinInterpretations.getSeal(info.seal.id);
            var t = KinInterpretations.getTone(info.tone.id);

            var body = document.getElementById('tbBody');
            body.innerHTML =
                '<div class="tb-main">' +
                '<span class="num">Kin ' + k + '</span>' +
                '<span class="name">' + info.name + '</span>' +
                '</div>' +
                '<div class="tb-cards">' +
                '<div class="tb-card seal">' +
                '<div class="tc-label">🎨 图腾 · ' + s.name + '</div>' +
                '<div class="tc-name">' + s.archetype + '</div>' +
                '<div class="tc-desc">' + s.essence + '</div>' +
                '</div>' +
                '<div class="tb-card tone">' +
                '<div class="tc-label">🌀 调性 · ' + t.name + '</div>' +
                '<div class="tc-name">' + t.question + '</div>' +
                '<div class="tc-desc">' + t.essence + '</div>' +
                '</div>' +
                '</div>';
        } catch(err) { console.log('今日能量加载失败'); }

        // ===== 出生日期计算器 =====
        var inp = document.getElementById('birthDate');
        var btn = document.getElementById('calcKinBtn');
        var area = document.getElementById('resultArea');

        var d = new Date();
        inp.value = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');

        function doCalc() {
            var ds = inp.value;
            if (!ds) { showError('请选择出生日期'); return; }
            try {
                var k = MayaKin.calculateKin(ds);
                var info = MayaKin.getKinInfo(k);
                var s = KinInterpretations.getSeal(info.seal.id);
                var t = KinInterpretations.getTone(info.tone.id);
                var c = COLORS[(info.seal.id - 1) % 20];

                var powers = [
                    {ic:'🌟',lb:'指引',k:info.relations.guide},
                    {ic:'💪',lb:'支持',k:info.relations.support},
                    {ic:'⚡',lb:'挑战',k:info.relations.challenge},
                    {ic:'🚀',lb:'推动',k:info.relations.drive}
                ];
                var dets = '';
                dets += '<div class="it"><div class="lb">🎨 原型</div><div class="vl">' + s.archetype + '</div></div>';
                dets += '<div class="it"><div class="lb">🌀 调性</div><div class="vl">' + t.name + ' · ' + t.action + '</div></div>';
                dets += '<div class="it"><div class="lb">🌊 波符</div><div class="vl">' + info.wave + ' 第' + info.wavePos + '格</div></div>';
                dets += '<div class="it"><div class="lb">🎯 元素</div><div class="vl">' + s.element + ' · ' + s.earthFamily + '</div></div>';
                powers.forEach(function(p) {
                    var pi = MayaKin.getKinInfo(p.k);
                    dets += '<div class="it"><div class="lb">' + p.ic + ' ' + p.lb + '</div><div class="vl">' + pi.name + '</div></div>';
                });

                area.innerHTML =
                    '<div class="result-card">' +
                    '<div class="result-top">' +
                    '<div class="result-badge" style="background:linear-gradient(135deg,' + c + ',' + c + '88)">' +
                    '<div class="num">' + k + '</div>' +
                    '<div class="name">' + info.name + '</div>' +
                    '</div>' +
                    '<div class="result-meta">' +
                    '<div class="rn">' + info.name + '</div>' +
                    '<div class="sub">' + t.question + ' · ' + info.wave + ' 第' + info.wavePos + '格</div>' +
                    '<div class="archetype">' + s.archetype + '</div>' +
                    '</div></div>' +
                    '<div class="result-det">' + dets + '</div>' +
                    '<div class="result-actions">' +
                    '<a href="/kin-guide/kins/kin-' + k + '/" class="pa">查看完整解读 →</a>' +
                    '<a href="/learn/" class="sa">📖 走进玛雅</a>' +
                    '</div></div>';
                area.style.display = 'block';
                area.scrollIntoView({behavior:'smooth',block:'center'});
            } catch(err) { showError('计算失败: ' + err.message); }
        }
        function showError(msg) {
            area.innerHTML = '<div class="result-error">' + msg + '</div>';
            area.style.display = 'block';
        }

        btn.addEventListener('click', doCalc);
        inp.addEventListener('keypress', function(e) { if (e.key === 'Enter') doCalc(); });

        // ===== Kin编号快捷跳转 =====
        var kinInput = document.getElementById('kinInput');
        var kinBtn = document.getElementById('kinGoBtn');
        if (kinBtn && kinInput) {
            function goKin() {
                var v = parseInt(kinInput.value);
                if (v >= 1 && v <= 260) { window.location.href = '/kin-guide/kins/kin-' + v + '/'; }
                else { showError('请输入 1-260 之间的Kin编号'); }
            }
            kinBtn.addEventListener('click', goKin);
            kinInput.addEventListener('keypress', function(e) { if (e.key === 'Enter') goKin(); });
        }
    });
})();
