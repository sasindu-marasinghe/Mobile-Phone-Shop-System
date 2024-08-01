import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useDiscountStore } from "../../store/useDiscountStore";
import { useDiscountData } from "../../hooks/useDiscountData";
import { BootstrapModal } from "../../components";
import Toast from "../../utils/toast";
import DiscountAPI from "../../api/DiscountAPI";
import { handleUpload } from "../../utils/HandleUpload";

const EditDiscountModal = () => {
  // Get the state and actions from the store
  const { isEditDiscountModalOpen, closeEditDiscountModal, selectedDiscount } =
    useDiscountStore((state) => ({
      isEditDiscountModalOpen: state.isEditDiscountModalOpen,
      closeEditDiscountModal: state.closeEditDiscountModal,
      selectedDiscount: state.selectedDiscount,
    }));

  // Get refetch function from react-query hook
  const { refetch } = useDiscountData();

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
  const { mutate } = useMutation(DiscountAPI.updateDiscount, {
    onSuccess: () => {
      // reset the percent and image state
      setPercent(0);
      setImage("");
      // close the modal and refetch the data
      refetch();
      closeEditDiscountModal();
      Toast({ type: "success", message: "Discount updated successfully" });
    },
  });

  // Submit function
  const onSubmit = (data) => {
    // add the image to the data
    data.image = image;
    mutate({ id: selectedDiscount._id, data });
    reset();
    // reset the percent and image state
    setPercent(0);
    setImage("");
  };

  useEffect(() => {
    // Set the form values when the selectedDiscount changes
    if (selectedDiscount) {
      setValue("title", selectedDiscount.title);
      setValue("description", selectedDiscount.description);
      setValue("percentage", selectedDiscount.percentage);
      setImage(selectedDiscount.image);
    }
  }, [selectedDiscount, setValue]);

  return (
    <BootstrapModal
      show={isEditDiscountModalOpen}
      handleClose={closeEditDiscountModal}
      title={`Edit: ${selectedDiscount?.title}`}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2">
          <label htmlFor="title" className="form-label">
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

        <div className="mb-2">
          <label htmlFor="description" className="form-label">
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

        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Current Image
          </label>
          <br />
          <img
            src={selectedDiscount?.image}
            alt={selectedDiscount?.name}
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

        <div className="mb-2">
          <label htmlFor="percentage" className="form-label">
            Percentage
          </label>
          <input
            type="number"
            className="form-control"
            id="percentage"
            name="percentage"
            {...register("percentage", { required: true })}
          />
          {errors.percentage && (
            <small className="form-text text-danger">
              Percentage is required
            </small>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
    </BootstrapModal>
  );
};

export default EditDiscountModal;
