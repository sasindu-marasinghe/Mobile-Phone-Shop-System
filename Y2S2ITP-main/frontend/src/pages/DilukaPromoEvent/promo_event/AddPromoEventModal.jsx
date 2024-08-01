import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { usePromoEventStore } from "../../store/usePromoEventStore";
import {
  useActivePromoEvents,
  usePromoEventData,
} from "../../hooks/usePromoEventData";
import { BootstrapModal } from "../../components";
import PromoEventAPI from "../../api/PromoEventAPI";
import Toast from "../../utils/toast";
import { useState } from "react";
import { handleUpload } from "../../utils/HandleUpload";
import { useDiscountData } from "../../hooks/useDiscountData";
import { useAuthStore } from "../../store/useAuthStore";
import { USER_ROLES } from "../../constants/roles";

const AddPromoEventModal = () => {
  const { user } = useAuthStore((state) => ({
    user: state.user,
  }));
  // Get the state and actions from the store
  const { isAddPromoEventModalOpen, closeAddPromoEventModal } =
    usePromoEventStore((state) => ({
      isAddPromoEventModalOpen: state.isAddPromoEventModalOpen,
      closeAddPromoEventModal: state.closeAddPromoEventModal,
    }));

  // Get refetch function from react-query hook
  let results;
  if (user.role === USER_ROLES.PE_MANAGER) {
    results = usePromoEventData();
  } else {
    results = useActivePromoEvents();
  }
  const { refetch } = results;

  const { data: discounts } = useDiscountData();

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
  const { mutate } = useMutation(PromoEventAPI.createPromoEvent, {
    onSuccess: () => {
      // reset the percent and image state
      setPercent(0);
      setImage("");
      // close the modal and refetch the data
      closeAddPromoEventModal();
      refetch();
      Toast({ type: "success", message: "PromoEvent created successfully" });
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

  const categories = ["event", "promotion"];

  return (
    <BootstrapModal
      show={isAddPromoEventModalOpen}
      handleClose={closeAddPromoEventModal}
      title={
        user.role === USER_ROLES.PE_MANAGER
          ? "Add Promotion/Event"
          : "Request Promotion/Event"
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        {/* Category dropdown */}
        <div className="form-group">
          <label className="my-2" htmlFor="category">
            Category
          </label>
          <select
            className="form-control"
            id="category"
            name="category"
            {...register("category", { required: true })}
          >
            <option value="">Select category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <small className="form-text text-danger">
              Category is required
            </small>
          )}
        </div>

        {/* Details text area */}
        <div className="form-group">
          <label className="my-2" htmlFor="details">
            Details
          </label>
          <textarea
            className="form-control"
            id="details"
            name="details"
            {...register("details", { required: true })}
          />
          {errors.details && (
            <small className="form-text text-danger">Details is required</small>
          )}
        </div>

        {/* Price range and validity input side by side */}
        <div className="form-group">
          <div className="row">
            <div className="col">
              <label className="my-2" htmlFor="priceRange">
                Price Range
              </label>
              <input
                type="text"
                className="form-control"
                id="priceRange"
                name="priceRange"
                {...register("priceRange", { required: true })}
              />
              {errors.priceRange && (
                <small className="form-text text-danger">
                  Price Range is required
                </small>
              )}
            </div>
            {/* date input */}
            <div className="col">
              <label className="my-2" htmlFor="validity">
                Validity
              </label>
              <input
                type="date"
                className="form-control"
                id="validity"
                name="validity"
                {...register("validity", { required: true })}
              />
              {errors.validity && (
                <small className="form-text text-danger">
                  Validity is required
                </small>
              )}
            </div>
          </div>
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

        {/* Discount dropdown */}
        <div className="form-group">
          <label className="my-2" htmlFor="discount">
            Discount
          </label>
          <select
            className="form-control"
            id="discount"
            name="discount"
            {...register("discount", { required: false })}
          >
            <option value="">Select discount</option>
            {discounts &&
              discounts.data.discounts.map((discount, index) => (
                <option key={index} value={discount._id}>
                  {discount.title} - {discount.percentage}%
                </option>
              ))}
          </select>
          {errors.discount && (
            <small className="form-text text-danger">
              Discount is required
            </small>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary mt-3"
          disabled={percent < 100 || !image}
        >
          Submit
        </button>
      </form>
    </BootstrapModal>
  );
};

export default AddPromoEventModal;
