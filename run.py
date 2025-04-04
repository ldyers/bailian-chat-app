import uvicorn
import socket

if __name__ == "__main__":
    # 获取本机主机名和IP地址
    hostname = socket.gethostname()
    ip_address = socket.gethostbyname(hostname)
    
    # 如果无法自动获取正确的IP，可以手动设置
    # ip_address = "192.168.1.102"  # 您的实际IP地址
    
    print(f"启动聊天应用服务器...")
    print(f"服务器主机名: {hostname}")
    print(f"服务器IP地址: {ip_address}")
    print(f"请在浏览器中访问: http://{ip_address}:8000")
    print(f"小程序中使用的API地址应为: http://{ip_address}:8000")
    
    # 使用特定IP地址启动服务
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)