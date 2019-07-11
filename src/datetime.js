import React, {Component} from 'react';
import {
    Col,
	Button,
	FormGroup,
	Input,
	Popover, 
	Row
} from "reactstrap";
import Calendar from 'react-calendar';

let id = 0;
function idGen(){
	return 'ds_dtp_'+(id++)
}

export default class Datetime extends Component{
	
	state={
		valid : false,
		date: '',
		isOpen : false,
		hours : '',
		minutes : '',
		subdate : ''
	}
	data = [
		{h : 9, m :0},
		{h : 10, m :0},
		{h : 12, m :0},
		{h : 15, m :0},
		{h : 18, m :0},
		{h : 19, m :0},
		{h : new Date().getHours(), m : new Date().getMinutes()},
		{h : 0, m :0},]

	onChange(e){
		e.setHours(this.state.date.getHours())
		e.setMinutes(this.state.date.getMinutes())
		this.setState({ date : e, subdate: formatDate(e) })
		this.props.onChange({name : this.props.name, value : isNaN(this.dateMs(e)) ? this.dateMs(this.state.date) : this.dateMs(e) })
	} 
	
	constructor(props){
		super(props);
		this.id = idGen();
		this.onChange = this.onChange.bind(this)
		this.close = this.close.bind(this);
		this.inputBlur = this.inputBlur.bind(this)
		this.dateMs = this.dateMs.bind(this)
		this.setHours=this.setHours.bind(this);
		this.setMinutes=this.setMinutes.bind(this);
		this.emitOnChange=this.emitOnChange.bind(this);
	}
	componentDidMount(){
		console.log(this.props.value)
		var da = (this.props.value != undefined && this.props.value != null && this.props.value != '') ? new Date(this.props.value) : new Date()
		this.setState({date : da, subdate : formatDate(da), hours : da.getHours(), minutes : da.getMinutes() })
	}
	
	close(){
		this.setState({isOpen : !this.state.isOpen})
	}
	render(){
		return(<>
			{this.renderInput()}
			{this.renderCalendar()}
		</>)
	}
	setHours(e){
		let dat = this.state.date;
		let val = e.target.value>23 ? 23 
			: e.target.value<0 ? 0
			: e.target.value;
		dat.setHours(val);
		this.setState({date : new Date(dat), hours : val, subdate : formatDate(dat)})
		this.emitOnChange({name : this.props.name, value : this.dateMs(dat)}) 
	}
	setMinutes(e){
		let dat = this.state.date;
		let val = e.target.value>59 ? 59
			: e.target.value<0 ? 0
			: e.target.value;
		dat.setMinutes(val);
		this.setState({date : new Date(dat), minutes : val, subdate : formatDate(dat)})
		this.emitOnChange({name : this.props.name, value : this.dateMs(dat)}) 
	}
	emitOnChange(e){
		this.props.onChange && this.props.onChange(e)
	}
	inputBlur(e){
		if (e.target.value == ''){
			return
		}
		if ((new Date(fDate(e.target.value)[0]) == 'Invalid Date') || !fDate(e.target.value)[1]){	
			this.setState({
				valid : false, 
				subdate : formatDate(this.state.date)
			},() => alert('danger','Неверный формат даты'))
		} else {
			this.setState({
				date : new Date(fDate(e.target.value)[0]),
				hours : new Date(fDate(e.target.value)[0]).getHours(),
				minutes : new Date(fDate(e.target.value)[0]).getMinutes(), valid : true,
				subdate : formatDate(fDate(e.target.value)[0])
			})
			this.emitOnChange({name : this.props.name, value : isNaN(this.dateMs(e)) ? this.dateMs(this.state.date) : this.dateMs(e) })
		}
	}
	
