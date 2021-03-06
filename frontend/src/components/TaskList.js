import React, { Component } from "react";
import TasksView from "./TasksView";
import TaskEditor from "./TaskEditor";
import TaskFilter from "./TaskFilter";
// import EOSIOClient from "../ScatterExample/eosio-client"
import EosComm from "../service/EosComm"
// import EosService from "../service/EosCommService"
// import {connect,login, scatterlogin,showinfo,pushAction,pushaction} from "../service/EosCommFun"
import "./css/TaskList.css";
// import jsonData  from "../testdata.json"
import loading from "../images/loading1.gif";

class TaskList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      newTask: false,
      loading: true,
      taskLengthOfAll : 0
    };
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleNewTask = this.handleNewTask.bind(this);
    this.refreshTaskList = this.refreshTaskList.bind(this);
    this.handleFilterClick = this.handleFilterClick.bind(this);
    this.eoscomm = new EosComm();
    // this.getTaskList = this.getTaskList.bind(this);
  }

  componentDidMount() {
    this.refreshTaskList();
  }

  // 获取任务列表
  refreshTaskList(){
    // let eoscomm = new EosComm();
    this.eoscomm.connectAndLogin().then(loginAccount=>{
      // sessionStorage.setItem("userId",this.userNameToId(loginAccount.name));
      sessionStorage.setItem("userName",loginAccount.name);

      this.eoscomm.fetchData('zjubcatask11','zjubcatask11','task').then(rowsdata=>{
        console.log("tasks",rowsdata);
        this.setState({
          tasks: rowsdata, //jsonData.tasks
          newTask: false,
          loading: false,
        });
        this.setState({
          taskLengthOfAll: this.state.tasks[this.state.tasks.length-1].id
        });

      });
      // this.eoscomm.pushAction("selectitems",{author:loginAccount.name,filter:"*",judge:"*",value:"*"}).then(tasks =>{//"selectatask",{author:loginAccount.name,task_id:6}
        
      //   this.setState({
      //     tasks: tasks.tasks, //jsonData.tasks
      //     newTask: false,
      //     loading: false,
      //   });
      //   this.setState({
      //     taskLengthOfAll: this.state.tasks[this.state.tasks.length-1].id
      //   });

      // });
    });
  }

  // 保存任务
  handleSave(data) {
    //为什么能直接得到帖子的data？看在被包装组件中，此被调用的实例
    // 当前登录用户的信息和默认的点赞数，同帖子的标题和内容，共同构成最终待保存的帖子对象
    // let eoscomm = new EosComm();
    this.eoscomm.connectAndLogin(false).then(loginAccount=>{
      this.eoscomm.pushAction("create",
      { author: loginAccount.name,
        id: data.id,//
        authorname: data.author.userName,
        //authorid: data.author.id,
        title: data.title,
        status: data.status,
        rolenumbers: data.rolenumbers,
        reward: data.reward,
        pledge: data.pledge,
        updatedat: data.updatedat,
        requires: data.requires,
        likevote: data.likevote,
        hatevote: data.hatevote,
        description: data.description
    }).then(returndata =>{//"selectatask",{author:loginAccount.name,task_id:6}
        console.log("3.Create new task data:",returndata);
        this.refreshTaskList();
      });
    });
  }
  
  // 取消新建任务
  handleCancel() {
    this.setState({
      newTask: false
    });
  }
  
  // 新建任务
  handleNewTask() {
    this.setState({
      newTask: true
    });
  }

  //处理任务筛选
  handleFilterClick(filterPara){
    this.eoscomm.connectAndLogin(false).then(loginAccount=>{
      this.eoscomm.pushAction("selectitems",
      { author:loginAccount.name, filter:filterPara.filter, judge:filterPara.judge, value:filterPara.filterValue }
      ).then(tasks => {
        this.setState({
          tasks: tasks.tasks, //jsonData.tasks
          newTask: false,
          loading: false
        });
      });
    });
  }

  render() {
    const { userName } = this.props;//userId,
    // const taskLengthOfAll = this.state.tasks[this.state.tasks.length-1].id;

    return (
      <div>
        {/* <EosComm /> */}
        <div id="header_wrap" className="outer">
          <div className="inner">
            <h1 id="project_title">赏金猎人</h1>
            <h2 id="project_tagline">ZJUBCA.Bounty</h2>
          </div>
        </div>

        <br/>

        <TaskFilter
        onFilterClick={this.handleFilterClick}
        />
        
        <div className="taskList">
          <div> 
            {/* 只有在登录状态，才显示发帖按钮 */}
            <br/>
            目前区块链上共存有{this.state.taskLengthOfAll}个悬赏任务。&nbsp;&nbsp;&nbsp;&nbsp;
            {userName ? <button onClick={this.handleNewTask}>发布任务悬赏</button> : null}
          </div>

          {/* 若当前正在创建新帖子，则渲染TaskEditor组件 */}
          {this.state.loading ? (
            <div className="textCenter">
              <span>
                <img alt="loading" src={loading} />
              </span>
              <div>
                正在请求数据...<br/>
                如果本页面持续时间过长，请刷新页面。若刷新无果则说明网络故障或者Scatter登录失败。
              </div>
            </div>
          ):null}

          {this.state.newTask ? (
            <TaskEditor 
            onSave={this.handleSave} 
            onCancel={this.handleCancel} 
            //userId={userId} 
            userName={userName}
            currentTaskLength={this.state.taskLengthOfAll}
            />
          ) : null}
          {/* TasksView显示帖子的列表数据 */}
          <TasksView tasks={this.state.tasks} />
        </div>
      </div>
    );
  }
}

export default TaskList;