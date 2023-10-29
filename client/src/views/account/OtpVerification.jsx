function OtpVerification() {
  const resendOtpHandler = () => {}

  const onfinish = () => {}

  return (
    <>
      <div className="d-flex justify-content-center">
        <div style={{ height: "500px", width: "400px" }}>
          <label for="exampleInputEmail1">Otp </label>
          <input
            type="text"
            class="form-control"
            id="otpInput"
            placeholder="Enter otp"
          />

          <button type="submit" class="btn btn-primary">
            Verify
          </button>
        </div>
      </div>
    </>
  )
}

export default OtpVerification
