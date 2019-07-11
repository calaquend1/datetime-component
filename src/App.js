import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Datetime from './datetime.js'

export default class App extends Component {
  state = {
    date : ''
  }

  componentDidMount(){
    this.setState({
      date : new Date
    })
  }

  constructor(props){
    super(props);
    this.changeDate = this.changeDate.bind(this)
  }
  
  changeDate(event,field){
		this.setState(old=>({
			it:{
				...old.it,
				[field]:event.value || this.state.example
			}
		}))
	}


  render(){
    return (
      <div className="App">
        <header className="App-header">
          <p>
            
          </p>
          <Datetime value={this.state.example || ''} name={'example'} style={{width:'95%'}}
          onChange={(e)=>this.changeDate(e,'example')}/>
        </header>
      </div>
    )
  }
}
