import { usePromoEventStore } from "../../store/usePromoEventStore";
import { BootstrapModal } from "../../components";

const ViewPromoEventModal = () => {
  // Get the state and actions from the store
  const {
    isViewPromoEventModalOpen,
    closeViewPromoEventModal,
    selectedPromoEvent,
  } = usePromoEventStore((state) => ({
    isViewPromoEventModalOpen: state.isViewPromoEventModalOpen,
    closeViewPromoEventModal: state.closeViewPromoEventModal,
    selectedPromoEvent: state.selectedPromoEvent,
  }));

  return (
    <BootstrapModal
      show={isViewPromoEventModalOpen}
      handleClose={closeViewPromoEventModal}
      title={selectedPromoEvent?.category}
    >
      {/* deatils left side uimage and right side*/}
      <div className="d-flex justify-content-between">
        {/* image */}
        <div>
          <p>
            <strong>Details:</strong> {selectedPromoEvent?.details}
          </p>
          <p>
            <strong>Price Range:</strong> {selectedPromoEvent?.priceRange}
          </p>
          {/* show the discount if it exists */}
          {selectedPromoEvent?.discount && (
            <p>
              <strong>Discount:</strong>{" "}
              {selectedPromoEvent.discount.percentage}%
            </p>
          )}
          <p>
            <strong>Validity:</strong>{" "}
            {new Date(selectedPromoEvent?.validity) < new Date() ? (
              <span style={{ color: "red", fontWeight: "bold" }}>
                Expired: {selectedPromoEvent?.validity}
              </span>
            ) : (
              selectedPromoEvent?.validity
            )}
          </p>
          <p>
            <strong>Status:</strong> {selectedPromoEvent?.status}
          </p>
        </div>
        <img
          src={selectedPromoEvent?.image}
          alt={selectedPromoEvent?.title}
          className="img-fluid"
          style={{ maxHeight: "100px" }}
        />
      </div>

      <div className="d-flex justify-content-end mt-3">
        <button
          className="btn btn-secondary"
          onClick={closeViewPromoEventModal}
        >
          Close
        </button>
      </div>
    </BootstrapModal>
  );
};

export default ViewPromoEventModal;
