
function getcart(productid, quantity, price){
    let newprod = {"productid": productid, "Quantity": quantity, "Price": price*quantity}
    return newprod
}

module.exports = getcart