	dateMs(date){
		return Date.parse(date)
	}
	renderInput(){
		return(
			<Input 
				autoComplete='off'
				valid={this.state.valid}
				onBlur={(e) => this.inputBlur(e)} 
				onClick={() => this.setState({isOpen : !this.state.isOpen})} 
				id={this.id}  type="text" name="date" placeholder={this.state.subdate} 
				value={this.state.subdate}
				onChange={ e => {this.setState({subdate : e.target.value})}}    /> 
		)
	}
	renderCalendar(){
		return(
			<Popover className='date-time-picker-popover' id={'_'+this.id} placement="bottom-start"  hideArrow offset={0} isOpen={this.state.isOpen} target={this.id} toggle={() =>this.close()}>
				<Row style={{marginLeft:7,padding:5,backgroundColor:'white',display: 'inline-grid', gridTemplateColumns:'360px 250px'}} form>
					<Col md={12}>
						<FormGroup style={{marginBottom:'0px'}}>
							<Calendar
								onChange={(e) => this.onChange(new Date(e))}
								e={this.onChange}
								value={this.state.date}
							/>
						</FormGroup>
					</Col>
					<Col style={{gridColumnStart: 2}} md={10}>
						<FormGroup row>
							<Col sm={6}>
								<Input valid={this.state.hours >= 0 && this.state.hours <= 23} id={this.id+'hours'}
								style={{textAlign:'center'}} type='number' max='23' min='0' name='hours' id='hours'
								value={this.state.hours}
								onChange={this.setHours}
								onWheel={e=>{this.setHours({target:{value:this.state.hours+(e.deltaY<0 ? 1 : -1)}}) && e.preventDefault()}}
									/>
							</Col>
							<Col sm={6}>
								<Input valid={this.state.minutes >= 0 && this.state.minutes <= 59} id={this.id+'minutes'}
								style={{textAlign:'center'}} type='number' max='59' min='0' name='minutes' id='minutes'
								value={this.state.minutes}
								onChange={this.setMinutes}
								onWheel={e=>{this.setMinutes({target:{value:this.state.minutes+(e.deltaY<0 ? 1 : -1)}} && e.preventDefault())}}
									/>
							</Col>					
						</FormGroup>
						<FormGroup style={{display: 'inline-grid',gridTemplateColumns: '75px 75px 75px'}}>
							{this.data.map(it => <><Button key={it.h+'_'+it.m} outline onClick={() => {
								var dat = this.state.date;
								dat.setHours(it.h);
								dat.setMinutes(it.m);
								this.setState({date : new Date(dat), hours : it.h, minutes : it.m, subdate : formatDate(dat)})
								this.props.onChange({name : this.props.name, value : this.dateMs(dat)})
							}}>
							{it.h} : {it.m < 10 ? '0'+it.m : it.m}</Button> </>)}
						</FormGroup>
					</Col>
				</Row>
			</Popover>
		)
	}
}


function formatDate(date) {
	var dat = new Date(date)
	dat = Date.parse(dat)
	if (dat == 'Invalid Date'){
		var d = date.toString().split(' ')
		var dd = d[0].split('.')
		var tt = d[1].split(':')
		var nDate = new Date()
		nDate.setDate(dd[0]) 
		nDate.setMonth(dd[1]-1)  
		nDate.setFullYear(dd[2])  
		nDate.setHours(tt[0])  
		nDate.setMinutes(tt[1])
		return formatDate(nDate)
	} else{
		let dayOfMonth = date.getDate();
		let month = date.getMonth() + 1;
		let year = date.getFullYear();
		let hour = date.getHours();
		let minutes = date.getMinutes();
  
		month = month < 10 ? '0' + month : month;
		dayOfMonth = dayOfMonth < 10 ? '0' + dayOfMonth : dayOfMonth;
		minutes = minutes < 10 ? '0' + minutes : minutes;
		return `${dayOfMonth}.${month}.${year} ${hour}:${minutes}`
	}
}
function fDate(date){
	var dat = new Date(date).toLocaleDateString()
	dat = Date.parse(dat)
	var [a,b,y] = fTDate(date)
	dat = new Date(dat)
	dat.setHours(a)
	dat.setMinutes(b)
	if (dat == 'Invalid Date' || dat == 'NaN'){
		var d = date.toString().split(' ')
		var dd = d[0].split('.')
		var tt = d[1].split(':')
		var nDate = new Date()
		var k = true;
		nDate.setDate(dd[0])
		nDate.setMonth(dd[1]-1) 
		nDate.setFullYear(dd[2]) 
		nDate.setHours(tt[0])  
		nDate.setMinutes(tt[1])
		
		if( tt[1] > 59 ||
			tt[1] < 0  ||
			dd[0] > 31 ||
			dd[0] < 1  ||
			dd[1] > 12 ||
			dd[1] < 0  || 
			tt[0] > 23 ||
			tt[0] < 0  
			|| dd[2] < 1970 || dd[2] > 2100
			){
			k = false;
		}
		return [new Date(nDate),k]
	}
	return [new Date(dat),true]
}

function fTDate(date){
		var d = date.toString().split(' ')
		var dd = d[0].split('.')
		var tt = d[1].split(':')
		return [tt[0],tt[1],dd[2]]
}
