import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { usePromoEventStore } from "../../store/usePromoEventStore";
import { usePromoEventData } from "../../hooks/usePromoEventData";
import { BootstrapModal } from "../../components";
import Toast from "../../utils/toast";
import PromoEventAPI from "../../api/PromoEventAPI";
import { handleUpload } from "../../utils/HandleUpload";
import { useDiscountData } from "../../hooks/useDiscountData";

const EditPromoEventModal = () => {
  // Get the state and actions from the store
  const {
    isEditPromoEventModalOpen,
    closeEditPromoEventModal,
    selectedPromoEvent,
  } = usePromoEventStore((state) => ({
    isEditPromoEventModalOpen: state.isEditPromoEventModalOpen,
    closeEditPromoEventModal: state.closeEditPromoEventModal,
    selectedPromoEvent: state.selectedPromoEvent,
  }));

  // Get refetch function from react-query hook
  const { refetch } = usePromoEventData();
  const { data: discounts } = useDiscountData();

  // React hook form setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
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

  // Update mutation
  const { mutate } = useMutation(PromoEventAPI.updatePromoEvent, {
    onSuccess: () => {
      // reset the percent and image state
      setPercent(0);
      setImage("");
      // close the modal and refetch the data
      refetch();
      closeEditPromoEventModal();
      Toast({ type: "success", message: "PromoEvent updated successfully" });
    },
  });

  // Submit function
  const onSubmit = (data) => {
    console.log(data);
    // add the image to the data
    data.image = image;
    mutate({ id: selectedPromoEvent._id, data });
    reset();
    // reset the percent and image state
    setPercent(0);
    setImage("");
  };

  useEffect(() => {
    // Set the form values when the selectedPromoEvent changes
    if (selectedPromoEvent) {
      setValue("details", selectedPromoEvent.details);
      setValue("category", selectedPromoEvent.category);
      setValue("validity", selectedPromoEvent.validity);
      setValue("status", selectedPromoEvent.status);
      setValue("priceRange", selectedPromoEvent.priceRange);
      setImage(selectedPromoEvent.image);
      // if discount is available, set the discount value
      if (selectedPromoEvent.discount) {
        setValue("discount", selectedPromoEvent.discount._id);
      } else {
        setValue("discount", "");
      }
    }
  }, [selectedPromoEvent, setValue]);

  const categories = ["event", "promotion"];

  return (
    <BootstrapModal
      show={isEditPromoEventModalOpen}
      handleClose={closeEditPromoEventModal}
      title={`Edit: ${selectedPromoEvent?.details}`}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* category */}
        <div className="form-group mb-3">
          <label htmlFor="category">Category</label>
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
        <div className="form-group mb-3">
          <label htmlFor="details">Details</label>
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
        <div className="form-group mb-3">
          <div className="row">
            <div className="col">
              <label htmlFor="priceRange">Price Range</label>
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
            <div className="col">
              <label htmlFor="validity">Validity</label>
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

        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Current Image
          </label>
          <br />
          <img
            src={selectedPromoEvent?.image}
            alt={selectedPromoEvent?.name}
            width="50"
            height="50"
          />
        </div>

        {/* image */}
        <div className="form-group mb-3">
          <label htmlFor="image">New Image</label>
          <input
            type="file"
            className="form-control"
            id="image"
            placeholder="Upload image"
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={handleImageUpload}
            disabled={!file || percent === 100}
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
        <div className="form-group mb-3">
          <label htmlFor="discount">Discount</label>
          <select
            className="form-control"
            id="discount"
            name="discount"
            {...register("discount", { required: false })}
          >
            <option value="">Select discount</option>
            {discounts &&
              discounts.data.discounts.map((discount) => (
                <option key={discount._id} value={discount._id}>
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

        {/* status - ["pending", "active", "rejected"] */}
        <div className="form-group mb-3">
          <label htmlFor="status">Status</label>
          <select
            className="form-control"
            id="status"
            name="status"
            {...register("status", { required: true })}
          >
            <option value="">Select status</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="rejected">Rejected</option>
          </select>
          {errors.status && (
            <small className="form-text text-danger">Status is required</small>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
    </BootstrapModal>
  );
};

export default EditPromoEventModal;
