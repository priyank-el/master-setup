import { lazy } from "react";
const UpdatePasswordForm = lazy(() =>
  import("../../components/account/UpdatePasswordForm")
);

const UpdatNewPassword = () => {
  const onSubmit = async (values) => {
    alert(JSON.stringify(values));
  };
  return (
    <div className="container my-3">
      <div className="row justify-content-md-center ">
        <div className="col-md-4 p-3">
          <UpdatePasswordForm onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  );
};

export default UpdatNewPassword;
