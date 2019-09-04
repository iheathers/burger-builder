import React, { Component } from 'react';
import { connect } from 'react-redux';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Modal from '../../components/UI/Modal/Modal';

import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import * as actionTypes from '../../store/actions';

class BurgerBuilder extends Component {

    state = {
        ordered: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        console.log(this.props);
        // axios.get('https://react-burger-builder-3de3e.firebaseio.com/ingredients.json')
        //     .then(response => {
        //         //console.log(response);
        //         this.setState({ ingredients: response.data })
        //     })
        //     .catch(error => {
        //         this.setState({ error: true })
        //     });
    }

    orderHandler = () => {
        this.setState({ ordered: true })
    }

    updatePurchaseState(ingredients) {

        const sum = Object.keys(ingredients)
            .map(
                (igKey) => {
                    return ingredients[igKey]
                })
            .reduce((sum, element) => {
                return sum + element;
            }, 0);

        //console.log(sum);

        return sum > 0 ;
    }

    orderCancelledHandler = () => {
        this.setState({ ordered: false })
    }

    orderContineHandler = () => {
        this.props.history.push('/checkout');
    }



    render() {
        const disabledInfo = {
            ...this.props.ings
        }; 

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        let orderSummary = null;

        let burger = this.state.error ? <p style={{ textAlign: "center" }}>Ingredients can't be fetched from server</p> : <Spinner />

        if (this.props.ings) {
            burger =
                <>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        addIngredient={this.props.onIngredientAdded}
                        removeIngredient={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        price={this.props.price}
                        purchasable={this.updatePurchaseState(this.props.ings)}
                        ordered={this.orderHandler} />
                </>
            orderSummary = <OrderSummary
                ingredients={this.props.ings}
                price={this.props.price}
                orderContinued={this.orderContineHandler}
                orderCancelled={this.orderCancelledHandler} />

            if (this.state.loading) {
                orderSummary = <Spinner />
            }
        }

        return (
            <>
                {burger}

                <Modal show={this.state.ordered} cancel={this.orderCancelledHandler}>
                    {orderSummary}
                </Modal>

            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice   
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName }),
        onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName })
    }
} 

export default connect(mapStateToProps, mapDispatchToProps)( withErrorHandler(BurgerBuilder, axios));