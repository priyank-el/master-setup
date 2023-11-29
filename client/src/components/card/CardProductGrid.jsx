import { Link } from "react-router-dom";

const CardProductGrid = (props) => {
  const product = props.data;
  return (
    <div className="card">
      {
        product.image
          ?
          <img src={`http://localhost:3003/uploads/product/${product.image}`} className="card-img-top" alt="..." />
          :
          <img src={`http://localhost:3003/uploads/user/no-image.jpeg`} className="img-fluid" alt="..." />
      }

      {/* {product.isNew && (
        <span className="badge bg-success position-absolute mt-2 ms-2">
          New
        </span>
      )} */}
      {product.isHot && (
        <span className="badge bg-danger position-absolute r-0 mt-2 me-2">
          Hot
        </span>
      )}
      {/* {(product.discountPercentage > 0 || product.discountPrice > 0) && (
        <span
          className={`rounded position-absolute p-2 bg-warning  ms-2 small ${
            product.isNew ? "mt-5" : "mt-2"
          }`}
        >
          -
          {product.discountPercentage > 0
            ? product.discountPercentage + "%"
            : "$" + product.discountPrice}
        </span>
      )} */}
      <div className="card-body">
        <h6 className="card-subtitle mb-2">
          <Link to={product.link} className="text-decoration-none">
            {product.productName}
          </Link>
        </h6>
        <div className="my-2">
          <span className="fw-bold h5">${product.price}</span>
          {/* {product.price > 0 && (
            <del className="small text-muted ms-2">${product.price}</del>
          )} */}
          {/* <span className="ms-2">
            {Array.from({ length: product.star }, (_, key) => (
              <i className="bi bi-star-fill text-warning me-1" key={key} />
            ))}
          </span> */}
        </div>
        <div className="btn-group  d-flex" role="group">
          <button
            type="button"
            className="btn btn-sm btn-primary"
            title="Add to cart"
          >
            <i className="bi bi-cart-plus" />
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            title="Add to wishlist"
          >
            <i className="bi bi-heart-fill" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardProductGrid;
