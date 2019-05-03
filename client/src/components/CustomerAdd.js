import React ,{Component} from 'react';//React 는 객체, Component 는 멤버(라이브러리)
import {post} from 'axios';


class CustomerAdd extends Component{

    constructor(props){
        super(props);
        this.state = {
            file:null,
            userName:'',
            birthday:'',
            gender:'',
            job:'',
            fileName:''
        }
    }
    handleFormSubmit = (e) => {
        e.preventDefault()
        this.addCustomer()
        .then((response)=>{
            console.log(response.data)
        })
    }

    handleFileChange = (e) => {
        this.setState({
            file:e.target.files[0],
            fileName:e.target.value
        })
    }

    handleValueChange = (e) => {
        let nextState = {};
        nextState[e.target.name]=e.target.value;
        this.setState(nextState);
    }
    addCustomer = () =>{
        const url = '/api/customers';
        const formData = new FormData();
        formData.append('image', this.state.file);
        formData.append('name', this.state.name);
        formData.append('birthday', this.state.birthday);
        formData.append('gender', this.state.gender);
        formData.append('job', this.state.job);
        //전송할 데이터에 파일이 있으면 웹표준에 맞는 headers 를 설정해줘야~
        const config = {
            headers:{
                'content-type' : 'multipart/form-data'
            }
        }
        return post(url, formData, config);
    }
    render(){
        return(
            //input 테그가 있으면 상태변화감지를 위해 onChange함수 handle~ 가 있는거임
            <form onSubmit={this.handleFormSubmit}>
            <h1>고객추가</h1>
            프로필 이미지:<input type="file" name="file" file={this.state.file} value={this.state.fileName} onChange={this.handleFileChange}></input><br/>
            이름 : <input type="text" name="userName" value={this.state.userName} onChange={this.handleValueChange}></input><br/>
            생년월일 : <input type="text" name="birthday" value={this.state.birthday} onChange={this.handleValueChange}></input><br/>
            성별 : <input type="text" name="gender" value={this.state.gender} onChange={this.handleValueChange}></input><br/>
            직업 : <input type="text" name="job" value={this.state.job} onChange={this.handleValueChange}></input><br/>
            <button type="submit">추가하기</button>
            </form>
        )
    }
}

export default CustomerAdd;