import Button from "react-bootstrap/Button";
import { useMutation } from "@tanstack/react-query";
import { useDiscountStore } from "../../store/useDiscountStore";
import { useDiscountData } from "../../hooks/useDiscountData";
import { confirmMessage } from "../../utils/Alert";
import Toast from "../../utils/toast";
import DiscountAPI from "../../api/DiscountAPI";
import AddDiscountModal from "./AddDiscountModal";
import EditDiscountModal from "./EditDiscountModal";
import ViewDiscountModal from "./ViewDiscountModal";
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
    openAddDiscountModal,
    openEditDiscountModal,
    openViewDiscountModal,
    setSelectedDiscount,
  } = useDiscountStore((state) => ({
    openAddDiscountModal: state.openAddDiscountModal,
    openEditDiscountModal: state.openEditDiscountModal,
    openViewDiscountModal: state.openViewDiscountModal,
    setSelectedDiscount: state.setSelectedDiscount,
  }));

  // Get the data from the react-query hook
  const { data, refetch } = useDiscountData();

  // Delete mutation
  const { mutate } = useMutation(DiscountAPI.deleteDiscount, {
    onSuccess: () => {
      refetch();
      Toast({ type: "success", message: "Discount deleted successfully" });
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
  const handleEdit = (discount) => {
    setSelectedDiscount(discount);
    openEditDiscountModal();
  };

  // PDF report function
  const downloadPDF = () => {
    const discountCount = data.data.discounts.length;
    // add % to the percentage field
    data.data.discounts.forEach((discount) => {
      discount.percentage = discount.percentage + "%";
    });
    //
    const additionalInfo = `Total Discounts: ${discountCount}`;
    //
    generatePDF(
      additionalInfo,
      ["title", "description", "percentage"],
      data.data.discounts,
      "discounts-report"
    );
  };

  return (
    <div className="container mt-2">
      <AddDiscountModal />
      <EditDiscountModal />
      <ViewDiscountModal />

      <h1 className="mb-4">Discounts</h1>

      <Button variant="primary" className="m-1" onClick={openAddDiscountModal}>
        <IoMdAddCircleOutline className="mb-1" /> <span>Add</span>
      </Button>

      {/* Download PDF report */}
      <Button variant="success" className="m-1" onClick={downloadPDF}>
        <IoMdDownload className="mb-1" /> <span>Download Report</span>
      </Button>

      <div className="mt-5">
        <BootstrapTable
          headers={["Image", "Title", "Description", "Percentage", "Actions"]}
          children={
            data &&
            data.data.discounts.map((discount) => (
              <tr key={discount._id}>
                <td>
                  <img
                    src={discount.image}
                    alt={discount.title}
                    style={{ width: "50px", height: "50px" }}
                  />
                </td>
                <td>{discount.title}</td>
                <td>{discount.description}</td>
                <td>{discount.percentage}%</td>
                <td className="align-middle">
                  <Button
                    className="m-1 px-3"
                    variant="info"
                    onClick={() => handleEdit(discount)}
                    size="sm"
                  >
                    <MdEditSquare className="mb-1 mx-1" />
                  </Button>
                  <Button
                    className="m-1 px-3"
                    variant="danger"
                    onClick={() => onDelete(discount._id)}
                    size="sm"
                  >
                    <AiTwotoneDelete className="mb-1 mx-1" />
                  </Button>
                  <Button
                    className="m-1 px-3"
                    variant="success"
                    onClick={() => {
                      setSelectedDiscount(discount);
                      openViewDiscountModal();
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
