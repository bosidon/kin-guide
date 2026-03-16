# Kin Guide 快速开始指南

## 本地开发

### 1. 启动开发服务器
```bash
cd /home/bosidon/.openclaw/workspace/kin-website
./hugo server -D --bind 0.0.0.0 --port 1313
```

访问: http://localhost:1313/kin-guide/

### 2. 构建生产版本
```bash
./hugo --minify
```

输出目录: `public/`

### 3. 查看构建的网站
```bash
cd public
python3 -m http.server 8080
```

访问: http://localhost:8080

## 部署到 GitHub Pages

### 1. 初始化 Git 仓库
```bash
git init
git add .
git commit -m "初始提交: Kin Guide 网站"
git branch -M main
```

### 2. 连接到 GitHub
```bash
git remote add origin https://github.com/你的用户名/kin-guide.git
git push -u origin main
```

### 3. 启用 GitHub Pages
1. 访问 https://github.com/你的用户名/kin-guide
2. 点击 Settings → Pages
3. 源选择: GitHub Actions
4. 保存设置

### 4. 等待部署完成
GitHub Actions 会自动构建并部署到:
`https://你的用户名.github.io/kin-guide/`

## 文件结构

```
kin-website/
├── hugo.toml              # 配置文件
├── content/kins/          # 260个Kin页面
│   ├── kin-1.md
│   ├── kin-2.md
│   └── ...
├── layouts/              # 模板文件
│   ├── index.html       # 首页
│   └── _default/        # 默认模板
├── static/              # 静态资源
│   └── css/style.css   # 样式文件
├── public/              # 构建输出（自动生成）
└── hugo                # Hugo 可执行文件
```

## 编辑内容

### 修改 Kin 页面
编辑: `content/kins/kin-xxx.md`

### 修改样式
编辑: `static/css/style.css`

### 修改布局
编辑: `layouts/` 目录下的模板文件

### 修改配置
编辑: `hugo.toml`

## 常用命令

```bash
# 开发模式（热重载）
./hugo server -D

# 构建生产版本
./hugo --minify

# 清理构建缓存
rm -rf public resources

# 查看帮助
./hugo help
```

## 故障排除

### 问题: 页面不更新
```bash
rm -rf public resources
./hugo server -D --disableFastRender
```

### 问题: 样式不生效
检查浏览器缓存，或强制刷新: Ctrl+F5

### 问题: 构建错误
检查 Hugo 版本: `./hugo version`
确保所有必要的布局文件存在

## 性能优化

### 启用压缩
```bash
./hugo --minify
```

### 清理未使用的文件
```bash
./hugo --gc
```

### 构建时排除草稿
移除 `-D` 参数

## 扩展功能

### 添加搜索
1. 创建搜索索引: `content/search.md`
2. 添加搜索脚本: `static/js/search.js`
3. 更新布局文件

### 添加评论系统
集成 Disqus 或 Giscus

### 添加分析
添加 Google Analytics 或 Plausible

---

**提示**: 网站已完全配置好，只需推送到 GitHub 即可上线！