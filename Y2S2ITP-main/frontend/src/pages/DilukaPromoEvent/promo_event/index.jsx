import Button from "react-bootstrap/Button";
import { useMutation } from "@tanstack/react-query";
import { usePromoEventStore } from "../../store/usePromoEventStore";
import { usePromoEventData } from "../../hooks/usePromoEventData";
import { confirmMessage } from "../../utils/Alert";
import Toast from "../../utils/toast";
import PromoEventAPI from "../../api/PromoEventAPI";
import AddPromoEventModal from "./AddPromoEventModal";
import EditPromoEventModal from "./EditPromoEventModal";
import ViewPromoEventModal from "./ViewPromoEventModal";
import { BootstrapTable } from "../../components";
import { generatePDF } from "../../utils/GeneratePDF";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoMdDownload } from "react-icons/io";
import { AiTwotoneDelete } from "react-icons/ai";
import { MdEditSquare } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";

const index = () => {
  // Get the state and actions from the store
  const {
    openAddPromoEventModal,
    openEditPromoEventModal,
    openViewPromoEventModal,
    setSelectedPromoEvent,
  } = usePromoEventStore((state) => ({
    openAddPromoEventModal: state.openAddPromoEventModal,
    openEditPromoEventModal: state.openEditPromoEventModal,
    openViewPromoEventModal: state.openViewPromoEventModal,
    setSelectedPromoEvent: state.setSelectedPromoEvent,
  }));

  // Get the data from the react-query hook
  const { data, refetch } = usePromoEventData();

  // Delete mutation
  const { mutate } = useMutation(PromoEventAPI.deletePromoEvent, {
    onSuccess: () => {
      refetch();
      Toast({ type: "success", message: "PromoEvent deleted successfully" });
    },
    onError: (error) => {
      Toast({ type: "error", message: error?.response?.data?.message });
    },
  });

  // Delete function
  const onDelete = (id) => {
    confirmMessage("Are you sure?", "This action cannot be undone.", () => {
      mutate(id);
    });
  };

  // Edit function
  const handleEdit = (promoEvent) => {
    setSelectedPromoEvent(promoEvent);
    openEditPromoEventModal();
  };

  // PDF report function
  const downloadPDF = () => {
    const promoEventCount = data.data.promoEvents.length;
    data.data.promoEvents.forEach((promoEvent) => {
      // promoEvent.discount_percentage = promoEvent?.discount?.percentage;
      if (promoEvent.discount) {
        promoEvent.discount_percentage = promoEvent.discount.percentage;
      } else {
        promoEvent.discount_percentage = "N/A";
      }
    });
    //
    const additionalInfo = `Total PromoEvents: ${promoEventCount}`;
    //
    generatePDF(
      additionalInfo,
      [
        "category",
        "details",
        "priceRange",
        "validity",
        "discount_percentage",
        "status",
      ],
      data.data.promoEvents,
      "promoEvents-report"
    );
  };

  // Update the status of the promo event
  // Update mutation
  const { mutate: updatePromoEvent } = useMutation(
    PromoEventAPI.updatePromoEvent,
    {
      onSuccess: () => {
        refetch();
        Toast({ type: "success", message: "PromoEvent updated successfully" });
      },
    }
  );

  // Update status function
  const updateStatus = (id) => {
    updatePromoEvent({ id, data: { status: "active" } });
  };

  return (
    <div className="container mt-2">
      <AddPromoEventModal />
      <EditPromoEventModal />
      <ViewPromoEventModal />

      <h1 className="mb-4">Promotions & Events</h1>

      <Button
        variant="primary"
        className="m-1"
        onClick={openAddPromoEventModal}
      >
        <IoMdAddCircleOutline className="mb-1" /> <span>Add</span>
      </Button>

      {/* Download PDF report */}
      <Button variant="success" className="m-1" onClick={downloadPDF}>
        <IoMdDownload className="mb-1" /> <span>Download Report</span>
      </Button>

      <div className="mt-5">
        <BootstrapTable
          headers={[
            "Image",
            "Category",
            "Price Range",
            "Validity",
            "Discount",
            "Status",
            "Actions",
          ]}
          children={
            data &&
            data.data.promoEvents.map((promoEvent) => (
              <tr key={promoEvent._id}>
                <td>
                  <img
                    src={promoEvent.image}
                    alt={promoEvent.title}
                    style={{ width: "50px", height: "50px" }}
                  />
                </td>
                <td>{promoEvent.category}</td>
                <td>{promoEvent.priceRange}</td>
                {/* if validity date is passed, show Expired and date else show the date show it with color difference */}
                <td>
                  {new Date(promoEvent.validity) < new Date() ? (
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      Expired: {promoEvent.validity}
                    </span>
                  ) : (
                    promoEvent.validity
                  )}
                </td>
                {/* if discount is available, show the percentage else show "N/A" */}
                <td>
                  {promoEvent.discount
                    ? `${promoEvent.discount.percentage}%`
                    : "N/A"}
                </td>
                {/* is status is pending, show butto to make it active */}
                <td>
                  {promoEvent.status === "pending" ? (
                    <Button
                      className="m-1 px-3"
                      variant="warning"
                      size="sm"
                      onClick={() => updateStatus(promoEvent._id)}
                    >
                      Make Active
                    </Button>
                  ) : (
                    // Show the status if active in green color else in red color pill
                    <span
                      className={`badge ${
                        promoEvent.status === "active"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {promoEvent.status}
                    </span>
                  )}
                </td>
                <td className="align-middle">
                  <Button
                    className="m-1 px-3"
                    variant="info"
                    onClick={() => handleEdit(promoEvent)}
                    size="sm"
                  >
                    <MdEditSquare className="mb-1 mx-1" />
                  </Button>
                  <Button
                    className="m-1 px-3"
                    variant="danger"
                    onClick={() => onDelete(promoEvent._id)}
                    size="sm"
                  >
                    <AiTwotoneDelete className="mb-1 mx-1" />
                  </Button>
                  <Button
                    className="m-1 px-3"
                    variant="success"
                    onClick={() => {
                      setSelectedPromoEvent(promoEvent);
                      openViewPromoEventModal();
                    }}
                    size="sm"
                  >
                    <FaInfoCircle className="mb-1 mx-1" />
                  </Button>
                </td>
              </tr>
            ))
          }
        />
      </div>
    </div>
  );
};

export default index;
