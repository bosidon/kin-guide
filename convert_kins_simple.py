#!/usr/bin/env python3
import os
import re
import yaml

# 源文件目录和目标目录
source_dir = "/home/bosidon/.openclaw/workspace/kin_files_enhanced"
target_dir = "/home/bosidon/.openclaw/workspace/kin-website/content/kins"

# 确保目标目录存在
os.makedirs(target_dir, exist_ok=True)

# Kin 名称映射（从文件名提取）
def extract_kin_info(filename):
    """从文件名提取 Kin 编号和名称"""
    match = re.match(r'(\d{3})(.*?)_增强版\.md', filename)
    if match:
        kin_num = int(match.group(1))
        kin_name = match.group(2).strip()
        return kin_num, kin_name
    return None, None

# 处理所有 Kin 文件
processed = 0
errors = []

for filename in sorted(os.listdir(source_dir)):
    if filename.endswith('_增强版.md'):
        kin_num, kin_name = extract_kin_info(filename)
        if kin_num is None:
            errors.append(f"无法解析文件名: {filename}")
            continue
        
        source_path = os.path.join(source_dir, filename)
        target_filename = f"kin-{kin_num}.md"
        target_path = os.path.join(target_dir, target_filename)
        
        try:
            # 读取源文件内容
            with open(source_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 提取标题（第一行通常是标题）
            lines = content.split('\n')
            title = lines[0].replace('#', '').strip() if lines else f"Kin {kin_num}"
            
            # 创建 frontmatter
            frontmatter_data = {
                'title': title,
                'date': '2026-03-16',
                'kin_number': kin_num,
                'kin_name': kin_name,
                'draft': False,
                'categories': ['玛雅历法', 'Kin解读'],
                'tags': [f'Kin{kin_num}', '玛雅历法', '灵性成长'],
                'weight': kin_num,
            }
            
            # 写入新文件
            with open(target_path, 'w', encoding='utf-8') as f:
                # 写入 frontmatter
                f.write('---\n')
                yaml.dump(frontmatter_data, f, allow_unicode=True, default_flow_style=False)
                f.write('---\n\n')
                # 写入内容
                f.write(content)
            
            processed += 1
            print(f"✓ 转换: {filename} -> {target_filename}")
            
        except Exception as e:
            errors.append(f"处理 {filename} 时出错: {str(e)}")

print(f"\n✅ 转换完成!")
print(f"处理文件数: {processed}")
print(f"错误数: {len(errors)}")

if errors:
    print("\n❌ 错误列表:")
    for error in errors:
        print(f"  - {error}")

# 创建索引文件
index_path = os.path.join(target_dir, "_index.md")
with open(index_path, 'w', encoding='utf-8') as f:
    f.write("""---
title: "Kin 目录"
type: "kins"
layout: "kins"
---

这里是所有 260 个玛雅历法 Kin 的完整目录。每个 Kin 都包含详细的能量解读、调性分析、印记意义和灵性实践建议。
""")

print(f"\n📁 创建索引文件: {index_path}")