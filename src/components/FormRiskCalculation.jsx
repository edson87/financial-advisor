import React from "react";
import { connect } from "react-redux";

import "../styles/FormRiskCalculation.scss";
import { useHistory } from "react-router-dom";

class FormRiskCalculation extends React.Component {
  category_selected = this.props.categorySelected;
  total_mount = 0;
  portfolio = [];
  constructor(props) {
    super(props);
    this.state = {
      bonds: {
        current: "",
        difference: "",
        new_amount: "",
        recommended_transfers: "",
        validate: false,
      },
      large: { current: "", difference: "", new_amount: "", validate: false },
      mid: { current: "", difference: "", new_amount: "", validate: false },
      foreign: { current: "", difference: "", new_amount: "", validate: false },
      small: { current: "", difference: "", new_amount: "", validate: false },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.category_selected.length === 0) {
      this.props.history.push("/");
    }
  }

    /*componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(this.state)
        if (prevProps.specificProperty !== this.props.specificProperty) {
            console.log(prevProps);
        }
    }*/

  validation(value) {
    let validRegEx =
      /(?=.)^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(\.[0-9]{1,2})?$/;
    if (!validRegEx.test(value) || value < 0 || value === "") {
      return false;
    } else {
      return true;
    }
  }

  display_message() {
    let categories = ["bonds", "large", "mid", "foreign", "small"];

    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];

