import React, { Component } from 'react';
import { connect } from 'react-redux';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Modal from '../../components/UI/Modal/Modal';

import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import * as actions from '../../store/actions/index';

class BurgerBuilder extends Component {

    state = {
        ordered: false,
        
    }

    componentDidMount() {
        console.log(this.props);
        this.props.onInitIngredients();
        
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
        this.props.onInitPurchase();
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

        let burger = this.props.error ? <p style={{ textAlign: "center" }}>Ingredients can't be fetched from server</p> : <Spinner />

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
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error  
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit())
    }
} 

export default connect(mapStateToProps, mapDispatchToProps)( withErrorHandler(BurgerBuilder, axios));