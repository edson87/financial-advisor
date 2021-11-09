import React from 'react';
import { connect } from "react-redux";

import {
    Chart,
    ChartLegend,
    ChartSeries,
    ChartSeriesItem,
    ChartSeriesLabels,
  } from "@progress/kendo-react-charts";
  import "hammerjs";

class DonutChart extends React.Component {

    /*componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(this.props.categorySelected)
 
    }*/

    render() {
        return (
            <Chart style={{width: '900px'}}>
                <ChartSeries>
                <ChartSeriesItem
                    type="donut"
                    data={this.props.categorySelected}
                    categoryField="name"
                    field="value"
                >
                    <ChartSeriesLabels
                    color="#fff"
                    background="none"
                    content={labelContent}
                    />
                </ChartSeriesItem>
                </ChartSeries>
                <ChartLegend visible={false} />
            </Chart>
        )
    }
}

const labelContent = (e) => `${e.category}  \n ${e.value}%`;

const mapStateToProps = state =>({
    categorySelected: state.categorySelected
}) 

const mapDispatchProps = dispatch =>({
})

export default connect(mapStateToProps, mapDispatchProps)(DonutChart)