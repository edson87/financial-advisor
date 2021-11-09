import React, { useState } from 'react';
import { connect } from 'react-redux';
import {Link} from "react-router-dom";

import '../styles/RiskPreferences.scss';
import GraphicImage from '../assets/images/donutlogo.png'
import TableRow from './TableRow';
import DonutChart  from './DonutChart';
import ButtonProperty from './ButtonProperty';


const RiskPreferences = ({categories, categorySelected,save_risk_selected}) => {
    var severity = [1,2,3,4,5,6,7,8,9,10];
    const [isGraphic, setIsGraphic] = useState(false);

    function graphic_or_table() {
        if (isGraphic === false) {
            setIsGraphic(true)
        } else {
            setIsGraphic(false)
        }
    }

    const continue_condition = () => {
        if (categorySelected.length === 0) {
            return '/'
        } else {
            return '/calculator'
        }    
    }

    const title_style = {
        marginTop: '1%',
        fontSize:'1.8rem'
    }

    return (
        <section>
            <h2 style={title_style}>Please Select A Risk Level For Your Investment Portfolio</h2>
            
            <div>
                <div className="wrapper">
                    <div className="text">
                        <span>Low</span><span>High</span>
                    </div>
                </div>
                {
                    severity.map((number, index) => {
                        return (
                            <ButtonProperty className="risk_level"
                                            key={number.toString()}
                                            label = {number}/>
                        )
                    })
                }
                
                <Link to={()=> continue_condition()}>
                    <button className={`${categorySelected.length===0? 'continue_disable':'continue'} 
                                        ${categorySelected.length===0? 'disabled': ''}`} >
                                Continue
                    </button>
                </Link>
         

                
                <div className='wrapper-table'>
                    <table className='table table-striped' 
                            style={{display: isGraphic===false? 'inline-table':'none'}}>
                        <thead>
                            <tr style={{backgroundColor:'#F9F9F9'}}>
                                <th>Risk</th>
                                <th>Bonds %</th>
                                <th>Large Cap %</th>
                                <th>Mid Cap %</th>
                                <th>Foreign</th>
                                <th>Small Cap %</th>
                            </tr>
                        </thead>
                        <tbody>
            
                            {                           
                                categories.map( (j, index) => {                                   
                                    return(
                                        <TableRow key={index} row={j} />
                                    )
                                })                                  
                            }
    
                        </tbody>
                    </table> 

                    <div style={{display: isGraphic===true? 'inline-table':'none'}}>
                        <DonutChart  />
                    </div>
                   
                    <button className='display_Graphics' onClick={() => graphic_or_table()}>
                            <img src={GraphicImage} alt="Donut Chart" />
                    </button>          
                </div>          
            </div>              
        </section>
    );
}



const mapStateToProps = state =>({
    categories: state.categories,
    categorySelected: state.categorySelected
}) 

const mapDispatchProps = dispatch =>({
})

export default connect(mapStateToProps, mapDispatchProps)(RiskPreferences)