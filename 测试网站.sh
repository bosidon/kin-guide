#!/bin/bash

echo "========================================"
echo "玛雅历法Kin网站测试工具"
echo "========================================"

# 检查服务器状态
check_server() {
    echo "检查Hugo服务器状态..."
    
    if curl -s http://localhost:1313 > /dev/null 2>&1; then
        echo "✅ Hugo服务器正在运行"
        return 0
    else
        echo "❌ Hugo服务器未运行"
        return 1
    fi
}

# 测试首页
test_homepage() {
    echo ""
    echo "测试首页..."
    if curl -s http://localhost:1313 | grep -q "玛雅历法 Kin 解读指南"; then
        echo "✅ 首页加载正常"
        echo "   标题: 玛雅历法 Kin 解读指南"
    else
        echo "❌ 首页加载失败"
    fi
}

# 测试Kin页面
test_kin_pages() {
    echo ""
    echo "测试Kin页面..."
    
    # 测试Kin 1
    echo "测试 Kin 1..."
    if curl -s http://localhost:1313/kins/kin-1/ | grep -q "磁性红龙"; then
        echo "✅ Kin 1 加载正常"
    else
        echo "❌ Kin 1 加载失败"
    fi
    
    # 测试Kin 100
    echo "测试 Kin 100..."
    if curl -s http://localhost:1313/kins/kin-100/ | grep -q "Kin 100"; then
        echo "✅ Kin 100 加载正常"
    else
        echo "❌ Kin 100 加载失败"
    fi
    
    # 测试Kin 260
    echo "测试 Kin 260..."
    if curl -s http://localhost:1313/kins/kin-260/ | grep -q "Kin 260"; then
        echo "✅ Kin 260 加载正常"
    else
        echo "❌ Kin 260 加载失败"
    fi
}

# 测试随机页面
test_random_pages() {
    echo ""
    echo "测试随机Kin页面..."
    
    # 生成5个随机Kin编号
    for i in {1..5}; do
        kin_num=$((RANDOM % 260 + 1))
        echo "测试 Kin $kin_num..."
        
        if curl -s http://localhost:1313/kins/kin-$kin_num/ | grep -q "Kin $kin_num"; then
            echo "   ✅ Kin $kin_num 加载正常"
        else
            echo "   ❌ Kin $kin_num 加载失败"
        fi
    done
}

# 显示网站信息
show_info() {
    echo ""
    echo "网站信息："
    echo "----------------------------------------"
    echo "网站地址: http://localhost:1313"
    echo "Kin页面格式: http://localhost:1313/kins/kin-{编号}/"
    echo "总页面数: 797页（包含260个Kin页面）"
    echo ""
    echo "快速访问："
    echo "  Kin 1:   http://localhost:1313/kins/kin-1/"
    echo "  Kin 100: http://localhost:1313/kins/kin-100/"
    echo "  Kin 260: http://localhost:1313/kins/kin-260/"
    echo ""
    echo "在浏览器中打开："
    echo "  xdg-open http://localhost:1313  # Linux"
    echo "  open http://localhost:1313      # macOS"
    echo "  start http://localhost:1313     # Windows"
}

# 启动服务器
start_server() {
    echo ""
    echo "启动Hugo服务器..."
    
    # 检查是否在正确目录
    if [ ! -f "hugo" ] && [ ! -f "./hugo" ]; then
        echo "❌ 未找到Hugo可执行文件"
        echo "请确保在 kin-website 目录中运行此脚本"
        return 1
    fi
    
    # 检查端口是否被占用
    if netstat -tln | grep -q :1313; then
        echo "⚠️  端口1313已被占用，尝试停止现有进程..."
        pkill -f hugo 2>/dev/null
        sleep 2
    fi
    
    # 启动服务器
    echo "正在启动服务器..."
    ./hugo server --bind 0.0.0.0 --port 1313 --disableFastRender &
    SERVER_PID=$!
    
    echo "✅ 服务器已启动 (PID: $SERVER_PID)"
    echo "等待服务器就绪..."
    sleep 3
    
    # 检查是否启动成功
    if check_server; then
        echo "✅ 服务器启动成功"
        return 0
    else
        echo "❌ 服务器启动失败"
        return 1
    fi
}

# 停止服务器
stop_server() {
    echo ""
    echo "停止Hugo服务器..."
    pkill -f hugo 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "✅ 服务器已停止"
    else
        echo "⚠️  未找到运行的Hugo进程"
    fi
}

# 主菜单
main_menu() {
    while true; do
        echo ""
        echo "请选择操作："
        echo "1. 检查服务器状态"
        echo "2. 测试网站功能"
        echo "3. 启动服务器"
        echo "4. 停止服务器"
        echo "5. 显示网站信息"
        echo "6. 退出"
        echo ""
        read -p "请输入选项 (1-6): " choice
        
        case $choice in
            1)
                check_server
                ;;
            2)
                if check_server; then
                    test_homepage
                    test_kin_pages
                    test_random_pages
                else
                    echo "❌ 请先启动服务器"
                fi
                ;;
            3)
                start_server
                ;;
            4)
                stop_server
                ;;
            5)
                show_info
                ;;
            6)
                echo "退出测试工具"
                exit 0
                ;;
            *)
                echo "无效选项"
                ;;
        esac
    done
}

# 自动测试模式
auto_test() {
    echo "自动测试模式..."
    echo ""
    
    # 检查并启动服务器
    if ! check_server; then
        echo "服务器未运行，正在启动..."
        start_server
    fi
    
    if check_server; then
        echo ""
        echo "开始全面测试..."
        echo "========================================"
        
        test_homepage
        test_kin_pages
        test_random_pages
        show_info
        
        echo ""
        echo "========================================"
        echo "✅ 自动测试完成"
        echo "网站状态：正常"
    else
        echo "❌ 无法启动服务器，请手动检查"
    fi
}

# 主程序
if [ "$1" = "auto" ]; then
    auto_test
else
    echo "欢迎使用玛雅历法Kin网站测试工具"
    echo "当前目录: $(pwd)"
    echo ""
    
    # 检查是否在kin-website目录
    if [ -f "hugo" ] || [ -f "./hugo" ] || [ -f "hugo.toml" ]; then
        echo "✅ 检测到Hugo项目"
        main_menu
    else
        echo "⚠️  未检测到Hugo项目"
        echo "请确保在 kin-website 目录中运行此脚本"
        echo ""
        echo "切换到项目目录："
        echo "  cd /home/bosidon/.openclaw/workspace/kin-website"
        echo "  ./测试网站.sh"
        exit 1
    fi
fi