      if (this.state[category].validate === false) {
        this.setState({
          ...this.state,
          bonds: {
            ...this.state["bonds"],
            recommended_transfers:
              "Please use only positive digits or zero when entering current amounts. Please enter all inputs correctly.",
          },
        });

        return true;
      } else {
        this.setState({
          ...this.state,
          bonds: { ...this.state["bonds"], recommended_transfers: "" },
        });
      }
    }

    return false;
  }

  calculateMoney() {
    let categories = ["bonds", "large", "mid", "foreign", "small"];
    this.total_mount = 0;
    for (let i = 0; i < categories.length; i++) {
      let index = categories[i];
      const value = this.state[index].current;
      this.total_mount += parseFloat(value);
    }

    return this.total_mount;
  }

  calculate_new_amount(totalAmount) {
    let categories = ["bonds", "large", "mid", "foreign", "small"];
    let percent = 0;
    let list_new_amounts = [];

    /*Calculate the new amount*/
    for (let i = 1; i < this.category_selected.length; i++) {
      const value = this.category_selected[i].value;
      const category_name = categories[i - 1].toString();

      if (value === 0) {
        percent = 0;
      } else {
        percent = value / 100;
      }

      let amount = Math.floor(100 * (percent * totalAmount)) / 100;

      this.setState((state, props) => ({
        ...state,
        [category_name]: { ...state[category_name], new_amount: amount },
      }));

      list_new_amounts.push(amount);
    }

    return list_new_amounts;
  }

  calculate_difference(list_new_amounts) {
    let categories = ["bonds", "large", "mid", "foreign", "small"];
    let list_differences = [];

    /*Calculate the difference*/
    for (let i = 0; i < categories.length; i++) {
      let category = categories[i];
      let new_amount = list_new_amounts[i];
      let current_ammount = this.state[category].current;

      let difference = Math.round(100 * (new_amount - current_ammount)) / 100;

       list_differences.push(difference);
        this.setState((state, props) => ({
          ...state,
          [category]: { ...state[category], difference: difference },
        }));
    }

    return list_differences;
  }

  show_comments = (listDifferences, counter = 0, recordedTransfers= []) => {
      
    let differences = listDifferences
    let labels = this.category_selected
    let newDifferences = differences.slice(0);

    function sortNumber(a,b) {return a - b;}
    let sortedDiff = differences.sort(sortNumber)

    let transferMade = false;
    let smallestFittingDeficit = null;

    sortedDiff.slice(0).reverse().forEach(function(surplus){
       if(!transferMade && surplus > 0){
          sortedDiff.forEach(function(deficit){
              
              if(surplus + deficit <= 0){
                smallestFittingDeficit = deficit;
              }
          })

          if(smallestFittingDeficit){
              let surplusIdx = newDifferences.indexOf(surplus);
              let deficitIdx = newDifferences.indexOf(smallestFittingDeficit);
              newDifferences[surplusIdx] = 0;
              newDifferences[deficitIdx] = surplus + smallestFittingDeficit;
              let transferAmount = Math.round(100*surplus)/100;

              let a = '- Transfer $'+ transferAmount +' from ' + labels[deficitIdx+1].name +' to '+ labels[surplusIdx+1].name+'.'
              recordedTransfers.push(a)

              //console.log('Transfer $'+ transferAmount +' from ' + labels[deficitIdx+1].name +' to '+ labels[surplusIdx+1].name+'.')
              transferMade = true;
          }
       }
    })

    if(!transferMade){
      sortedDiff.forEach(function(smallestSurplus){
        if(smallestSurplus > 0){
          sortedDiff.slice(0).reverse().forEach(function(smallestDeficit){
            if(!transferMade && smallestDeficit < 0){
              let surplusIdx = newDifferences.indexOf(smallestSurplus);
              let deficitIdx = newDifferences.indexOf(smallestDeficit);
              newDifferences[surplusIdx] = smallestSurplus + smallestDeficit;
              newDifferences[deficitIdx] = 0;
              let transferAmount = Math.round(100*(smallestSurplus - (smallestSurplus + smallestDeficit)))/100;

              let a = '- Transfer $'+ transferAmount +' from ' + labels[deficitIdx+1].name +' to '+ labels[surplusIdx+1].name+'.'
              recordedTransfers.push(a)

              //console.log('Transfer $'+ transferAmount +' from ' + labels[deficitIdx+1].name +' to '+ labels[surplusIdx+1].name+'.');
              transferMade = true;
            }
          })
        }
      })
    }
    newDifferences = newDifferences.map((el)=>{return Math.round(100 * el)/100})

    let numOfZeroDifferences = newDifferences.filter(function(x){return x===0}).length;

    if(numOfZeroDifferences < 4 && counter < 7){
      this.show_comments(newDifferences, counter + 1, recordedTransfers);
    } else {

      let message = recordedTransfers.join('\n');

      this.setState((state, props) =>({
        ...state,
        bonds: { ...state['bonds'], recommended_transfers:message }
      }))
    }
    
  }

  handleChange(event, category) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (this.validation(value) === false) {
      this.setState({
        ...this.state,
        [category]: { ...this.state[category], [name]: value, validate: false },
      });
    } else {
      this.setState({
        ...this.state,
        [category]: { ...this.state[category], [name]: value, validate: true },
      });
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    this.setState((state, props) =>(
      { bonds: {...state['bonds'].current, difference: "",new_amount: "",recommended_transfers: ""},
        large: { ...state['large'].current, difference: "", new_amount: "" },
        mid: { ...state['mid'].current, difference: "", new_amount: "" },
        foreign: { ...state['foreign'].current, difference: "", new_amount: "" },
        small: { ...state['small'].current, difference: "", new_amount: "" },
      }
    ))
    
    let show_message = false;
    let money = this.calculateMoney();

    show_message = this.display_message();

    if (show_message === true) {
      return;
    }


    const listAmmount = this.calculate_new_amount(money);
    const listDifferences = this.calculate_difference(listAmmount);
    this.show_comments(listDifferences);
  }

  color_difference(category) {
    return this.state[category].difference >= 0
      ? "positive_difference"
      : "negative_difference";
  }

  render() {
    return (
      <section>
        <span className="title">Personalized Portfolio</span>

        <div className="container">
          <div className="table_risk_selected">
            <h3 className="float-start risk_lvl">
              Risk Level {this.category_selected[0].value}
            </h3>
            <table border={2} className="table table-striped">
              <thead>
                <tr style={{ backgroundColor: "#F9F9F9" }}>
                  <th>Bonds</th>
                  <th>Large Cap</th>
                  <th>Mid Cap</th>
                  <th>Foreign</th>
                  <th>Small Cap</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{this.category_selected[1].value} %</td>
                  <td>{this.category_selected[2].value} %</td>
                  <td>{this.category_selected[3].value} %</td>
                  <td>{this.category_selected[4].value} %</td>
                  <td>{this.category_selected[5].value} %</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <form onSubmit={this.handleSubmit}>
              <div>
                <span className="title float-start">
                  Please Enter Your Current Portfolio
                </span>
                <button className="float-end submit" type="submit">
                  Rebalance
                </button>
              </div>

              <div className="card">
                <div className="card-header">
                  <div className="row">
                    <div className="col-sm-1">
                      <h5> </h5>
                    </div>
                    <div className="col-sm-3">
                      <h5>Current Amount</h5>
                    </div>
                    <div className="col-sm-2">
                      <h5>Difference</h5>
                    </div>
                    <div className="col-sm-2">
                      <h5>New Amount</h5>
                    </div>
                    <div className="col-sm-3">
                      <h5>Recommended Transfers</h5>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <table>
                    <tbody>
                      <tr>
                        <td>Bonds $:</td>
                        <td>
                          <input
                            type="text"
                            name="current"
                            value={this.state["bonds"].current}
                            onChange={(e) => this.handleChange(e, "bonds")}
                          />
                        </td>
                        <td>
                          <input
                            className={this.color_difference('bonds')}
                            type="text"
                            disabled
                            name="differen"
                            value={this.state["bonds"].difference}
                          />
                        </td>
                        <td>
                          <input
                            className="new_amount"
                            type="text"
                            disabled
                            name="new_amount"
                            value={this.state["bonds"].new_amount}
                          />
                        </td>
                        <td rowSpan="5">
                          <textarea
                            className="risk-calculator-transfers"
                            disabled
                            name="recommended_transfers"
                            id="risk-calculator-transfers"
                            cols="30"
                            rows="8"
                            value={this.state["bonds"].recommended_transfers}
                          ></textarea>
                        </td>
                      </tr>
                      <tr>
                        <td>Large Cap $:</td>
                        <td>
                          <input
                            type="text"
                            name="current"
                            id="current"
                            value={this.state["large"].current}
                            onChange={(e) => this.handleChange(e, "large")}
                          />
                        </td>
                        <td>
                          <input
                            className={this.color_difference('large')}
                            type="text"
                            disabled
                            name="difference"
                            value={this.state["large"].difference}
                          />
                        </td>
                        <td>
                          <input
                            className="new_amount"
                            type="text"
                            disabled
                            name="new_amount"
                            value={this.state["large"].new_amount}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Mid Cap $:</td>
                        <td>
                          <input
                            type="text"
                            name="current"
                            id=""
                            value={this.state["mid"].current}
                            onChange={(e) => this.handleChange(e, "mid")}
                          />
                        </td>
                        <td>
                          <input
                            className={this.color_difference('mid')}
                            type="text"
                            disabled
                            name="difference"
                            value={this.state["mid"].difference}
                          />
                        </td>
                        <td>
                          <input
                            className="new_amount"
                            type="text"
                            disabled
                            name="new_amount"
                            value={this.state["mid"].new_amount}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Foreign $:</td>
                        <td>
                          <input
                            type="text"
                            name="current"
                            value={this.state["foreign"].current}
                            onChange={(e) => this.handleChange(e, "foreign")}
                          />
                        </td>
                        <td>
                          <input
                            className={this.color_difference('foreign')}
                            type="text"
                            disabled
                            name="difference"
                            value={this.state["foreign"].difference}
                          />
                        </td>
                        <td>
                          <input
                            className="new_amount"
                            type="text"
                            disabled
                            name="new_amount"
                            value={this.state["foreign"].new_amount}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Small Cap $:</td>
                        <td>
                          <input
                            type="text"
                            name="current"
                            value={this.state["small"].current}
                            onChange={(e) => this.handleChange(e, "small")}
                          />
                        </td>
                        <td>
                          <input
                            className={this.color_difference("small")}
                            type="text"
                            disabled
                            name="difference"
                            value={this.state["small"].difference}
                          />
                        </td>
                        <td>
                          <input
                            className="new_amount"
                            type="text"
                            disabled
                            name="new_amount"
                            value={this.state["small"].new_amount}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state) => ({
  categorySelected: state.categorySelected,
});

const mapDispatchProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchProps)(FormRiskCalculation);
