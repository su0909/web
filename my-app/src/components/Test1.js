import React, { Component } from 'react';

class Test1 extends Component {
    constructor(props) {
        super(props);
    }

    asd = ()=>{
        console.log("asd")
    }
    componentDidMount(){
        console.log("asd")
    }
    render() {
        return (    
            <div className="Test1">

            </div>
        );
    }
}

export default Test1;