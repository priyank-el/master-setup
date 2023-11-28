import axios from 'axios'
import { lazy, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const Search = lazy(() => import("./Search"));

const Header = () => {

  const navigate = useNavigate()

  const [cartIteams,setCartIteams] = useState([])

  useEffect(()=>{
    fetchAllProducts()
  },[])

  const fetchAllProducts = async () => {
    try {
      const {data} = await axios.get('http://localhost:3003/user/all-cart-products',{
        headers:{
          env:'test',
          Authorization:localStorage.getItem('JwtToken')
        }
      })

      if(data) setCartIteams(data)
    } catch (error) {
        console.log(error);
    }
  }

  return (
    <header className="p-3 border-bottom bg-light">
      <div className="container-fluid">
        <div className="row g-3">
          <div className="col-md-3 text-center">
              <Link className="text-decoration-none text-secondary">Lerning BY Doing</Link>
          </div>
          <div className="col-md-5">
            <Search />
          </div>
          <div className="col-md-4">
            <div className="position-relative d-inline me-3">
              <Link to="/cart" className="btn btn-primary">
                <i className="bi bi-cart3"></i>
                <div className="position-absolute top-0 start-100 translate-middle badge bg-danger rounded-circle">
                  {
                    Array.isArray(cartIteams) &&
                    cartIteams.length
                  }
                </div>
              </Link>
            </div>
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-secondary rounded-circle border me-3"
                aria-expanded="false"
                aria-label="Profile"
                onClick={()=>navigate('/user-profile')}
              >
                <i className="bi bi-person-fill text-light"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
