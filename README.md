# zjubca.bounty
A decentralized bounty system powerd by EOS.

Design under [DApp Guide](https://github.com/Blockchain-zju/dapp-dev-guide).

# 1 需求分析
## 1.1 任务生命周期
* 认领期：悬赏发起方公布一项悬赏任务。赏金猎人可以在此阶段可以认领任务、无视任务、拒绝任务。认领任务后，可以选择立刻使任务进入执行期。
* 执行期：认领期结束后，任务自动进入执行期。赏金猎人需要在执行期内完成任务。完成任何后，可以选择立刻进入验收期。
* 验收期：执行期结束后，任务自动进入验收期。悬赏发起方验收完任务后，任务进入完成期。
* 完成：若悬赏发起方未在验收期内完成任务的验收，则将向赏金猎人支付违约金。

# 2 开发计划
## 2.1 前端：Web端
1. [x] 任务编辑功能
	* [x] 任务所有内容可编辑
2. [ ] 发布、验收、管理任务功能
    * [x] 发布
    * [ ] 验收
    * [ ] 管理
3. [ ] 其他细节
    * [x] 任务呈现部分的改进
    * [x] 任务状态的颜色需要随着状态的不同而变化：黄色、绿色、蓝色、黑色。
    * [ ] 把任务具体要求列表改成一个要求，里面自己写条目，用回车。
    * [ ] 展示任务参与者。
    * [ ] 把点赞按钮激活
4. [ ] 与区块链交互部分
    * [ ] 钱包、账户部分
    * [ ] 数据库部分
## 2.2 后端：智能合约
1. [ ] 测试环境
    * [ ] 测试账户、钱包设置
    * [ ] 测试网重启
2. [ ] Task合约
    * [ ] 关于权限的问题要解决，现在create一个task使用不匹配的权限会出问题。
  

## 2.3 开发过程日志
2019-2-18前略。

f-2.1:

2019-2-20： 修复了task无法修改内容的bug

2019-2-20： 明白了造成新建task点进去后无内容的原因。
```
var taskData = tasksJsonData.tasks[taskId-1];
tasks.js是从文件里读取的，所以失败。加上：task.js-137: 
```
2019-2-20： 大致完善了任务

2019-2-27： 加入筛选面板（功能未实现）

2019-2-28： 修改了程序内部属性名称；
            加入点踩图标（功能未实现）
            task智能合约框架完成（实现未开始编写）
接下去的计划：
智能合约完成：task合约单方面数据操作完成，完成sh脚本。
  => 前端：在task界面完成任务要求列表和参与者信息的变化。
  => 打通前后端任务数据的交互。
  => 前端：一些部分单独写成react组件。

"name": "bbs-router" ==> "zjubca-bounty",

WebSocket connection to 'wss://local.get-scatter.com:50006/socket.io/?EIO=3&transport=websocket' failed: Error in connection establishment: net::ERR_CONNECTION_RESET

WebSocket connection to 'ws://127.0.0.1:50005/socket.io/?EIO=3&transport=websocket' failed: Error in connection establishment: net::ERR_CONNECTION_REFUSED

Unchecked runtime.lastError: The message port closed before a response was received.

# 3 功能测试

(Remove Part 1 to 3 when finish developing.)

# 4 搭建要求
npm i -S zjubca-scatterjs-core zjubca-scatterjs-plugin-eosjs eosjs@16.0.9
npm i -S scatterjs-core scatterjs-plugin-eosjs

# 5 DApp网址
