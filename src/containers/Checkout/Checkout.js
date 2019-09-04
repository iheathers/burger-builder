import React, { Component } from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import { Route } from 'react-router-dom';
import ContactData from './ContactData/ContactData';
import { connect } from 'react-redux';


class Checkout extends Component{

      
    checkoutCancelledHandler = () => {
        //console.log("cancelled");
        this.props.history.goBack();
    }

    checkoutContinuedHandler = () => {
        //console.log("continued")
        this.props.history.replace("/checkout/contact-data");
    }
    
    render(){
        console.log(this.props)
        return (
            <div>
            <CheckoutSummary 
                ingredients={this.props.ings}
                checkoutCancelled={this.checkoutCancelledHandler}
                checkoutContinued={this.checkoutContinuedHandler}/>
            <Route 
                path={this.props.match.path + '/contact-data'} 
                component = {ContactData}
                 />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
    }
};

export default connect(mapStateToProps) (Checkout);