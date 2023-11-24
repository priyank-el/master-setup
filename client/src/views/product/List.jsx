import React, { lazy, useState, useEffect } from "react";
import axios from "axios"
import { Link } from "react-router-dom";
const CardProductGrid = lazy(() =>
  import("../../components/card/CardProductGrid")
);
const CardProductList = lazy(() =>
  import("../../components/card/CardProductList")
);
const Paging = lazy(() => import("../../components/Paging"));


const ProductListView = () => {
  // state = {
  //   currentProducts: [],
  //   currentPage: null,
  //   totalPages: null,
  //   totalItems: 0,
  //   view: "list",
  // };

  // UNSAFE_componentWillMount() {
  //   const totalItems = this.getProducts().length;
  //   this.setState({ totalItems });
  // }

  // onPageChanged = (page) => {
  //   let products = this.getProducts();
  //   const { currentPage, totalPages, pageLimit } = page;
  //   const offset = (currentPage - 1) * pageLimit;
  //   const currentProducts = products.slice(offset, offset + pageLimit);
  //   this.setState({ currentPage, currentProducts, totalPages });
  // };


  // getProducts = () => {
  //   let products = data.products;
  //   products = products.concat(products);
  //   products = products.concat(products);
  //   products = products.concat(products);
  //   products = products.concat(products);
  //   products = products.concat(products);
  //   return products;
  // };

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
      {/* <div
          className="p-5 bg-primary bs-cover"
          style={{
            backgroundImage: "url(../../images/banner/50-Banner.webp)",
          }}
        >
          <div className="container text-center">
            <span className="display-5 px-3 bg-white rounded shadow">
              T-Shirts
            </span>
          </div>
        </div> */}
      {/* <Breadcrumb /> */}
      <div className="container-fluid mb-3">
        <div className="row">
          {/* <div className="col-md-3">
              <FilterCategory />
              <FilterPrice />
              <FilterSize />
              <FilterStar />
              <FilterColor />
              <FilterClear />
              <FilterTag />
              <CardServices />
            </div> */}
          <div className="col-md-12">
            <div className="row">
              {/* <div className="col-7">
                  <span className="align-middle fw-bold">
                    {this.state.totalItems} results for{" "}
                    <span className="text-warning">"t-shirts"</span>
                  </span>
                </div> */}
              <div className="col-5 d-flex justify-content-end">
                {/* <select
                    className="form-select mw-180 float-start"
                    aria-label="Default select"
                  >
                    <option value={1}>Most Popular</option>
                    <option value={2}>Latest items</option>
                    <option value={3}>Trending</option>
                    <option value={4}>Price low to high</option>
                    <option value={4}>Price high to low</option>
                  </select> */}
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
                          <Link style={{ textDecoration: "none" }}>
                            <CardProductGrid data={product} />
                          </Link>
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
            <hr />
            {/* <Paging
                totalRecords={products.length}
                pageLimit={6}
                pageNeighbours={3}
                onPageChanged={onPageChanged}
                sizing=""
                alignment="justify-content-center"
              /> */}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}


export default ProductListView;
