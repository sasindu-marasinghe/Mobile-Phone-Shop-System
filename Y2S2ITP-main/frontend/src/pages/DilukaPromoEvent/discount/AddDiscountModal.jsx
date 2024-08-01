import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useDiscountStore } from "../../store/useDiscountStore";
import { useDiscountData } from "../../hooks/useDiscountData";
import { BootstrapModal } from "../../components";
import DiscountAPI from "../../api/DiscountAPI";
import Toast from "../../utils/toast";
import { useState } from "react";
import { handleUpload } from "../../utils/HandleUpload";

const AddDiscountModal = () => {
  // Get the state and actions from the store
  const { isAddDiscountModalOpen, closeAddDiscountModal } = useDiscountStore(
    (state) => ({
      isAddDiscountModalOpen: state.isAddDiscountModalOpen,
      closeAddDiscountModal: state.closeAddDiscountModal,
    })
  );

  // Get refetch function from react-query hook
  const { refetch } = useDiscountData();

  // React hook form setup
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  const [image, setImage] = useState("");
  const [file, setFile] = useState("");
  const [percent, setPercent] = useState(0);

  // Handle image upload
  const handleImageUpload = (e) => {
    // const file = e.target.files[0];
    setFile(file);
    handleUpload({ file, setPercent, setImage });
  };

  // Handle change
  function handleChange(event) {
    setFile(event.target.files[0]);
  }

  // Create mutation
  const { mutate } = useMutation(DiscountAPI.createDiscount, {
    onSuccess: () => {
      // reset the percent and image state
      setPercent(0);
      setImage("");
      // close the modal and refetch the data
      closeAddDiscountModal();
      refetch();
      Toast({ type: "success", message: "Discount created successfully" });
    },
    onError: (error) => {
      Toast({ type: "error", message: error.message });
    },
  });

  // Submit function
  const onSubmit = (values) => {
    values.image = image;
    values.percentage = Number(values.percentage);
    mutate(values);
    reset();
    // reset the percent and image state
    setPercent(0);
    setImage("");
  };

  return (
    <BootstrapModal
      show={isAddDiscountModalOpen}
      handleClose={closeAddDiscountModal}
      title="Add Discount"
    >
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="form-group">
          <label className="my-2" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            {...register("title", { required: true })}
          />
          {errors.title && (
            <small className="form-text text-danger">Title is required</small>
          )}
        </div>

        <div className="form-group">
          <label className="my-2" htmlFor="description">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            {...register("description", { required: true })}
          />
          {errors.description && (
            <small className="form-text text-danger">
              Description is required
            </small>
          )}
        </div>

        <div className="form-group">
          <label className="my-2" htmlFor="image">
            Image
          </label>
          <input
            type="file"
            className="form-control"
            id="image"
            placeholder="Upload image"
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={handleImageUpload}
            disabled={!file || percent === 100}
            // add suitable color to the button
            className="btn btn-outline-dark mt-2 btn-sm"
          >
            Upload
          </button>
          <div className="progress mt-2">
            <div
              className={`progress-bar bg-success ${
                percent < 100
                  ? "progress-bar-animated progress-bar-striped"
                  : ""
              }`}
              role="progressbar"
              style={{ width: `${percent}%` }}
              aria-valuenow={percent}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {percent < 100 ? `Uploading ${percent}%` : `Uploaded ${percent}%`}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="my-2" htmlFor="percentage">
            Percentage (0-100)
          </label>
          <input
            type="number"
            className="form-control"
            id="percentage"
            name="percentage"
            {...register("percentage", { required: true })}
            min="0"
            max="100"
          />
          {errors.percentage && (
            <small className="form-text text-danger">
              Percentage is required
            </small>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary mt-3"
          disabled={percent < 100}
        >
          Submit
        </button>
      </form>
    </BootstrapModal>
  );
};

export default AddDiscountModal;
