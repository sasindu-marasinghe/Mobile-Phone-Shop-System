import { useDiscountStore } from "../../store/useDiscountStore";
import { BootstrapModal } from "../../components";

const ViewDiscountModal = () => {
  // Get the state and actions from the store
  const { isViewDiscountModalOpen, closeViewDiscountModal, selectedDiscount } =
    useDiscountStore((state) => ({
      isViewDiscountModalOpen: state.isViewDiscountModalOpen,
      closeViewDiscountModal: state.closeViewDiscountModal,
      selectedDiscount: state.selectedDiscount,
    }));

  return (
    <BootstrapModal
      show={isViewDiscountModalOpen}
      handleClose={closeViewDiscountModal}
      title={selectedDiscount?.title}
    >
      {/* deatils left side uimage and right side*/}
      <div className="d-flex justify-content-between">
        {/* image */}
        <div>
          <p>
            <strong>Description:</strong> {selectedDiscount?.description}
          </p>
          <p>
            <strong>Percentage:</strong> {selectedDiscount?.percentage}%
          </p>
        </div>
        <img
          src={selectedDiscount?.image}
          alt={selectedDiscount?.title}
          className="img-fluid"
          style={{ maxHeight: "100px" }}
        />
      </div>

      <div className="d-flex justify-content-end mt-3">
        <button className="btn btn-secondary" onClick={closeViewDiscountModal}>
          Close
        </button>
      </div>
    </BootstrapModal>
  );
};

export default ViewDiscountModal;
