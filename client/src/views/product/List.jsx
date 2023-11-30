import React, { lazy, useState, useEffect } from "react";
import axios from "axios"
import { Link } from "react-router-dom";
const CardProductGrid = lazy(() =>
  import("../../components/card/CardProductGrid")
);
const CardProductList = lazy(() =>
  import("../../components/card/CardProductList")
);
// const Paging = lazy(() => import("../../components/Paging"));


const ProductListView = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [view, setView] = useState('list')

  const onChangeView = (view) => {
    setView(view);
  };

  useEffect(() => {
    fetchAllProducts()
  }, [])

  const fetchAllProducts = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`http://localhost:3003/user/all-products?value=${searchValue}`, {
        headers: {
          Authorization: localStorage.getItem("jwtToken"),
          "env": "test"
        }
      })
      console.log("data -> ", data);
      if (data) {
        setProducts(data)
        setLoading(false)
      }
    } catch (error) {

    }
  }

  if (loading) {
    return (
      <h3 style={{ textAlign: "center" }}>loading..</h3>
    )
  }

  return (
    <React.Fragment>
      <div className="container-fluid mb-3">
        <div className="row">
          <div className="col-md-12">
            <div className="row">
              <div className="col-5 d-flex justify-content-end">
                <div className="btn-group ms-3" role="group">
                  <button
                    aria-label="Grid"
                    type="button"
                    onClick={() => onChangeView("grid")}
                    className={`btn ${view === "grid"
                      ? "btn-primary"
                      : "btn-outline-primary"
                      }`}
                  >
                    <i className="bi bi-grid" />
                  </button>
                  <button
                    aria-label="List"
                    type="button"
                    onClick={() => onChangeView("list")}
                    className={`btn ${view === "list"
                      ? "btn-primary"
                      : "btn-outline-primary"
                      }`}
                  >
                    <i className="bi bi-list" />
                  </button>

                </div>
              </div>
            </div>
            <hr />
            {
              products.length === 0
                ?
                <h3>No products available</h3>
                :
                <div className="row g-3">
                  {view === "grid" &&
                    products.map((product, idx) => {
                      return (
                        <div key={idx} className="col-md-4">
                          {/* <Link style={{ textDecoration: "none" }}>
                            <CardProductGrid data={product} />
                          </Link> */}
                        </div>
                      );
                    })}
                  {view === "list" &&
                    products.map((product, idx) => {
                      return (
                        <div key={idx} className="col-md-12">
                          <Link style={{ textDecoration: "none" }}>
                            <CardProductList data={product} />
                          </Link>
                        </div>
                      );
                    })}
                </div>}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}


export default ProductListView;
