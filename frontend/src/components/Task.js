import React, { Component } from "react";
import TaskEditor from "./TaskEditor";
import TaskView from "./TaskView";
import RequireList from "./RequireList";
// import { get, put, post } from "../utils/request";
// import url from "../utils/url";
import {pushAction} from "../service/EosCommFun"
import EosComm from "../service/EosComm"
import "./css/Task.css";
import tasksJsonData  from "../testdata.json";
import loading from "../images/loading1.gif";

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      task: null,
      requires: [],
      editing: false
    };
    this.handleEditClick = this.handleEditClick.bind(this);
    // this.handleRequireSubmit = this.handleRequireSubmit.bind(this);
    this.handleTaskSave = this.handleTaskSave.bind(this);
    this.handleTaskCancel = this.handleTaskCancel.bind(this);
    // this.refreshRequires = this.refreshRequires.bind(this);
    this.refreshTask = this.refreshTask.bind(this);
    this.handleLikeClick = this.handleLikeClick.bind(this);
    this.handleHateClick = this.handleHateClick.bind(this);
    this.eoscomm = new EosComm();
  }

  componentDidMount() {
    this.refreshTask();
    // this.refreshRequires();
  }

  // 获取帖子详情
  refreshTask() {
    const taskId = this.props.match.params.id;
    // var taskData = tasksJsonData.tasks[taskId-1]; 
    let loginAlert = false;
    this.eoscomm.connectAndLogin(loginAlert).then(loginAccount=>{
      this.eoscomm.pushAction("selectatask",{author:loginAccount.name,task_id:taskId}).then(task =>{
        this.setState({
          task: task
        });
      });
    });
  }

  // const account_name author, uint64_t task_id, string& likevote, string& hatevote
  handleLikeClick(){
    const taskId = this.props.match.params.id;
    let loginAlert = false;
    let likes = parseInt(this.state.task.likevote) + 1 ;
    let hates = parseInt(this.state.task.hatevote) ;
    this.eoscomm.connectAndLogin(loginAlert).then(loginAccount=>{
      this.eoscomm.pushAction("updatevotes",{author:loginAccount.name, task_id:taskId,
        likevote:likes, hatevote:hates}).then(returndata =>{
          console.log("3.Update vote data:",returndata);
          this.refreshTask();
      });
    });
  }

  handleHateClick(){
    const taskId = this.props.match.params.id;
    let loginAlert = false;
    let likes = parseInt(this.state.task.likevote) ;
    let hates = parseInt(this.state.task.hatevote) + 1 ;
    this.eoscomm.connectAndLogin(loginAlert).then(loginAccount=>{
      this.eoscomm.pushAction("updatevotes",{author:loginAccount.name, task_id:taskId,
        likevote:likes, hatevote:hates}).then(returndata =>{
          console.log("3.Update vote data:",returndata);
          this.refreshTask();
      });
    });
  }
  
  // handleHateClick(){
    
  // }

  // 让任务处于编辑态
  handleEditClick() {
    this.setState({
      editing: true
    });
  }

  // 保存编辑的任务
  handleTaskSave(data) {
    const id = this.props.match.params.id;
    this.saveTask(id, data);
  }

  // 取消编辑任务
  handleTaskCancel() {
    this.setState({
      editing: false
    });
  }

  

  // const account_name author, uint64_t id, string& title, string& description, string& rolenumbers, 
  //   string& reward, string& pledge, string& updatedat, string& requires

  // 同步任务的修改到服务器
  saveTask(id, data) {
    let loginAlert = false;
    this.eoscomm.connectAndLogin(loginAlert).then(loginAccount=>{
      this.eoscomm.pushAction("update",
      { author: loginAccount.name,
        id: id,//
        // authorname: data.author.userName,
        title: data.title,
        status: data.status,
        rolenumbers: data.rolenumbers,
        reward: data.reward,
        pledge: data.pledge,
        updatedat: data.updatedat,
        requires: data.requires,
        // likevote: data.likevote,
        // hatevote: data.hatevote,
        description: data.description
    }).then(returndata =>{//"selectatask",{author:loginAccount.name,task_id:6}
        console.log("3.Update task data:",returndata);
        this.setState({
          editing: false
        });
        this.refreshTask();
      });
    });

  }

  render() {
    const { task, requires, editing } = this.state;
    const { userName } = this.props; //??? userId,
    // console.log("render task:",task);
    // console.log("render task.author:",task.author);
    if (!task) {
      let ingStyle = {
        height: '650px',
        fontSize: '20px'
        // text-align: "center"
      }
      return (
        <div style={ingStyle}>
          <br/>
            <div className="textCenter">
              <div>
                正在向区块链节点请求数据...<br/>
                如果本页面持续时间过长，请刷新页面。若刷新无果则说明网络故障或者Scatter登录失败。
              </div>
              <span>
                <img alt="loading" src={loading} />
              </span>
            </div>
          <br/>
        </div>
      );
    }
    // const editable = userId == task.author.id;  //===
    const editable = userName == task.author.username;
    return (
      <div className="task">

        {/* 在React中直接输出一个Object会导致：Objects are not valid as a React child  */}
        {/* <div>{task}</div> */}
        {/* <div>{task.author}</div> */}

        {editing ? (
          <TaskEditor
            task={task}
            onSave={this.handleTaskSave}
            onCancel={this.handleTaskCancel}
            //userId={userId}
            userName={userName}
          />
        ) : (
          <TaskView
            task={task}
            editable={editable}
            onEditClick={this.handleEditClick}
            onLikeClick={this.handleLikeClick}
            onHateClick={this.handleHateClick}
          />
        )}
        <div className="requireList">
          <div>
            任务具体要求：
          </div>
          {task.requires}
        </div>
        {/* <RequireList
          requires={requires}
          editable={Boolean(userId)}
          onSubmit={this.handleRequireSubmit}
        /> */}
      </div>
    );
  }
}

export default Task;
