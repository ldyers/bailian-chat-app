import os
from http import HTTPStatus
from dashscope import Application

# 手动设置环境变量
#os.environ["DASHSCOPE_API_KEY"] = "sk-015edf443c1c404399ebd1ed434041a8"

# 调试信息：打印所有环境变量
# print("所有环境变量：")
# for key, value in os.environ.items():
#     if 'API' in key:
#         print(f"{key} = {value}")

# # 特别打印 DASHSCOPE_API_KEY
# print("\nDASHSCOPE_API_KEY 的值：")
# print(os.getenv("DASHSCOPE_API_KEY"))

# response = Application.call(
#     api_key=os.getenv("DASHSCOPE_API_KEY"),  # 现在应该能够正确获取到 API key
#     app_id='59ae06eb30b94db5bafa368d89afa65a',# 替换为实际的应用 ID
#     prompt='你是谁？')

# if response.status_code != HTTPStatus.OK:
#     print(f'request_id={response.request_id}')
#     print(f'code={response.status_code}')
#     print(f'message={response.message}')
#     print(f'请参考文档：https://help.aliyun.com/zh/model-studio/developer-reference/error-code')
# else:
#     print(response.output.text)

# 多轮对话

import os
from http import HTTPStatus
from dashscope import Application
def call_with_session():
    response = Application.call(
        # 若没有配置环境变量，可用百炼API Key将下行替换为：api_key="sk-xxx"。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
        api_key=os.getenv("DASHSCOPE_API_KEY"),
        app_id='30447f00c7e742d8af5d389797972c5a',  # 替换为实际的应用 ID
        prompt='你是谁？')

    if response.status_code != HTTPStatus.OK:
        print(f'request_id={response.request_id}')
        print(f'code={response.status_code}')
        print(f'message={response.message}')
        print(f'请参考文档：https://help.aliyun.com/zh/model-studio/developer-reference/error-code')
        return response

    responseNext = Application.call(
                # 若没有配置环境变量，可用百炼API Key将下行替换为：api_key="sk-xxx"。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
                api_key=os.getenv("DASHSCOPE_API_KEY"),
                app_id='30447f00c7e742d8af5d389797972c5a',  # 替换为实际的应用 ID
                prompt='水晶的选购技巧？',
                session_id=response.output.session_id)  # 上一轮response的session_id

    if responseNext.status_code != HTTPStatus.OK:
        print(f'request_id={responseNext.request_id}')
        print(f'code={responseNext.status_code}')
        print(f'message={responseNext.message}')
        print(f'请参考文档：https://help.aliyun.com/zh/model-studio/developer-reference/error-code')
    else:
        print('%s\n session_id=%s\n' % (responseNext.output.text, responseNext.output.session_id))
        # print('%s\n' % (response.usage))

if __name__ == '__main__':
    call_with_session()