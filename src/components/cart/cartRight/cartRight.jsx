
import {useSelector, useDispatch} from "react-redux";
import styled from "styled-components";
import {remDish} from "../../../Redux/User/action.js"
import {addUser} from "../../../Redux/User/action.js"
import {useState, useEffect} from "react";

const Main = styled.div`
width: 95%;
height: 300px;
overflow-Y: scroll;
display: flex;
flex-direction: column;
gap: 1%;
background-color: white;
box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
`;

const Card = styled.div`
width: 98%;
height: 100px;
margin: 0 auto;
display: flex;
justify-content: space-evenly;
align-items: center;
border: 1px solid lightgrey;
`;

const Left = styled.div`
width: 65%;
height: 100%;
`
const Right = styled.img`
width: 75px;
height: 75px;
object-fit: cover;
border-radius: 6px;
`;

const Total = styled.div`
width: 90%;
height: 150px;
font-weight: 600;
text-align: center;
margin-top: 15px;
background-color: white;
box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
padding: 5%;
text-decoration: underline blue;
`

export const CartRight = () => {
     const items = useSelector((store) => (store.login.userLogged.cart));
     let [total, setTotal] = useState(0);

     useEffect(() => {
         if(items.length === 0){
          setTotal(0);
         }
         else{
            for(let i = 0; i < items.length; i++){
                total += items[i].price;
            }
         }
         setTotal(total);
     }, []);
      
     const dispatch = useDispatch();

     const userLogged = useSelector((store) => (store.login.userLogged));

     const getUserData = () => {
        fetch(`https://server-swiggy.herokuapp.com/users/${userLogged._id}`)
        .then((res) => (res.json()))
        .then((data) => (dispatch(addUser(data))));
      }
     
     const handleDelete = (id) => {
        remDish(id);
        fetch(`https://server-swiggy.herokuapp.com/users/${userLogged._id}`, {
                method: "PATCH",
                body: JSON.stringify(userLogged),
                headers: {
                  "content-type": "application/json"
                }
              })
              .then(() => {getUserData()})
              .then(alert("Item removed to your cart successfully"))
     }

    return (
        <div style = {{display: "flex", width: "45%", flexDirection: "column", marginTop: "-500px", marginRight: "100px", height: "25rem"}}>
        <Main>
            {items.map((el) => (

        <Card>
        <Left>
            <h5 style ={{margin: "0.45%", fontSize: "0.9rem", textAlign: "left", fontWeight: "600"}}>{el.name}</h5>
            <h5 style ={{margin: "0.45%", fontSize: "0.9rem", textAlign: "left", fontWeight: "600"}}>{el.isVeg === 1 ? "Veg" : "Non-Veg"}</h5>
            <h5 style ={{margin: "0.45%", fontSize: "0.9rem", textAlign: "left", fontWeight: "600"}}>₹ {el.price}</h5>
            <button onClick = {() => {handleDelete(el._id)}} style ={{border :"1px solid orangered", fontWeight: "600", color: "orangered", padding : "1%", textAlign: "right", boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"}}>Remove</button>
 
        </Left>
        <Right src = {`${el.image}`}></Right>
        </Card>
            ))}
        </Main>
        <Total>
        <h5 style ={{margin: "0.45%", fontSize: "1.3rem", fontWeight: "600", marginBottom: "15px"}}>Total Items : {items.length}</h5>
        <h5 style ={{margin: "0.45%", fontSize: "1.3rem", fontWeight: "600"}}>Total Amount : ₹ {total}</h5>
        </Total>
        </div>
    )
}