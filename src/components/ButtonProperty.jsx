import React, { useState } from 'react';
import { connect } from 'react-redux';

import '../styles/RiskPreferences.scss'

class ButtonProperty extends React.Component {

    bottom_style = ''

    constructor(props) {
        super(props);
      }

    risk_selected(number){
        var risk_selected = this.props.categories[number - 1];

        this.props.save_risk_selected(risk_selected)
    }

    render() {
        return(
            <button  className={`risk_level ${this.props.categorySelected.length > 0 && this.props.categorySelected[0].value === this.props.label? 'risk_level_selected':''}`}
                onClick={() => this.risk_selected(this.props.label)}
                >{this.props.label}
            </button>
        )
    }
}

const mapStateToProps = state =>({
    categories: state.categories,
    categorySelected: state.categorySelected
}) 

const mapDispatchProps = dispatch =>({
    save_risk_selected(category) {
        dispatch({
            type: 'SELECT RISK',
            category
        })
    }
})

export default connect(mapStateToProps, mapDispatchProps)(ButtonProperty)
