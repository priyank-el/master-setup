import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify'
import { Formik } from 'formik';

const CheckoutView = () => {

  const [cartIteams, setCartIteams] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    fetchAllCartProducts()
  }, [])

  useEffect(() => {
    totalPriceOfProducts()
  }, [cartIteams])

  const totalPriceOfProducts = () => {
    let total = 0;
    cartIteams.map(product => {
      // console.log(product)
      total += product.price * product.numberOfProducts
    })
    setTotalPrice(total)
  }

  const fetchAllCartProducts = async () => {
    try {
      const { data } = await axios.get('http://localhost:3003/user/all-cart-products', {
        headers: {
          env: 'test',
          Authorization: localStorage.getItem('JwtToken')
        }
      })

      if (data) {
        setCartIteams(data)
      }

    } catch (error) {
      console.log(error);
    }
  }

  const formSubmitHandler = async (values) => {
    let userName = values.name;
    let userAddress = values.address;
    let userAddress2 = values.address2;
    let userCardName = values.cardName;
    let userCardNumber = values.cardNumber;
    let userCardExpireMonth = values.cardExpireMonth;
    let userCardExpireYear = values.cardExpireYear;
    let userCardCVV = values.cardCVV;

    try {
      debugger
      const { data } = await axios.post('http://localhost:3003/user/payment', {
        name: userName,
        address: userAddress,
        address2: userAddress2,
        cardName: userCardName,
        cardNumber: userCardNumber,
        cardExpireMonth: userCardExpireMonth,
        cardExpireYear: userCardExpireYear,
        cardCVV: userCardCVV,
        products: cartIteams,
        payedMoney: totalPrice
      }, {
        headers: {
          env: 'test',
          Authorization: localStorage.getItem('JwtToken')
        }
      })

      if (data) {
        toast.success(data.message)
      }
    } catch (error) {
      if (error.response.data) toast.error(error.response.data)
    }
  }

  return (
    <Formik
      initialValues={{
        name: '',
        address: '',
        address2: '',
        cardName: '',
        cardNumber: '',
        cardExpireMonth: '',
        cardExpireYear: '',
        cardCVV: ''
      }}
      validate={values => {
        const errors = {};
        if (!values.name) {
          errors.name = 'name is required.';
        }
        if (!values.address) {
          errors.address = 'address is required.';
        }
        if (!values.address2) {
          errors.address2 = 'sub address is required.';
        }
        if (!values.cardName) {
          errors.cardName = 'card name is required.';
        }
        if (!values.cardNumber) {
          errors.cardNumber = 'card number is required.';
        }
        if (!values.cardExpireMonth) {
          errors.cardExpireMonth = 'card expire month is required.';
        }
        if (!values.cardExpireYear) {
          errors.cardExpireYear = 'card expire year is required.';
        }
        if (!values.cardCVV) {
          errors.cardCVV = 'card CVV is required.';
        }
        // console.log({ errors });
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        console.log(values)
        if(values) formSubmitHandler(values)
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        /* and other goodies */
      }) => (
        <div>
          <div className="bg-secondary border-top p-4 text-white mb-3">
            <h1 className="display-6">Checkout</h1>
          </div>
          <div className="container mb-3">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-8"></div>
                <div className="card mb-3">
                  <div className="card-header">
                    <i className="bi bi-truck"></i> Shipping Infomation
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-12">
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name}
                          placeholder="Name"
                        />
                        <small className="text-danger">{errors.name && touched.name && errors.name}</small>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control"
                          name="address"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.address}
                          // ref={address}
                          placeholder="Addresss"
                        />
                        <small className="text-danger">{errors.address && touched.address && errors.address}</small>

                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control"
                          name="address2"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.address2}
                          // ref={address2}
                          placeholder="Address 2 (Optional)"
                        />
                        <small className="text-danger">{errors.address2 && touched.address2 && errors.address2}</small>

                      </div>
                      {/* <div className="col-md-4">
                    <select className="form-select" >
                      <option value>-- Country --</option>
                      <option>United States</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <select className="form-select" >
                      <option value>-- State --</option>
                      <option>California</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Zip"
                      
                    />
                  </div> */}
                    </div>
                  </div>
                </div>

                {/* <div className="card mb-3">
              <div className="card-header">
                <i className="bi bi-receipt"></i> Billing Infomation
                <div className="form-check form-check-inline ms-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    defaultValue
                    id="flexCheckDefault"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Same as Shipping Infomation
                  </label>
                </div>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-12">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name"
                      
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Addresss"
                      
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Address 2 (Optional)"
                    />
                  </div>
                  <div className="col-md-4">
                    <select className="form-select" >
                      <option value>-- Country --</option>
                      <option>United States</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <select className="form-select" >
                      <option value>-- State --</option>
                      <option>California</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Zip"
                      
                    />
                  </div>
                </div>
              </div>
            </div> */}

                <div className="card mb-3 border-info">
                  <div className="card-header bg-info">
                    <i className="bi bi-credit-card-2-front"></i> Payment Method
                  </div>
                  <div className="card-body">
                    <div className="row g-3 mb-3 border-bottom">
                      <div className="col-md-6">
                        <div className="form-check">
                          <input
                            id="credit"
                            name="paymentMethod"
                            type="radio"
                            className="form-check-input"
                            defaultChecked

                          />
                          <label className="form-check-label" htmlFor="credit">
                            Credit card
                            <img
                              src="../../images/payment/cards.webp"
                              alt="..."
                              className="ms-3"
                              height={26}
                            />
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-check">
                          <input
                            id="paypal"
                            name="paymentMethod"
                            type="radio"
                            className="form-check-input"

                          />
                          <label className="form-check-label" htmlFor="paypal">
                            PayPal
                            <img
                              src="../../images/payment/paypal_64.webp"
                              alt="..."
                              className="ms-3"
                              height={26}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control"
                          name="cardName"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.cardName}
                          // ref={cardName}
                          placeholder="Name on card"
                        />
                        <small className="text-danger">{errors.cardName && touched.cardName && errors.cardName}</small>

                      </div>
                      <div className="col-md-6">
                        <input
                          type="number"
                          className="form-control"
                          name="cardNumber"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.cardNumber}
                          // ref={cardNumber}
                          placeholder="Card number"
                        />
                        <small className="text-danger">{errors.cardNumber && touched.cardNumber && errors.cardNumber}</small>

                      </div>
                      <div className="col-md-4">
                        <input
                          type="number"
                          className="form-control"
                          name="cardExpireMonth"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.cardExpireMonth}
                          // ref={cardExpireMonth}
                          placeholder="Expiration month"
                        />
                        <small className="text-danger">{errors.cardExpireMonth && touched.cardExpireMonth && errors.cardExpireMonth}</small>

                      </div>
                      <div className="col-md-4">
                        <input
                          type="number"
                          className="form-control"
                          name="cardExpireYear"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.cardExpireYear}
                          // ref={cardExpireYear}
                          placeholder="Expiration year"
                        />
                        <small className="text-danger">{errors.cardExpireYear && touched.cardExpireYear && errors.cardExpireYear}</small>

                      </div>
                      <div className="col-md-4">
                        <input
                          type="number"
                          className="form-control"
                          name="cardCVV"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.cardCVV}
                          // ref={cardCVV}
                          placeholder="CVV"
                        />
                        <small className="text-danger">{errors.cardCVV && touched.cardCVV && errors.cardCVV}</small>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer border-info d-grid">
                    <button type="submit"
                      className="btn btn-info"
                      disabled={isSubmitting}
                    >
                      Pay Now <strong>${totalPrice}</strong>
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <div className="card-header">
                    <i className="bi bi-cart3"></i> Cart{" "}
                    <span className="badge bg-secondary float-end">{cartIteams.length}</span>
                  </div>
                  <ul className="list-group list-group-flush">

                    {
                      Array.isArray(cartIteams) &&
                      cartIteams.map(item => (
                        <li className="list-group-item d-flex justify-content-between lh-sm">
                          <div>
                            <h6 className="my-0">{item.product.productName}</h6>
                            <small className="text-muted">{item.product.productDescription}</small>
                          </div>
                          <span className="text-muted">${item.price * item.numberOfProducts}</span>
                        </li>
                      ))
                    }

                    {/* <li className="list-group-item d-flex justify-content-between bg-light">
                  <div className="text-success">
                    <h6 className="my-0">Promo code</h6>
                    <small>EXAMPLECODE</small>
                  </div>
                  <span className="text-success">−$50</span>
                </li> */}
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Total</span>
                      <strong>${totalPrice}</strong>
                    </li>
                  </ul>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default CheckoutView;
