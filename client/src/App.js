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

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';

const styles = theme =>({
  root:{
    width:'100%',
    minWidth:1080
  },
  menu:{
    marginTop:15,
    marginBottom:15,
    display:'flex',
    justifyContent:'center'
  },
  paper:{
    marginLeft:18,
    marginRight:18
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
  grow: {
    flexGrow: 1,
  },
  tableHead:{
    fontSize:'1.0rem'
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
})

/*react life cycle
1) constructor()

2) componentWillMount()

3) render()

4) componentDidMount()

*/
class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      customers:'',
      completed: 0,
      searchKeyword:''
    }
  }
  stateRefresh = () =>{
    this.setState=({
      customers: "",
      completed: 0,
      searchKeyword:''
    });
    this.callApi()
    .then(res => this.setState({customers: res}))
    .catch(err => console.log(err))
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

  handleValueChange =(e) =>{
    let nextState ={};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  render() {
    const filteredComponents = (data) =>{
      data = data.filter((c)=>{
        return c.name.indexOf(this.state.searchKeyword) > -1;
      });
      return data.map((c) =>{
          return (<Customer stateRefresh={this.stateRefresh} key={c.id} id={c.id} image={c.image} name={c.name} birthday={c.birthday} gender={c.gender} job={c.job}/>);
      });
    }

    const {classes} = this.props;
    const cellList =["번호","프로필 이미지","이름","생년월일","성별","직업","설정"];
    console.log(classes);
    return (
      <div className={classes.root}>
       <AppBar position="static">
        <Toolbar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Open drawer">
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" color="inherit" noWrap>
            고객 관리 시스템
          </Typography>
          <div className={classes.grow} />
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="검색하기"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              name="searchKeyword"
              value={this.state.searchKeyword}
              onChange={this.handleValueChange}
            />
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.menu}>
      <CustomerAdd stateRefresh={this.stateRefresh}/>
      </div>
      <Paper className={classes.paper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {cellList.map(c=>{
                  return(<TableCell className={classes.tableHead}>{c}</TableCell>)
                })}
              </TableRow>
            </TableHead>
                <TableBody>{this.state.customers ? filteredComponents(this.state.customers) :
              <TableRow>
                <TableCell colSpan="6" align="center">
                  <CircularProgress className={classes.progress} variant="determinate" value={this.state.completed}></CircularProgress>
                </TableCell>
            </TableRow>
          }
            </TableBody>
          </Table>
          </Paper>
          </div>
    );
}
}
export default withStyles(styles)(App);
