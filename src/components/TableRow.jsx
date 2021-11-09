import React from 'react';
import { connect } from 'react-redux';
import '../styles/RiskPreferences.scss';

class TableRow extends React.Component {

    /*componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(this.props)
        if (prevProps.specificProperty !== this.props.specificProperty) {
            console.log(prevProps);
        }
    }*/
  
    mostrar() { 
        console.log(this.props.row );
    }

    render() {
        return(  
           
            <tr className={` ${this.props.row.selected === 1 && 'risk_level_selected'}`}>
                <td>{this.props.row.risk}</td>
                <td>{this.props.row.bonds}</td>
                <td>{this.props.row.large}</td>
                <td>{this.props.row.mid}</td>
                <td>{this.props.row.foreign}</td>
                <td>{this.props.row.small}</td>
            </tr>
        )
   
    }
}

const mapStateToProps = state =>({
    categorySelected: state.categorySelected,
}) 

const mapDispatchProps = dispatch =>({
    save_risk_selected(category) {
        dispatch({
            type: 'SELECT RISK',
            category
        })
    }
})

export default connect(mapStateToProps, mapDispatchProps)(TableRow)