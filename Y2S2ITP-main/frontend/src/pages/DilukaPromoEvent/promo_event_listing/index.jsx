import React, { useState, useMemo } from "react";
import { useActivePromoEvents } from "../../hooks/usePromoEventData";
import { useAuthStore } from "../../store/useAuthStore";
import { USER_ROLES } from "../../constants/roles";
import { usePromoEventStore } from "../../store/usePromoEventStore";
import AddPromoEventModal from "../promo_event/AddPromoEventModal";

const Index = () => {
  const { data: promoEventItems } = useActivePromoEvents();
  const { user } = useAuthStore((state) => ({
    user: state.user,
  }));
  //
  const { openAddPromoEventModal, searchQuery, setSearchQuery } =
    usePromoEventStore((state) => ({
      openAddPromoEventModal: state.openAddPromoEventModal,
      searchQuery: state.searchQuery,
      setSearchQuery: state.setSearchQuery,
    }));
  // filter promo events based on search query
  const filteredPromoEvents = useMemo(() => {
    return promoEventItems?.data.promoEvents.filter((promoEvent) => {
      if (searchQuery) {
        return promoEvent.details
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      }
      return true;
    });
  }, [promoEventItems, searchQuery]);
  //
  return (
    <>
      <AddPromoEventModal />

      <div className="container mt-4">
        <h1 className="text-center mb-4">Promotions & Events</h1>

        {user.role === USER_ROLES.EA_MANAGER && (
          <div className="d-flex justify-content-end mb-4">
            <button
              className="btn btn-primary"
              onClick={() => openAddPromoEventModal()}
            >
              Request Promotion/Event
            </button>
          </div>
        )}

        <div className="row">
          {filteredPromoEvents &&
            filteredPromoEvents.map((promoEvent, index) => (
              <div key={index} className="col-12 col-md-6 col-lg-4 mb-4">
                <div className="card h-100">
                  <div className="row g-0">
                    <div className="col-4 position-relative">
                      <img
                        src={promoEvent.image}
                        alt={promoEvent.title}
                        className="img-fluid w-100 h-100"
                        style={{
                          objectFit: "cover",
                          borderRadius: "0.25rem 0 0 0.25rem",
                          // min height
                          minHeight: "200px",
                        }}
                      />
                      {promoEvent.discount && (
                        <span
                          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success"
                          style={{ zIndex: "1", left: "-5px", top: "5px" }}
                        >
                          -{promoEvent.discount.percentage}%
                        </span>
                      )}
                    </div>
                    <div className="col-8">
                      <div className="card-body">
                        <h5 className="card-title">{promoEvent.title}</h5>
                        <p className="card-text">{promoEvent.details}</p>
                        <p className="card-text">
                          <strong>Category:</strong> {promoEvent.category}
                        </p>
                        <p
                          className="card-text"
                          style={{
                            textDecoration: promoEvent.discount
                              ? "line-through"
                              : "none",
                          }}
                        >
                          <strong>Price Range:</strong> {promoEvent.priceRange}
                          /=
                        </p>
                        {promoEvent.discount && (
                          <p className="card-text">
                            <strong>After Discount:</strong>{" "}
                            {promoEvent.priceRange -
                              (promoEvent.priceRange *
                                promoEvent.discount.percentage) /
                                100}
                            /=
                          </p>
                        )}
                        <p className="card-text">
                          <strong>Validity:</strong> {promoEvent.validity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Index;
