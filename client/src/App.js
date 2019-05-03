import React, { Component } from 'react';
import Customer from './components/Customer';
import CustomerAdd from './components/CustomerAdd';
//감싸는 테그임.
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

//자신만의 스타일을 넣기 위해
import { withStyles} from '@material-ui/core/styles';

import CircularProgress from '@material-ui/core/CircularProgress';
/*
// 매개변수 지정 방법
() => { ... } // 매개변수가 없을 경우
x => { ... } // 매개변수가 한 개인 경우, 소괄호를 생략할 수 있다.
(x, y) => { ... } // 매개변수가 여러 개인 경우, 소괄호를 생략할 수 없다.

// 함수 몸체 지정 방법
x => { return x * x }  // single line block
x => x * x             // 함수 몸체가 한줄의 구문이라면 중괄호를 생략할 수 있으며 암묵적으로 return된다. 위 표현과 동일하다.

() => { return { a: 1 }; }
() => ({ a: 1 })  // 위 표현과 동일하다. 객체 반환시 소괄호를 사용한다.

() => {           // multi line block.
const x = 10;
return x * x;
};
*/

const styles = theme =>({
  root:{
    width:'100%',
    marginTop: theme.spacing.unit *3,
    overflowX:'auto'
  },
  table:{
    minWidth:1080
  },progress: {
    margin: theme.spacing.unit * 2,
  }
})

/*react life cycle
1) constructor()

2) componentWillMount()

3) render()

4) componentDidMount()

*/
class App extends Component {
  state={
    customers: "",
    completed: 0
  }
  componentDidMount(){
    this.timer = setInterval(this.progress, 20);
    this.callApi()
    .then(res => this.setState({customers: res}))
    .catch(err => console.log(err))
  }
  callApi = async () => {
    const response = await fetch('/api/customers');
    const body = await response.json();
    return body;
  }

  progress = () =>{
    const {completed} = this.state;
    this.setState({completed:completed >= 100 ? 0 : completed + 1});
  }

  render() {
    const {classes} = this.props;
    console.log(classes);
    return (
      <div>
      <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>번호</TableCell>
                <TableCell>이미지</TableCell>
                <TableCell>이름</TableCell>
                <TableCell>생년월일</TableCell>
                <TableCell>성별</TableCell>
                <TableCell>직업</TableCell>
              </TableRow>
            </TableHead>
                <TableBody>{this.state.customers ? this.state.customers.map(c =>{
                  return(<Customer key={c.id} id={c.id} image={c.image} name={c.name} birthday={c.birthday} gender={c.gender} job={c.job} />);
              }) :
              <TableRow>
                <TableCell colSpan="6" align="center">
                  <CircularProgress className={classes.progress} variant="determinate" value={this.state.completed}></CircularProgress>
                </TableCell>
            </TableRow>
          }
            </TableBody>
          </Table>
          </Paper>
          <CustomerAdd/>
          </div>
    );
}
}
export default withStyles(styles)(App);
