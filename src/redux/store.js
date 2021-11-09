import { createStore } from "redux";

const initialState = {
    categories: [
        {risk:1, bonds:80, large: 20, mid:0, foreign:0, small:0, selected: 0},
        {risk:2, bonds:70, large: 15, mid:15, foreign:0, small:0, selected: 0},
        {risk:3, bonds:60, large: 15, mid:15, foreign:10, small:0, selected: 0},
        {risk:4, bonds:50, large: 20, mid:20, foreign:10, small:0, selected: 0},
        {risk:5, bonds:40, large: 20, mid:20, foreign:20, small:0, selected: 0},
        {risk:6, bonds:30, large: 25, mid:5, foreign:30, small:5, selected: 0},
        {risk:7, bonds:20, large: 25, mid:25, foreign:25, small:5, selected: 0},
        {risk:8, bonds:10, large: 20, mid:40, foreign:20, small:10, selected: 0},
        {risk:9, bonds:5, large: 15, mid:40, foreign:25, small:15, selected: 0},
        {risk:10, bonds:0, large: 5, mid:25, foreign:30, small:40, selected: 0}
    ],
    categorySelected: []
}

function reducer(state = initialState, action) {
    state.categorySelected = [];
    var category_selected = [];

    state.categories.forEach(e => {
        e.selected = 0
    });

    if(action.type === 'SELECT RISK') {
        for (let index = 0; index < state.categories.length; index++) {
            const e = state.categories[index];
            if (e.risk === action.category.risk) {
                e.selected = 1;
            }
        }

        category_selected = [
            {
                name:'Risk', value: action.category.risk
            },
            { 
                name: "Bonds", value: action.category.bonds
            },
            {
                name: "Large Cap", value: action.category.large
            },
            {
                name: "Mid ", value: action.category.mid
            },
            {
                name: "Foreign ", value: action.category.foreign
            },
            {
                name: "Small Cap  ", value: action.category.small
            }
        ] 
        

        return {
            categories: state.categories,
            categorySelected: category_selected
        }
        
    }
    
    return state
}

export default createStore(reducer)